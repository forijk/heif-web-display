import heicConvert from 'heic-convert'

async function ConvertHeicToPng(url) {
  const output = await fetch(url)
    .then(async (data) => {
      const buffer = Buffer.from(await data.arrayBuffer())
      return heicConvert({ buffer, format: 'PNG' })
    });
  return URL.createObjectURL(new Blob([output], {type: 'image/png'}))
}

document.ConvertHeicToPng = ConvertHeicToPng
