const pdfGenerate = require('./pdf-generate');
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')

function findFile(fileName){
  let fname = fileName;
  fname = fname.replace(/.pdf$/g,'.docx')
  return fs.existsSync(fname)
}


const pdf2word = (filePath)=>{
  return new Promise(async (resolve,reject)=>{
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--start-maximized','--no-sandbox'],
    })
    const page = await browser.newPage()
    page.setViewport({width: 1920, height: 1080})
    await page.goto('https://www.camscanner.com/pdftoword',{ waitUntil: 'networkidle0'});
    const client = await page.target().createCDPSession()
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow', 
      downloadPath: __dirname
    });
    const uoloadFile = await page.waitForSelector('input.upload_file',{timeout:0});

    await uoloadFile.uploadFile(filePath);
    
    const downloadBtn = await page.waitForSelector('.download_btn',{timeout:0})
    downloadBtn.click();


    let downloaded = false
    let interval = setInterval(()=>{
      let fileUrl = filePath.replace(/.pdf$/g,'.docx');
      downloaded = fs.existsSync(fileUrl)
      if(downloaded){
        console.log('file downloaded')
        clearInterval(interval)
        browser.close();
        resolve(fs.readFileSync(fileUrl))
      }
    },500)
  })
}
module.exports = async url=>{
  if(!url) return null;
  const pdf = await pdfGenerate(url);
  console.log('pdf',pdf)
  let fileDir = path.join(__dirname,`tmp/${Date.now()}.pdf`)
  fs.writeFileSync(fileDir,pdf);
  return await pdf2word(fileDir)
}