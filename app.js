import puppeteer from 'puppeteer'
import express from 'express'
import chalk from 'chalk'
import chokidar from 'chokidar'

const app = express()
const testUrl = 'https://www.aeyla.co.uk/'
const testFileName = 'aeyla/cart_upsell.js'

app.use('/files', express.static('test'))

app.get('/', async (req, res) => {
  const insertScript = fileName => {
    const scriptTest = document.createElement('script')
    scriptTest.src = `http://localhost:3000/files/${fileName}`
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
  const watcher = chokidar.watch(`test/${testFileName}`, {
    persistent: true
  })

  watcher.on('change', async () => {
    console.log(chalk.yellow('File changed!'))
    await page.reload()
    console.log(chalk.yellow('Page reloaded!'))
  })
  res.send('Browser launched!')
  function scriptInsert() {
    page.evaluate(insertScript, testFileName)
  }
})

app.listen(3000, console.log(chalk.green('Example app listening on port 3000!')))
