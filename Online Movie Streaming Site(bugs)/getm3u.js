const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const _ = require('lodash');

const Engine = require('./index.js');

module.exports.getm3u = async (url, name, epIndex, serialName) => {
  console.log(`Ide po m3u ${url} ${name}`);
  let browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe'
  });
  let page = await browser.newPage();
  await sleep(_.random(600, 1000));

  // await page.setRequestInterception(true);
  //
  // page.on('request', request => {
  //   request.continue();
  // });
  page.on('response', async (response) => {
    if (response.url().includes('/hls/') && response.url().includes('.m3u8') && response.url().includes('/index')) {
      // console.log(response.url())
      Engine.downloadFile(response.url(), name, epIndex, serialName);
      await sleep(_.random(1200, 1700));
      await page.close();
      await browser.close();
    }
  });

  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForSelector('video#voe-player');
  await page.click('video#voe-player');

}
