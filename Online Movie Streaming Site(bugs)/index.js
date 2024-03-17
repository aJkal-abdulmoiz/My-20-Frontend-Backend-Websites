const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin());

const fetch = require('node-fetch');
const fs = require('promise-fs');
const cheerio = require('cheerio');
const uas = require('user-agents');
const _ = require('lodash');
const request = require('request-promise');
const moment = require('moment-timezone');

const ftp = require("basic-ftp");
const Ftp = require("promise-ftp");

const m3ufind = require('./getm3u.js');

const m3u8stream = require('m3u8stream');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const Services = require('./services.js');


const uploadFile = async (name, service, serialName, epIndex) => {
  switch (service) {
    case 'StreamTape':
      await Services.uploadStreamTape(name, serialName, epIndex);
    break;
    case 'StreamSb':
      await Services.uploadStreamSb(name, serialName, epIndex);
    break;
    case 'UpStream':
      await Services.uploadUpStream(name, serialName, epIndex);
    break;
    case 'HighLoad':
      await Services.uploadHighLoad(name, serialName, epIndex);
    break;
    case 'Voe':
      await Services.uploadVoe(name, serialName, epIndex);
    break;
  }
}

module.exports.uploadFile = uploadFile;

const updateAdded = async (name, addState, key, epIndex) => {
  await db.collection('seriale').updateOne({ name }, { $set: { [`episodes.${epIndex}.added.${key}`]: addState }});
}

const checkLogin = async (page, url) => {
  if (page.url().indexOf('/logowanie') > -1) {
    await page.waitForSelector('input#input-login', { visible: true });
    await sleep(_.random(1000, 1500));
    await page.focus('input#input-login');
    await sleep(_.random(700, 1100));
    await page.type('input#input-login', 'Vadys', { delay: _.random(30, 60 )});

    await page.focus('input#input-password');
    await sleep(_.random(700, 1100));
    await page.type('input#input-password', 'AwLQk@etqAbT5ka', { delay: _.random(30, 60 )});

    await sleep(_.random(1000, 1500));
    await page.click('button[type="submit"]');
    await sleep(_.random(1000, 1500));
    await page.waitForSelector('a.dropdown-toggle', { visible: true });
    await sleep(_.random(1000, 1500));
    await page.goto(url);
  }
}

const addLink = async (url, myUrl, properties, service, epIndex, serialName) => {
  console.log({url, myUrl, properties, service, epIndex, serialName})
  let browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe',
    userDataDir: `./browserData/myUser`
  });
  let page = await browser.newPage();
  await page.goto('https://filman.cc/logowanie', { waitUntil: 'domcontentloaded' });
  await sleep(_.random(1500, 3000));
  await checkLogin(page, 'https://filman.cc/logowanie');

  console.log(`Dodaje link: ${myUrl} | ${JSON.stringify(properties)}`);
  await updateAdded(serialName, true, service, epIndex);
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForSelector('a[href*="dodaj-link"]');
  await page.click('a[href*="dodaj-link"]');
  await page.waitForSelector(`button[type="submit"]`, { visible: true});

  await sleep(_.random(1200, 1500));

  await page.evaluate(properties => {
    var dd = document.querySelector('select[name="version[]"]');
    for (var i = 0; i < dd.options.length; i++) {
        if (dd.options[i].text === properties.wersja) {
            dd.selectedIndex = i;
            break;
        }
    }
  }, properties);
  await sleep(_.random(800, 1300));
  await page.evaluate(properties => {
    var dd = document.querySelector('select[name="quality[]"]');
    for (var i = 0; i < dd.options.length; i++) {
        if (dd.options[i].text === properties.jakosc) {
            dd.selectedIndex = i;
            break;
        }
    }
  }, properties);
  await sleep(_.random(800, 1300));
  await page.type(`input[name="link[]"]`, myUrl, { delay: _.random(20, 25) });
  await sleep(_.random(800, 1300));
  // await page.click('button["name="submit"]');
  await sleep(12000);
  await browser.close();
}

module.exports.addLink = addLink;

