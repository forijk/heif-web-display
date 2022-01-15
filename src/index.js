(function() {
  const workerUrl = '/tpl/jhin/js/heif-web-display/dist/worker.js?r=-3';
  const worker = new Worker(workerUrl);
  const promisePool = {};

  worker.onmessage = e => {
    if (e.data.console) {
      console.log(...e.data.console);
    } else if (e.data.convertToBlob) {
      ConvertRgbaToPng(e.data);
    } else {
      promisePool[e.data.url](e.data.urlPng);
      delete promisePool[e.data.url];
      console.log('Convert Done:', e.data.url);
    }
  };

  async function ConvertRgbaToPng(args) {
    console.log('convertToBlob', args.url, args.width, args.height);
    const canvas = document.createElement('canvas');
    canvas.width = args.width;
    canvas.height = args.height;
    const ctx = canvas.getContext(...args.getContext);
    ctx.putImageData(...args.putImageData);
    canvas.toBlob(
      blob => {
        worker.postMessage({
          'url': args.url,
          'blob': blob,
        });
      }, 
      args.convertToBlob.type,
      args.convertToBlob.quality
    );
  }

  async function ConvertHeicToPng(url) {
    console.log('ConvertHeicToPng:', url);
    const promise = new Promise(function(resolve) {
      promisePool[url] = resolve;
      worker.postMessage({'url': url});
    });
    return promise;
  }
  document.ConvertHeicToPng = ConvertHeicToPng;
})()
