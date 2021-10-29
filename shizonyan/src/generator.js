//const { spawn } = require('promisify-child-process')
const fs = require('fs')
const express = require('express')
const app = express()
const port = 25699

app.get('/generator', async (req, res) => {
  //const { stdout, stderr } = await spawn('python3', [__dirname+'/../../getSentence.py3'], {encoding: 'utf8'});
  const stdout = fs.readFileSync('../../simonyan.txt').toString().split('\n')
  res.setHeader("Content-Type", "text/plain; charset=utf-8")
  res.send(stdout[Math.floor(Math.random()*(stdout.length-1))])
})

const server = app.listen(port, () => {
  console.log(`Listening for generator on port ${port}`)
})

process.on('SIGINT', () => server.close())