const downloadFile = async (url, name, epIndex, serialName) => {
  console.log('Pobieram.. ' + name);
  var downloaded_bytes = 0;

  let stream = m3u8stream(url);

  // stream.on('progress', console.log);
  var step = 0;
  stream.on('progress', (segment, totalSegments, downloaded) => {
    if (step == 15) {
      console.log(`${name} [${((segment.num/totalSegments)*100).toFixed(2)} %] Pobrałem ${segment.num}/${totalSegments} segmentów.`)
      step = 0;
    }
    step += 1;
  });

  stream.on('error', async err => {
    console.log('Blad pobierania! ' + err.name);
    await db.collection('seriale').updateOne({ name: serialName }, { $set: { [`episodes.${epIndex}.downloaded`]: 'ERROR' }});
  });
  stream.on('end', async () => {
    console.log('Pobrano! end' + name);

    await db.collection('seriale').updateOne({ name: serialName }, { $set: { [`episodes.${epIndex}.downloaded`]: 'TAK' }});
    let serie = await db.collection('seriale').find({ name: serialName }).toArray();

    let myEp = serie[0].episodes[epIndex];
    await sleep(_.random(1200, 2300));
    let services = ['StreamTape', 'UpStream', 'HighLoad', 'Voe'];
    for (let service of services) {
      if (myEp.uploaded[service] == true) services.splice(services.indexOf(service), 1)
    }
    console.log('Uploaduje na ' + JSON.stringify(services));
    let chunks = _.chunk(services, 2);

    for (let chunk of chunks) {
      let cses = await Promise.all(chunk.map(async service => {
        await uploadFile(name, service, serialName, epIndex);
        await sleep(_.random(1200, 2300));
        var myUrl = "NONE";
        switch (service) {
          case 'StreamTape':
          myUrl = await Services.pollStreamTape(name, 0);
          break;
          case 'StreamSb':
          myUrl = await Services.pollStreamSb(name, 0);
          break;
          case 'UpStream':
          myUrl = await Services.pollUpStream(name, 0);
          break;
          case 'HighLoad':
          myUrl = await Services.pollHighLoad(name, 0);
          break;
          case 'Voe':
          myUrl = await Services.pollVoe(name, 0);
          break;
        }
        console.log(`${service} Mam taki URL: ${myUrl}`);

        if (myUrl.includes('http')) {
          return {url: myEp.url, myUrl, params: myEp.params, service, epIndex, serialName}
          // await addLink(myEp.url, myUrl, myEp.params, service, epIndex, serialName);

        } else {
          console.log('Zły url do pliku! ' + service);
          return 'err'
        }

      }));

      for (let cse of cses) {
        if (cse != 'err') await addLink(cse.url, cse.myUrl, cse.params, cse.service, cse.epIndex, cse.serialName);
      }

    }


  });

  stream.pipe(fs.createWriteStream(`./downloads/${name}.mp4`));


  // await Promise.all([
  //   stream.pipe(fs.createWriteStream(`./downloads/${name}.mp4`)),
  //   await sleep(7000),
  //   stream.unpipe()
  // ]);
  // console.log('Pobrane! ' + name);


}

module.exports.downloadFile = downloadFile;

const fetchMovie = async url => {

  let browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe',
    userDataDir: `./browserData/myUser`
  });
  let page = await browser.newPage();
  await page.goto(url);
  await checkLogin(page, url);
  await page.waitForSelector('div#link-list');
  await sleep(_.random(800, 1200));


  const [button] = await page.$x("//a[contains(., 'voe.sx')]");
  if (button) {
    await button.click();
    await sleep(_.random(2500, 3300));

    let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    let $ = await cheerio.load(bodyHTML);
    var voe = {url:''}
    $('table#links tbody').find('tr').each((i, el) => {
      if ($(el).text().includes('voe.sx') && !$(el).text().includes('Vadys')) {
        voe.url = $('div#frame').find('iframe').attr('src')
        voe.wersja = $(el).find('td:nth-child(2)').text()
        voe.jakosc = $(el).find('td:nth-child(3)').text()
      }
    });

    await browser.close();
    if (voe.url.length > 2) {
      console.log(`Mam link do VOE ${voe.url}`);
      return voe

    } else {
      console.log('Nie wydobyłem VOE! ' + url);

      return "NoUrl"
    }

  } else {
    console.log('Brak linku do VOE! ' + url);
    await browser.close();
    return "NoUrl"

  }

}

