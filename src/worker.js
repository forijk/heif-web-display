import heicConvert from 'heic-convert'

async function convertHeicToPng(url) {
  const output = await fetch(url)
    .then(async (data) => {
      const buffer = Buffer.from(await data.arrayBuffer())
      return heicConvert({ buffer, format: 'PNG' })
    });
  return URL.createObjectURL(new Blob([output], { type: 'image/png' }))
}

// web worker
onmessage = async function (e) {
  e.data.urlPng = await convertHeicToPng(e.data.url);
  postMessage(e.data);
}
