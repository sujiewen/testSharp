let { DOMImplementation, XMLSerializer } = require('xmldom')
let JsBarcode = require('jsbarcode')
let sharp = require('sharp')

const barcodeFont = '12'

export function autoBarCodeToFile(content, name, localPath, width = '1px', height = '25px') {
  return new Promise((resolve, reject) => {
    try {
      let xmlSerializer = new XMLSerializer()
      //http://www.w3.org/1999/xhtml
      let documentC = new DOMImplementation().createDocument(
        'http://www.w3.org/1999/xhtml',
        'html',
        null
      )
      //http://www.w3.org/2000/svg
      let svgNode = documentC.createElementNS('http://www.w3.org/2000/svg', 'svg')
      try {
        JsBarcode(svgNode, String(content), {
          xmlDocument: documentC,
          displayValue: true, // 是否默认显示条形码数据
          textPosition: 'bottom', // 条形码数据显示的位置
          background: '#fff', // 条形码背景颜色
          width: width,
          height: height,
          fontSize: '12px'
        })

        let lastNodeY = '41'
        if (name) {
          for (let i = 0; i < svgNode.attributes.length; i++) {
            // add namespaces for attributes
            let attr = svgNode.attributes.item(i)
            if (attr.name === 'height') {
              let tValue = attr.nodeValue ? attr.nodeValue : attr.value
              let sValue = tValue
              if (tValue.indexOf('px') >= 0) {
                sValue = tValue.substr(0, tValue.length - 'px'.length)
              }
              tValue = parseInt(sValue) + parseInt(barcodeFont)
              attr.nodeValue = tValue + 'px'
              attr.value = tValue + 'px'
            } else if (attr.name === 'viewBox') {
              let tValue = attr.nodeValue ? attr.nodeValue : attr.value
              let tVList = tValue.split(' ')
              if (tVList.length === 4) {
                let tV = parseInt(tVList[3])
                tV = tV + parseInt(barcodeFont)
                tValue = tVList[0] + ' ' + tVList[1] + ' ' + tVList[2] + ' ' + tV
                attr.nodeValue = tValue
                attr.value = tValue
              }
            }
          }

          for (let j = 0; j < svgNode.childNodes.length; j++) {
            let nodeT = svgNode.childNodes[j]
            if (nodeT.tagName === 'rect') {
              for (let x = 0; x < nodeT.attributes.length; x++) {
                // add namespaces for attributes
                let attrT = nodeT.attributes.item(x)
                if (attrT.name === 'height') {
                  let tVal = attrT.nodeValue ? attrT.nodeValue : attrT.value
                  let sValue = tVal
                  if (tVal.indexOf('px') >= 0) {
                    sValue = tVal.substr(0, tVal.length - 'px'.length)
                  }
                  lastNodeY = parseInt(sValue)
                  tVal = lastNodeY + parseInt(barcodeFont)
                  attrT.nodeValue = tVal + ''
                  attrT.value = tVal + ''
                  break
                }
              }
            }
            // else if (nodeT.tagName === 'g'){
            //     let lastTwo = nodeT.childNodes[nodeT.childNodes.length - 1]
            //     for(let x= 0; x < lastTwo.attributes.length; x++){
            //         // add namespaces for attributes
            //         let attrT = lastTwo.attributes.item(x);
            //         if (attrT.name === 'y') {
            //             let tVal = attrT.nodeValue ? attrT.nodeValue : attrT.value
            //             if (tVal.indexOf('px') >= 0) {
            //                 lastNodeY = tVal.substr(0, tVal.length - 'px'.length)
            //             }
            //             break
            //         }
            //     }
            // }
          }
          //
          // let foreignObject = documentC.createElementNS('http://www.w3.org/2000/svg',"foreignObject");
          // foreignObject.setAttribute("style","font: 10px monospace;word-spacing: 0px");
          // foreignObject.setAttribute("x",0 + '');
          // foreignObject.setAttribute("y", (parseInt(lastNodeY) + 21).toString());
          //
          // let divObject = createTag('div', [], documentC)
          // divObject.setAttribute("style","color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;");
          // divObject.appendChild(documentC.createTextNode(name))
          //
          // foreignObject.appendChild(divObject)
          // svgNode.appendChild(foreignObject);

          let text = documentC.createElementNS('http://www.w3.org/2000/svg', 'text')
          text.appendChild(documentC.createTextNode(name))
          text.setAttribute('style', 'font: 10px monospace;word-spacing: -1px')
          text.setAttribute('x', 0 + '')
          text.setAttribute('y', (parseInt(lastNodeY) + parseInt(barcodeFont) / 2).toString())
          svgNode.appendChild(text)
        }

        let svgText = xmlSerializer.serializeToString(svgNode)
        const roundedCorners1 = Buffer.from(svgText)

        sharp(roundedCorners1).png().toFile(localPath).then(res => {
            console.log(res)
            resolve(res)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
      } catch (e) {
        console.log('autoBarCodeToFile =' + e)
        reject(e)
      }
    } catch (e2) {
      console.log('err Code =' + e2)
      reject(e2)
    }
  })
}

export function autoBarCodeToBuffer(content, name, width = '1.8px', height = '25px') {
  return new Promise((resolve, reject) => {
    try {
      let xmlSerializer = new XMLSerializer()
      //http://www.w3.org/1999/xhtml
      let documentC = new DOMImplementation().createDocument(
        'http://www.w3.org/1999/xhtml',
        'html',
        null
      )
      //http://www.w3.org/2000/svg
      let svgNode = documentC.createElementNS('http://www.w3.org/2000/svg', 'svg')
      try {
        JsBarcode(svgNode, String(content), {
          xmlDocument: documentC,
          displayValue: true, // 是否默认显示条形码数据
          textPosition: 'bottom', // 条形码数据显示的位置
          background: '#fff', // 条形码背景颜色
          width: width,
          height: height,
          fontSize: '12px'
        })

        let lastNodeY = '41'
        if (name) {
          for (let i = 0; i < svgNode.attributes.length; i++) {
            // add namespaces for attributes
            let attr = svgNode.attributes.item(i)
            if (attr.name === 'height') {
              let tValue = attr.nodeValue ? attr.nodeValue : attr.value
              let sValue = tValue
              if (tValue.indexOf('px') >= 0) {
                sValue = tValue.substr(0, tValue.length - 'px'.length)
              }
              tValue = parseInt(sValue) + parseInt(barcodeFont)
              attr.nodeValue = tValue + 'px'
              attr.value = tValue + 'px'
            } else if (attr.name === 'viewBox') {
              let tValue = attr.nodeValue ? attr.nodeValue : attr.value
              let tVList = tValue.split(' ')
              if (tVList.length === 4) {
                let tV = parseInt(tVList[3])
                tV = tV + parseInt(barcodeFont)
                tValue = tVList[0] + ' ' + tVList[1] + ' ' + tVList[2] + ' ' + tV
                attr.nodeValue = tValue
                attr.value = tValue
              }
            }
          }

          for (let j = 0; j < svgNode.childNodes.length; j++) {
            let nodeT = svgNode.childNodes[j]
            if (nodeT.tagName === 'rect') {
              for (let x = 0; x < nodeT.attributes.length; x++) {
                // add namespaces for attributes
                let attrT = nodeT.attributes.item(x)
                if (attrT.name === 'height') {
                  let tVal = attrT.nodeValue ? attrT.nodeValue : attrT.value
                  let sValue = tVal
                  if (tVal.indexOf('px') >= 0) {
                    sValue = tVal.substr(0, tVal.length - 'px'.length)
                  }
                  lastNodeY = parseInt(sValue)
                  tVal = lastNodeY + parseInt(barcodeFont)
                  attrT.nodeValue = tVal + ''
                  attrT.value = tVal + ''
                  break
                }
              }
            }
            // else if (nodeT.tagName === 'g'){
            //     let lastTwo = nodeT.childNodes[nodeT.childNodes.length - 1]
            //     for(let x= 0; x < lastTwo.attributes.length; x++){
            //         // add namespaces for attributes
            //         let attrT = lastTwo.attributes.item(x);
            //         if (attrT.name === 'y') {
            //             let tVal = attrT.nodeValue ? attrT.nodeValue : attrT.value
            //             if (tVal.indexOf('px') >= 0) {
            //                 lastNodeY = tVal.substr(0, tVal.length - 'px'.length)
            //             }
            //             break
            //         }
            //     }
            // }
          }
          //
          // let foreignObject = documentC.createElementNS('http://www.w3.org/2000/svg',"foreignObject");
          // foreignObject.setAttribute("style","font: 10px monospace;word-spacing: 0px");
          // foreignObject.setAttribute("x",0 + '');
          // foreignObject.setAttribute("y", (parseInt(lastNodeY) + 21).toString());
          //
          // let divObject = createTag('div', [], documentC)
          // divObject.setAttribute("style","color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;");
          // divObject.appendChild(documentC.createTextNode(name))
          //
          // foreignObject.appendChild(divObject)
          // svgNode.appendChild(foreignObject);

          let text = documentC.createElementNS('http://www.w3.org/2000/svg', 'text')
          text.appendChild(documentC.createTextNode(name))
          text.setAttribute('style', 'font: 10px monospace;word-spacing: -1px')
          text.setAttribute('x', 0 + '')
          text.setAttribute('y', (parseInt(lastNodeY) + parseInt(barcodeFont) / 2).toString())
          svgNode.appendChild(text)
        }

        let svgText = xmlSerializer.serializeToString(svgNode)
        const roundedCorners1 = Buffer.from(svgText)

        sharp(roundedCorners1).png().toBuffer()
            .then( data => {
                resolve(data)
            })
            .catch( err => {
                console.log('sharp =' + err)
                reject(err) }
            )
      } catch (e) {
        console.log('autoBarCodeToFile =' + e)
        reject(e)
      }
    } catch (e2) {
      console.log('err Code =' + e2)
      reject(e2)
    }
  })
}
