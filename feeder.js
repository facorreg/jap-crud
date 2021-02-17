const fs = require('fs');

const axios = require('axios');
const http = require('http');
const https = require('https');

const fetch = axios.create({
  // keepAlive pools and reuses TCP connections, so it's faster
  httpAgent: new http.Agent({ keepAlive: true }),

  httpsAgent: new https.Agent({ keepAlive: true }),

  // cap the maximum content length we'll accept to 50MBs, just in case
  maxContentLength: 50 * 1000 * 1000,

  // follow up to 10 HTTP 3xx redirects
  maxRedirects: 10,

  // 60 sec timeout
  timeout: 60000,
});

const createData = async (word) => {
  if (!word) return Promise.reject();
  try {
    await fetch.put('http://localhost:4000/word', { word });
    return Promise.resolve();
  } catch (error) {
    console.log(error.message);
    return Promise.reject();
  }
};

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const creater = async () => {
  try {
    // read contents of the file
    const data = fs.readFileSync('vocabulaire', 'UTF-8');

    // split the contents by new line
    const lines = data.split(/\r?\n/);

    // print all lines
    lines.forEach(async (line, nb) => {
      await createData(line)
        .catch(() => {})
        .finally(() => console.log(nb));
      if (!(nb % 10)) {
        sleep(2000);
      }
    });
  } catch (err) {}
};

creater();
