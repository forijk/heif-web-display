(function() {
  const workerUrl = '/tpl/jhin/js/heif-web-display/dist/worker.js?r=5';
  const worker = new Worker(workerUrl);
  const promisePool = {};

  worker.onmessage = e => {
    promisePool[e.data.url](e.data.urlPng);
    console.log('ConvertHeicToPng done:', e.data.url);
  };

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
