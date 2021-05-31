import fs from 'fs'

let fileNameIndex = 0

class FileManager {
  constructor() {}
  static getFileNameIndex(strUrl) {
    return (
      Math.random()
        .toString(36)
        .substring(7) +
      '' +
      fileNameIndex++
    )
  }
  static saveFile(path, data, callback) {
    try {
      console.log('saveFile=' + path)
      fs.writeFile(path, data, callback)
    } catch (err) {
      console.log('saveFile')
      callback(err)
    }
  }
  static saveFileSync(path, data) {
    try {
      console.log('sff=' + path)
      fs.writeFileSync(path, data)
    } catch (err) {
      console.log(err)
    }
  }
  static deleteFile(path, callback) {
    fs.unlink(path, callback)
  }
  static deleteFileSync(path) {
    fs.unlinkSync(path)
  }
}

export default FileManager
