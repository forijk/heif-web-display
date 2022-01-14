import heicConvert from 'heic-convert'

const worker = new Worker(new URL('./worker.js?r=3', import.meta.url));
worker.promisePool = {};
worker.onmessage = e => {
  worker.promisePool[e.data.url](e.data.urlPng);
};

async function ConvertHeicToPng(url) {
  let promise = new Promise(function(resolve) {
    worker.promisePool[url] = resolve;
    worker.postMessage({'url': url});
  });
  return promise;
}
document.ConvertHeicToPng = ConvertHeicToPng
