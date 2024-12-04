require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const url = require('./model.js')
const dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(express.json());       
app.use(express.urlencoded({extended: true})); 

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

console.log(process.env.URI)
mongoose.connect(process.env.URI);

// Your first API endpoint
app.post('/api/shorturl', async function(req, res) {
  console.log(req.body.url)
  const host = new URL(req.body.url).hostname
  let valid = dns.lookup(host, async(err) => {
    if (err) {
      res.json({error: 'invalid url'})
    } else {
      try{
        const highestID = await url.findOne({},{short_url: 1}, {sort: {short_url: -1}})
        let newID = 1
        if (highestID != null){
          newID = highestID.short_url + 1
        }
        url.create({
          original_url: req.body.url,
          short_url: newID
        })
        res.json({original_url: req.body.url, short_url: newID})
      } catch(err) {
        res.json({error: "error saving url"})
      }
    }
  })
});

app.get('/api/shorturl/:id', async function(req, res) {
  try{
    const getURL = await url.findOne({short_url: req.params.id})
    if (getURL == null){
      res.json('URL Not Found')
    } else {
      res.redirect(getURL.original_url)
    }
  } catch (err){
    res.json({error: 'invalid url'})
  }

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