module.exports.fetchMovie = fetchMovie;

const fetchMovies = async (newer = 0) => {
  console.log(`${moment().tz('Europe/Warsaw').format("YYYY-MM-DD HH:mm:ss")} | => Sprawdzam filmy.`);
  var news = 0;

  let browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe'
  });
  let page = await browser.newPage();
  await page.goto(`https://filman.cc/filmy-online-pl/`);
  await checkLogin(page, `https://filman.cc/filmy-online-pl/`);
  await page.waitForSelector('div#item-list');
  await sleep(_.random(1000, 1300));

  let setup = JSON.parse(await fs.readFile('setup.json', 'utf8'));

  let scount = setup.movies.count;

  let pageItems = await page.evaluate(scount => {
    return Array.from(document.querySelectorAll('div#item-list div.col-xs-6')).map(el => {
      return {
       title: el.querySelector('a').getAttribute('title'),
       url: el.querySelector('a').getAttribute('href')
      }
    }).slice(0, scount);
  }, scount);

  await browser.close();

  let stored = await db.collection('filmy').find({}).toArray();
  let toReup = [];

  for (let pageItem of pageItems) {
    if (stored.filter(st => st.url == pageItem.url).length < 1) {
      console.log('Nowy film! ' + pageItem.url)
      news += 1;
      await db.collection('filmy').insertOne({
        url: pageItem.url,
        found: moment().tz('Europe/Warsaw').format("YYYY-MM-DD HH:mm:ss"),
        name: pageItem.title,
        fileName: pageItem.url.split('movies/')[1],
        downloaded: "NIE",
        added: {
          'StreamTape': false,
          'UpStream': false,
          'HighLoad': false,
          'Voe': false
        },
        uploaded: {
          'StreamTape': false,
          'UpStream': false,
          'HighLoad': false,
          'Voe': false
        }
      });

      toReup.push(pageItem.url);
    }
  }

  setup.movies.lastcheck = moment().tz('Europe/Warsaw').format("YYYY-MM-DD HH:mm:ss");
  await fs.writeFile('setup.json', JSON.stringify(setup));

  if (setup.movies.auto == true) {
    console.log('Sprawdze filmy za ' + setup.movies.interval + ' minut');
    setTimeout(function () {
      fetchMovies(0);
    }, setup.movies.interval*60000);
  }

  if (newer == 1) return toReup

  if (toReup.length > 0) {
    for (let newfilm of toReup) {
      await fetchMovie(newfilm);

    }

  }


}

module.exports.fetchMovies = fetchMovies;

const getEpisodes = async (url, browser) => {

  let page = (await browser.pages())[1];
  await page.goto(url);
  await page.waitForSelector('ul#episode-list');
  await sleep(_.random(500, 700));
  let found = moment().tz('Europe/Warsaw').format("YYYY-MM-DD HH:mm:ss");
  let datapack = {url, found}
  return await page.evaluate(datapack => {
    return Array.from(document.querySelectorAll('ul#episode-list ul li')).map(el => {
      return {
        url: el.querySelector('a').getAttribute('href'),
        title: el.innerText.trim(),
        fileName: datapack.url.split('-online/')[1].split('/').join('-'),
        found: datapack.found,
        downloaded: "NIE",
        added: {
          'StreamTape': false,
          'UpStream': false,
          'HighLoad': false,
          'Voe': false
        },
        uploaded: {
          'StreamTape': false,
          'UpStream': false,
          'HighLoad': false,
          'Voe': false
        }
      }
    })
  }, datapack);
}

