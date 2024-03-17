const _ = require('lodash');
const ftp = require("basic-ftp");
const Ftp = require("promise-ftp");
const fs = require('promise-fs');
const request = require('request-promise');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const updateUploaded = async (name, uploadState, key, epIndex) => {
  await db.collection('seriale').updateOne({ name }, { $set: { [`episodes.${epIndex}.uploaded.${key}`]: uploadState }});
}

module.exports.uploadVoe = async (fileName, serialName, epIndex) => {
  console.log('Uploaduje [Voe]..');
  var ftp = new Ftp();
  let uploadState = false

  try {

    await ftp.connect({
      'host': 'ftp.voe-network.net',
      'user': keys.Voe.ftpUser,
      'password': keys.Voe.ftpPass
    });
    await ftp.put(`./downloads/${fileName}.mp4`, `${fileName}.mp4`);

    uploadState = true

  } catch (e) {
    uploadState = "ERR"
    console.log(e.message)
  }

  console.log(`[Voe] => [${uploadState}] | ${fileName}`);

  await updateUploaded(serialName, uploadState, 'Voe', epIndex);

  await ftp.end();

}

module.exports.uploadStreamTape = async (fileName, serialName, epIndex) => {
  console.log('Uploaduje [StreamTape]..');
  const client = new ftp.Client()
  client.ftp.verbose = false
  let uploadState = false

  try {
      await client.access({
        'host': 'ftp.streamtape.com',
      	'user': keys.StreamTape.ftpUser,
      	'password': keys.StreamTape.ftpPass,
        secure: false
      })

      await client.uploadFrom(`./downloads/${fileName}.mp4`, `${fileName}.mp4`);

      uploadState = true
    } catch (err) {
      uploadState = "ERR"
      console.log(err)
    }

    console.log(`[StreamTape] => [${uploadState}] | ${fileName}`);

    await updateUploaded(serialName, uploadState, 'StreamTape', epIndex);

    client.close()

}

module.exports.uploadStreamSb = async (fileName, serialName, epIndex) => {
  console.log('Uploaduje [StreamSB]..');
  const client = new ftp.Client()
  client.ftp.verbose = false
  let uploadState = false

  try {
      await client.access({
        'host': 'ftp.streamsb.com',
      	'user': keys.StreamSb.ftpUser,
      	'password': keys.StreamSb.ftpPass,
        secure: false
      })

        await client.uploadFrom(`./downloads/${fileName}.mp4`, `${fileName}.mp4`);
        uploadState = true

    } catch (err) {
      uploadState = "ERR"
      console.log(err)
    }

    console.log(`[StreamSB] => [${uploadState}] | ${fileName}`);

    await updateUploaded(serialName, uploadState, 'StreamSb', epIndex);

    client.close()

}

module.exports.uploadUpStream = async (fileName, serialName, epIndex) => {
  console.log('Uploaduje [UpStream]..');
  var ftp = new Ftp();
  let uploadState = false

  try {

    await ftp.connect({
      'host': 'ftp.upstream.to',
      'user': keys.UpStream.ftpUser,
      'password': keys.UpStream.ftpPass
    });
    await ftp.put(`./downloads/${fileName}.mp4`, `${fileName}.mp4`);

    uploadState = true

  } catch (e) {
    uploadState = "ERR"
    console.log(e.message)
  }

  console.log(`[UpStream] => [${uploadState}] | ${fileName}`);

  await updateUploaded(serialName, uploadState, 'UpStream', epIndex);

  await ftp.end();

}

module.exports.uploadHighLoad = async (fileName, serialName, epIndex) => {
  console.log('Uploaduje [HighLoad]..');
  const client = new ftp.Client()
  client.ftp.verbose = false
  let uploadState = false

  try {
      await client.access({
        'host': 'ftp.highload.to',
      	'user': keys.HighLoad.ftpUser,
      	'password': keys.HighLoad.ftpPass,
        secure: false
      })

      await client.uploadFrom(`./downloads/${fileName}.mp4`, `${fileName}.mp4`);

      uploadState = true
    } catch (err) {
      uploadState = "ERR"
      console.log(err)
    }

    console.log(`[HighLoad] => [${uploadState}] | ${fileName}`);

    await updateUploaded(serialName, uploadState, 'HighLoad', epIndex);

    client.close()

}

