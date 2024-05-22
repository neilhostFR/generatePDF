const pdf = require('../service/pdf-generate');

module.exports = {
  generate_pdf_for_get:async (req,res)=>{
    res.status(200).end(await pdf(req.query.url));
  },
  generate_pdf_for_post:async (req,res)=>{
    res.status(200).end(await pdf(req.body.url));
  },
  
}