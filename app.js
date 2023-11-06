import puppeteer from 'puppeteer'
import express from 'express'
import fs from 'fs'
import chalk from 'chalk'

const app = express()
const testUrl = 'https://natpat.com/en-eu/pages/zenpatch'
const testFileName = 'buzzpatch/qty_patches.js'

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
  await page.evaluate(insertScript, testFileName)
  console.log(chalk.greenBright('Browser started!'))
  fs.watchFile(`test/${testFileName}`, async () => {
    console.log(chalk.yellow('File changed!'))
    await page.reload()
    console.log(chalk.yellow('Page reloaded!'))
    await page.evaluate(insertScript, testFileName)
  })
  res.send('Browser launched!')
})

app.listen(3000, console.log(chalk.green('Example app listening on port 3000!')))