const fetchSeries = async (newer = 0) => {
  console.log(`${moment().tz('Europe/Warsaw').format("YYYY-MM-DD HH:mm:ss")} | => Sprawdzam seriale.`);
  var news = 0;

  let browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\Chrome.exe'
  });
  let page = await browser.newPage();

  await page.goto(`https://filman.cc/seriale-online-pl/sort:newepisode/`);
  await checkLogin(page, `https://filman.cc/seriale-online-pl/sort:newepisode/`);
  await page.waitForSelector('div#item-list');

  let setup = JSON.parse(await fs.readFile('setup.json', 'utf8'));
  let scount = setup.series.count;

  let pageItems = await page.evaluate(scount => {
    return Array.from(document.querySelectorAll('div#item-list div.col-xs-6')).map(el => {
      return {
       title: el.querySelector('div.film_title').innerText,
       url: el.querySelector('a').getAttribute('href')
      }
    }).slice(0, scount);
  }, scount);

  // console.log(pageItems)

  let stored = await db.collection('seriale').find({}).toArray();
  let newItems = [];

  for (let pageItem of pageItems) {
    if (stored.filter(st => st.url == pageItem.url).length < 1) {
      console.log('Nowy serial! ' + pageItem.url)
      let episodes = await getEpisodes(pageItem.url, browser);
      news += 1;
      await db.collection('seriale').insertOne({
        url: pageItem.url,
        found: moment().tz('Europe/Warsaw').format("YYYY-MM-DD HH:mm:ss"),
        name: pageItem.title,
        episodes
      });
      newItems.push(pageItem);
    }
  }

  await browser.close();
  setup.series.lastcheck = moment().tz('Europe/Warsaw').format("YYYY-MM-DD HH:mm:ss");
  await fs.writeFile('setup.json', JSON.stringify(setup));

  if (setup.series.auto == true) {
    console.log('Sprawdze seriale za ' + setup.series.interval + ' minut');
    setTimeout(function () {
      fetchSeries(0);
    }, setup.series.interval*60000);
  }

  if (newer == 1) return newItems

  if (newItems.length > 0) {
    for (let newserie of newItems) {
      await fetchSerie(newserie.url);

    }
  }


}

module.exports.fetchSeries = fetchSeries;

module.exports.reupSeries = async (episodes) => {
  let bazka = await db.collection('seriale').find({}).toArray();
  for (let episode of episodes) {
    let mySerial = bazka.filter(serial => serial.name == episode.serial)[0];
    let myEp = mySerial.episodes.filter(ep => ep.title == episode.ep)[0];
    let epIndex = mySerial.episodes.indexOf(myEp)
    console.log('Robie: ' + myEp.title)
    // console.log(epIndex)

    // if (myEp.added.StreamTape == true || myEp.uploaded.StreamTape == true) {
    //   console.log('Odcinek juz wrzucony! ' + episode.serial + ' | ' + episode.ep);
    //   return
    // }
    let voeUrl = await fetchMovie(myEp.url);
    if (voeUrl != "NoUrl") {
      await db.collection('seriale').updateOne({ name: mySerial.name }, { $set: { [`episodes.${epIndex}.params`]: {wersja: voeUrl.wersja, jakosc: voeUrl.jakosc} }});
      await m3ufind.getm3u(voeUrl.url, myEp.fileName, epIndex, mySerial.name);
      // console.log(`FileURL => ${fileUrl}`);
      // if (fileUrl.length > 0) {
        // await downloadFile(fileUrl, myEp.fileName, epIndex, mySerial.name);

      // }
    }
    // await downloadFile()
  }
}

(async () => {
  global.keys = JSON.parse(await fs.readFile('keys.json', 'utf8'));
  // await uploadUserLoad('zle-dni-i-onde-dager-2021');
  // await fetchMovies();
  // await Services.uploadVoe('jurassic-world-upadle-krolestwo-jurassic-world-fallen-kingdom-2018');

  // await downloadFile('https://delivery-node-fawziyyah.voe-network.net/hls/6oarnj66zm33cszcryhnjnlt55eyam57ip4krji5q5lvfzcspaqi6efjfnwq/index-v1-a1.m3u8');

})();
