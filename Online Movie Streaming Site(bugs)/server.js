const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');

const app = express();

const fs = require('promise-fs');

app.use(express.static(path.resolve('./public')));
app.use(bodyParser.json({
  type: 'application/json',
  limit: '50mb'
}));

const Engine = require('./index.js');
const Services = require('./services.js');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/admin";


app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')));

app.get('/getKeys', async (req, res) => {
  try {

   let keys = JSON.parse(await fs.readFile('keys.json', 'utf8'));
   res.send(keys);

  } catch (e) {
    console.log(e);
  }
})

app.get('/getSetup', async (req, res) => {
  try {

   let setup = JSON.parse(await fs.readFile('setup.json', 'utf8'));
   res.send(setup);

  } catch (e) {
    console.log(e);
  }
})

app.post('/saveKeys', async (req, res) => {
  try {

    await fs.writeFile('keys.json', JSON.stringify(req.body))
    global.keys = req.body
   res.send("Dane zapisane!");

  } catch (e) {
    console.log(e);
    res.send("błąd zapisu!")
  }
})

app.post('/freshInt', async (req, res) => {
  try {

    let setup = JSON.parse(await fs.readFile('setup.json', 'utf8'));
    setup[req.body.type][req.body.mode] = parseInt(req.body.value)
    await fs.writeFile('setup.json', JSON.stringify(setup))
    res.end();

  } catch (e) {
    console.log(e)
  }
});

app.post('/setAuto', async (req, res) => {
  try {

    let setup = JSON.parse(await fs.readFile('setup.json', 'utf8'));
    switch (req.body.mode) {
      case 'freshMovies':
        setup.movies.auto = req.body.state
      break;
      case 'freshSeries':
        setup.series.auto = req.body.state
      break;
    }
    await fs.writeFile('setup.json', JSON.stringify(setup))
    res.end();

  } catch (e) {
    console.log(e)
  }
});

app.post('/downloadMovie', async (req, res) => {
  try {

    Engine.fetchMovie(req.body.movie);
    res.send('Włączyłem pobieranie filmu!');

  } catch (e) {
    console.log(e)
    res.send('Błąd pobierania filmu!');
  }
});

app.post('/uploadFile', async (req, res) => {
  try {

    Engine.uploadFile(req.body.name, req.body.service);
    res.send('Włączyłem upload pliku na ' + req.body.service);

  } catch (e) {
    console.log(e)
    res.send('Błąd pobierania filmu!');
  }
});

app.post('/reupSeries', async (req, res) => {
  try {

    Engine.reupSeries(req.body.toReup);
    res.send(`Włączyłem reupload ${req.body.toReup.length} plików!`);

  } catch (e) {
    console.log(e);
    res.send('Błąd włączenia reuploadu!');
  }
});

app.get('/fetchMovies', async (req, res) => {
  try {

    let news = await Engine.fetchMovies(1);
    res.send(`Znalazłem ${news.length} nowych filmów!`);

  } catch (e) {
    console.log(e)
    res.send('Błąd pobierania filmów!');
  }
});

app.get('/fetchSeries', async (req, res) => {
  try {

    let news = await Engine.fetchSeries(1);
    res.send(`Znalazłem ${news.length} nowych seriali!`);

  } catch (e) {
    console.log(e)
    res.send('Błąd pobierania seriali!');
  }
});

app.post('/addUrl', async (req, res) => {
  try {
    var myUrl = "NONE"
    switch (req.body.service) {
      case 'StreamTape':
        myUrl = await Services.pollStreamTape(req.body.url.split('movies/')[1]);
      break;
      case 'StreamSb':
        myUrl = await Services.pollStreamSb(req.body.url.split('movies/')[1]);
      break;
      case 'UpStream':
        myUrl = await Services.pollUpStream(req.body.url.split('movies/')[1]);
      break;
      case 'HighLoad':
        myUrl = await Services.pollHighLoad(req.body.url.split('movies/')[1]);
      break;
      case 'Voe':
        myUrl = await Services.pollVoe(req.body.url.split('movies/')[1]);
      break;
    }
    console.log(`Mam taki url ${myUrl}`)
    if (myUrl.includes('http')) {

      let myFilm = await db.collection('filmy').find({ url: req.body.url }).toArray();

      let properties = myFilm[0].videoData

      await Engine.addLink(req.body.url, myUrl, properties);

    }

    res.end();

  } catch (e) {
    console.log(e);
  }
})


app.get('/listFilms', async (req, res) => {
  try {

    let stored = await db.collection('filmy').find({}).toArray();

    res.send(stored.map(film => {
      let downloaded = film.downloaded;
      if (downloaded != 'TAK') {
        downloaded = downloaded+`<br><button film="${film.url}" class='btn btn-sm btn-light downloadMovie'>Pobierz</button>`
      }

      return {
        id: stored.indexOf(film)+1,
        link: `<a href="${film.url}" target="_blank">${film.name}</a>`,
        created: film.found,
        downloaded,
        actions: '<table class="table table-dark"><thead><th>Upload</th><th>Serwis</th><th>Dodano</th></thead><tbody>'+Object.keys(film.uploaded).map(fu => {
          let added = film.added[fu];
          let dis = ""
          if (fu == "StreamTape") dis = "disabled"
          if (added == true) {
            added = `<span style='color: green;'><b>TAK</b></span>`
          } else if (film.uploaded[fu] == true) {
            added = `<button class="adder" film="${film.url}" ${dis}>Dodaj</button>`
          } else {
            added = "-"
          }

          let czeko = '';
          if (film.uploaded[fu] == true) {
            czeko = `<span style='color: green;'><b>OK</b></span>`
          } else if (downloaded == "TAK") {
            czeko = `<button film="${film.name}" class="upek">Upload</button>`
          }
          if (film.uploaded[fu] == 'ERR') czeko = `<button film="${film.name}" style="border: 1px solid red;" class="upek">Upload</button>`
          return `<tr><td>${czeko}</td><td>${fu}</td><td>${added}</td></tr>`
        }).join('')+'</tbody></table>'
      }
    }))

  } catch (e) {
    console.log(e);
  }
});

app.get('/listSeries', async (req, res) => {
  try {

    let stored = await db.collection('seriale').find({}).toArray();
    let episodes = [];
    let id = 1;
    for (let serial of stored) {
      let innerct = 1;
      for (let episode of serial.episodes) {
        if (innerct < 21) {
          episodes.push({
            czek: `<input type="checkbox" class="ptak" serial="${serial.name}" ep="${episode.title}">`,
            id,
            created: episode.found,
            serial: `<a href="${serial.url}" target="blank">${serial.name}</a>`,
            odcinek: `<a href="${episode.url}" target="_blank">${episode.title}</a>`,
            actions: '<table class="table table-dark"><thead><th>StreamTape</th><th>UpStream</th><th>HighLoad</th><th>Voe</th></thead><tbody><tr>'+Object.keys(episode.uploaded).map(fu => {
              let colek = "";
              if (episode.uploaded[fu] == true) colek = "#7ade7a"
              return `<td style="background-color: ${colek};">${episode.uploaded[fu]}</td>`
            }).join('')+'</tr></tbody></table>'
          })

          id += 1;
        }
        innerct += 1;
      }
    }
    res.send(episodes);

  } catch (e) {
    console.log(e);
  }
});


app.listen(7221, async () => {
  global.keys = JSON.parse(await fs.readFile('keys.json', 'utf8'));

  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    keepAliveInitialDelay: 300000,
    socketTimeoutMS: 50000,
    keepAlive: true
  });

  global.db = client.db();

  console.log(`Listening on port 7221!`);

});
