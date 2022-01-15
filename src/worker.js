(function() {
  importScripts('/tpl/jhin/js/heif-web-display/dist/wasm_heif.js');
  importScripts('/tpl/jhin/js/heif-web-display/dist/wasm_mozjpeg.js');

  const cacheName = 'ConvertHeicToPng';
  const cacheVersion = 'r=6';
  // 3 for RGB, 4 for RGBA (must adapt options.in_color_space!)
  const defaultJpegChannels = 4;
  const defaultJpegOption = {
    quality: 75,
    baseline: false,
    arithmetic: false,
    progressive: true,
    optimize_coding: true,
    smoothing: 0,
    // 2 for JCS_RGB, 6 for RGB, 12 for RGBA
    // see J_COLOR_SPACE in wasm_mozjpeg.d.ts
    in_color_space: 12,
    out_color_space: 3, // J_COLOR_SPACE.JCS_YCbCr
    quant_table: 3,
    trellis_multipass: false,
    trellis_opt_zero: false,
    trellis_opt_table: false,
    trellis_loops: 1,
    auto_subsample: true,
    chroma_subsample: 2,
    separate_chroma_quality: false,
    chroma_quality: 75,
  };

  async function convertHeicToPng(url) {
    // find blob from cache
    try {
      const cache = await caches.open(cacheName);
      const response = await cache.match(new Request(url));
      if (response && response.statusText == cacheVersion) {
        console.log('Found from Cache:', url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch(e) {
      // ignore
      console.log(e)
    }

    const blob = await fetch(url)
      .then(async (data) => {
        const array = new Uint8Array(await data.arrayBuffer());
        const heif = await wasm_heif({
          onRuntimeInitialized() {
            console.log('wasm_heif loaded');
          },
        });
        const rgba = heif.decode(array, array.length, true);
        const dim = heif.dimensions();
        heif.free();

        const jpeg = await wasm_mozjpeg({
          onRuntimeInitialized() {
            console.log('wasm_mozjpeg loaded');
          },
        });
        let output = jpeg.encode(rgba, dim.width, dim.height,
          defaultJpegChannels, defaultJpegOption);
        jpeg.free();

        return new Blob([output], { type: 'image/jpeg' });
      });

    // cache blob
    try {
      const cache = await caches.open(cacheName);
      const options = {statusText: cacheVersion}
      cache.put(new Request(url), new Response(blob, options));
    } catch(e) {
      // ignore
      console.log(e)
    }
    return URL.createObjectURL(blob);
  }

  // web worker
  onmessage = async function (e) {
    e.data.urlPng = await convertHeicToPng(e.data.url);
    postMessage(e.data);
  }
})()
