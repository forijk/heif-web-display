(function() {
  importScripts('/tpl/jhin/js/heif-web-display/dist/wasm_heif.js');

  const cacheName = 'ConvertHeicToPng';
  const cacheVersion = 'r=8';

  console.print = console.log;
  console.log = function(...args) {
    try {
      postMessage({console: args});
    } catch {
      console.print(...args);
    }
  }

  if (typeof Atomics == 'undefined') {
    importScripts('/tpl/jhin/js/heif-web-display/dist/atomics.js');
  }

  if (typeof OffscreenCanvas == 'undefined') {
    importScripts('/tpl/jhin/js/heif-web-display/dist/offscreencanvas.js');
  }

  const jobQueue = {
    lock: new Uint8Array(1),
    queue: [],
    work: null,
    run: async function(msg) {
      await this.work(msg);
      this.next();
    },
    next: function() {
      if (this.queue.length < 1) {
        Atomics.store(this.lock, 0, 0);
        return;
      }
      this.run(this.queue.shift());
    },
    add: function(msg) {
      if (Atomics.compareExchange(this.lock, 0, 0, 1) == 0) {
        this.run(msg);
        return;
      }
      this.queue.push(msg);
    },
  };

  async function convertHeicToPng(url) {
    try {
      // find blob from cache
      try {
        const cache = await caches.open(cacheName);
        const response = await cache.match(new Request(url));
        if (response && response.statusText == cacheVersion) {
          console.log('Found from Cache:', response.statusText, url);
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }
      } catch(e) {
        // ignore
        console.log(e);
      }

      const data = await fetch(url);
      const array = new Uint8Array(await data.arrayBuffer());
      const heif = await wasm_heif({
        onRuntimeInitialized() {
          console.log('decode heif...');
        },
      });
      const rgba = heif.decode(array, array.length, true);
      const dim = heif.dimensions();
      heif.free();

      console.log('draw to canvas...', dim);
      console.log('rgba.length:', rgba.length, 'expected:', dim.width * dim.height * 4);
      const canvas = new OffscreenCanvas(dim.width, dim.height);
      canvas._url = url; // set unique id for polyfill
      const ctx = canvas.getContext("2d");
      const imgData = new ImageData(Uint8ClampedArray.from(rgba),
        dim.width, dim.height);
      ctx.putImageData(imgData, 0, 0);

      console.log('convert to png...');
      const blob = await canvas.convertToBlob();

      // cache blob
      try {
        const cache = await caches.open(cacheName);
        const options = {statusText: cacheVersion}
        cache.put(new Request(url), new Response(blob, options));
      } catch(e) {
        // ignore
        console.log(e);
      }
      return URL.createObjectURL(blob);
    } catch (e) {
      // something went wrong
      console.log(e);
      return null;
    }
  }

  jobQueue.work = async function (data) {
    const urlPng = await convertHeicToPng(data.url);
    if (urlPng) {
      data.urlPng = urlPng;
      postMessage(data);
    }
  }

  // web worker
  onmessage = function (e) {
    if (e.data.blob) {
      OffscreenCanvas.resolve(e.data);
    } else {
      jobQueue.add(e.data);
    }
  }
})()