const pollStreamTape = async (fileName, tries) => {
  let fileList = await request.get(`https://api.streamtape.com/file/listfolder?login=${keys.StreamTape.ftpUser}&key=${keys.StreamTape.apiKey}`, { json: true });
  if (fileList.status == 200) {
    let myFile = fileList.result.files.filter(fi => fi.name == fileName+'.mp4')
    if (myFile.length > 0) {
      // console.log(myFile)
      // if (myFile[0].convert == 'converted') {
        return `https://streamtape.com/v/${myFile[0].linkid}`
      // }
    } else if (tries < 12) {
      await sleep(2500);
      return await pollStreamTape(fileName, tries++);
    } else {
      return 'NoFile'

    }
  } else {
    return 'NoFile'
  }
}

module.exports.pollStreamTape = pollStreamTape;

const pollStreamSb = async (fileName, tries) => {
  let fileList = await request.get(`https://api.streamsb.com/api/file/list?key=${keys.StreamSb.apiKey}`, { json: true });
  if (fileList.status == 200) {
    let myFile = fileList.result.files.filter(fi => fi.title == fileName)
    if (myFile.length > 0) {
      // if (myFile[0].canplay == 1 && myFile[0].public == '1') {
      if (myFile[0].public == '1') {
        // await addLink(`https://playersb.com/${myFile[0].file_code}`)
        return `https://playersb.com/${myFile[0].file_code}`
      }
    } else if (tries < 12) {
      await sleep(2500);
      return await pollStreamSb(fileName, tries++);
    } else {
      return 'NoFile'

    }
  } else {
    return 'NoFile'
  }
}

module.exports.pollStreamSb = pollStreamSb;

const pollUpStream = async (fileName, tries) => {
  let fileList = await request.get(`https://upstream.to/api/file/list?key=${keys.UpStream.apiKey}`, { json: true });
  if (fileList.status == 200) {
    let myFile = fileList.result.files.filter(fi => fi.title == fileName)
    if (myFile.length > 0) {
      // if (myFile[0].canplay == 1 && myFile[0].public == '1') {
      if (myFile[0].public == '1') {
        // await addLink(myFile[0].link)
        return myFile[0].link
      }
    } else if (tries < 12) {
      await sleep(2500);
      return await pollUpStream(fileName, tries++);
    } else {
      return 'NoFile'

    }
  } else {
    return 'NoFile'
  }
}

module.exports.pollUpStream = pollUpStream;

const pollHighLoad = async (fileName, tries) => {
  let fileList = await request.get(`https://api.highload.to/file/listfolder?login=${keys.HighLoad.ftpUser}&key=${keys.HighLoad.apiKey}`, { json: true });
  if (fileList.status == 200) {
    let myFile = fileList.result.files.filter(fi => fi.name == fileName+'.mp4')
    if (myFile.length > 0) {
      // if (myFile[0].status == 'active' && myFile[0].cstatus == 'Completed') {
      if (myFile[0].status == 'active') {
        // await addLink(`https://highload.to/f/${myFile[0].id}/`)
        return `https://highload.to/f/${myFile[0].id}/`
      }
    } else if (tries < 12) {
      await sleep(2500);
      return await pollHighLoad(fileName, tries++);

    } else {
      return 'NoFile'

    }
  } else {
    return 'NoFile'
  }
}

module.exports.pollHighLoad = pollHighLoad;

const pollVoe = async (fileName, tries) => {
  let fileList = await request.get(`https://voe.sx/api/file/list?key=a3061ad63y8pv2iztx1tyej06qpsambnokgdgpo6oijual2ox9djr43vxsd614fm`, { json: true });
  if (fileList.status == 200) {
    let myFile = fileList.result.files.filter(fi => fi.title == fileName)
    if (myFile.length > 0) {
      // if (myFile[0].canplay == 1 && myFile[0].public == '1') {
      if (myFile[0].public == '1') {
        return myFile[0].link
      }
    } else if (tries < 12) {
      await sleep(2500);
      return await pollVoe(fileName, tries++);

    } else {
      return 'NoFile'

    }
  } else {
    return 'NoFile'

  }
}

module.exports.pollVoe = pollVoe;
