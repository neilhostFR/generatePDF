const word = require('../service/word-generate');
module.exports = {
  generate_word_for_get:async (req,res)=>{
    res.setHeader('Content-disposition', `attachment; filename=${Date.now()}.docx`);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.status(200).end(await word(req.query.url));
  },
  generate_word_for_post:async (req,res)=>{
    res.setHeader('Content-disposition', `attachment; filename=${Date.now()}.docx`);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.status(200).end(await word(req.body.url));
  }
}