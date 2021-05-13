const { spawn } = require('promisify-child-process')
const express = require('express')
const app = express()
const port = 25699

app.get('/generator', async (req, res) => {
  const { stdout, stderr } = await spawn('python3', [__dirname+'/../../getSentence.py3'], {encoding: 'utf8'});
  res.setHeader("Content-Type", "text/plain; charset=utf-8")
  res.send(stdout)
})

app.listen(port, () => {
  console.log(`Listening for generator on port ${port}`)
})
