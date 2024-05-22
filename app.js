const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const { generate_pdf_for_get, generate_pdf_for_post } = require('./controller/pdf');
const { generate_word_for_get, generate_word_for_post } = require('./controller/word');
const { generate_xlsx_for_get, generate_xlsx_for_post } = require('./controller/xlsx');
const app = express()
const port = 3001

app.use(logger('dev'));

app.use(function(req,res,next){
  //跨域设置
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods","PUT,GET,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers","X-Requestd-With,Content-Type");
  // res.header("Access-Control-Expose-Headers","token");
  if(req.method == 'OPTIONS'){
    res.sendStatus(200).end();
    return;
  }
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


app.get('/test', (req, res) => {
  res.send({
    code:200,
    data:'Hello World!',
    msg:'Hello World!'
  })
})

app.get('/pdf', generate_pdf_for_get)
app.post('/pdf', generate_pdf_for_post)

app.get('/word', generate_word_for_get)
app.post('/word', generate_word_for_post)

app.get('/xlsx', generate_xlsx_for_get)
app.post('/xlsx', generate_xlsx_for_post)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})