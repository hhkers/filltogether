import Jimp from 'jimp';

const rgbToHex = function (rgb) {
  var hex = Number(rgb).toString(16);
  if (hex. length < 2) {
    hex = "0" + hex;
  }
  return hex;
};

export const getImagePixels = async (url) => { 
	const im = await Jimp.read(url)
    
    let bitmap = []
    let row = []
    for(let i=0; i<im.bitmap.data.length; i+=4){
      const r = rgbToHex(im.bitmap.data[i])
      const g = rgbToHex(im.bitmap.data[i+1])
      const b = rgbToHex(im.bitmap.data[i+2])
      const str = `#${r}${g}${b}`
      row.push(str)
      if (row.length == im.bitmap.width) {
        bitmap.push(row)
        row = []
      }
    }

    return bitmap
}

