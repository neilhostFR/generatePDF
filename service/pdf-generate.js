const puppeteer = require('puppeteer')

module.exports = async url=>{
  if(!url) return null;

  let pdf = '';
  try{
    const browser = await puppeteer.launch({
      headless: true,
      // executablePath:'',
      args: ['--no-sandbox']
    })

    const page = await browser.newPage();

    await page.goto(url,{ waitUntil: 'networkidle0'})

    let tmpHeader = '';
    let tmpFooter = '';
    let top = 0;
    let bottom = 0;
    try{
      const tmpHeaderEl = await page.$eval('.tmp-header',e=>{
        let h = e.offsetHeight;
        let html = e.outerHTML;
        e.style.display='none';
        return {h,html}
      });
      tmpHeader = tmpHeaderEl.html;
      top = tmpHeaderEl.h * (2.54 / 96);
    }catch(e){
      tmpHeader = '';
      top = 0;
    }
    
    try{
      const tmpFooterEl = await page.$eval('.tmp-footer',e=>{
        let h = e.offsetHeight;
        let html = e.outerHTML;
        e.style.display='none';
        return {h,html}
      });
      tmpFooter = tmpFooterEl.html; 
      bottom = tmpFooterEl.h * (2.54 / 96);
    }catch(e){
      tmpFooter = '';
      bottom = 0;
    }


    pdf = await page.pdf({
      // path:`./test_${Date.now()}.pdf`,
      format: 'A4',
      margin: {
        top: (top+2).toFixed(1) + 'cm',
        bottom: (bottom+1.5).toFixed(1) + 'cm',
        left: '1cm',
        right: '1cm',
      },
      headerTemplate: `
      <div style="width:100%;padding:0 60px;color: #232323;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;-webkit-font-smoothing: antialiased;text-rendering: optimizeLegibility;font-family: Microsoft YaHei;font-size: 16px;">
        ${tmpHeader}
      </div>
      `,
      footerTemplate: `<div style="width:100%;padding:0 60px;color: #232323;line-height: 1.15;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;-webkit-font-smoothing: antialiased;text-rendering: optimizeLegibility;font-family: Microsoft YaHei;font-size: 16px;">${tmpFooter}</div>`,
      displayHeaderFooter: true,
      printBackground: true
    }) 
    await browser.close()
    return pdf;
  }catch(e){
    pdf = '';
  }

  return pdf
}