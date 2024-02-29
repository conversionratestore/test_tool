import puppeteer from 'puppeteer'
import express from 'express'
import chalk from 'chalk'
import chokidar from 'chokidar'
import 'dotenv/config'

const port = process.env.PORT || 3000
const app = express()
const testUrl = process.env.TEST_URL
const testFileName = process.env.TEST_PATH + '/index.js'

app.use('/files', express.static('build'))

app.get('/', async (req, res) => {
  const insertScript = (fileName, p) => {
    const scriptTest = document.createElement('script')
    scriptTest.src = `http://localhost:${p}/files/${fileName}`
    scriptTest.async = true
    document.body.appendChild(scriptTest)
  }
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    defaultViewport: null,
    args: ['--start-maximized']
  })
  const page = await browser.newPage()
  await page.goto(testUrl)
  console.log(chalk.greenBright('Browser started!'))
  page.on('domcontentloaded', scriptInsert)
  const watcher = chokidar.watch(`build/${testFileName}`, {
    persistent: true
  })

  watcher.on('change', async () => {
    console.log(chalk.yellow('File changed!'))
    await page.reload()
    console.log(chalk.yellow('Page reloaded!'))
  })
  res.send('Browser launched!')
  function scriptInsert() {
    page.evaluate(insertScript, testFileName, port)
  }
})

app.listen(port, console.log(chalk.green(`Example app listening on port ${port}!`)))
