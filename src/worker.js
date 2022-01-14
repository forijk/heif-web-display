import heicConvert from 'heic-convert'

const cacheName = 'ConvertHeicToPng';

async function convertHeicToPng(url) {
  // find blob from cache
  try {
    const cache = await caches.open(cacheName);
    const response = await cache.match(new Request(url));
    if (response) {
      console.log('found from cache:', url);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch(e) {
    // ignore
    console.log(e)
  }

  const output = await fetch(url)
    .then(async (data) => {
      const buffer = Buffer.from(await data.arrayBuffer())
      return heicConvert({ buffer, format: 'PNG' })
    });
  const blob = new Blob([output], { type: 'image/png' });

  // cache blob
  try {
    const cache = await caches.open(cacheName);
    cache.put(new Request(url), new Response(blob));
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
