const fs = require('fs');

const axios = require('axios');

const createData = async (word) => {
  if (!word) return;
  try {
    const response = await axios.get(encodeURI(`http://localhost:4000/word/${word}`));
    return Promise.resolve();
  } catch (error) {
    console.log(error);
    return Promise.reject();
  }
};

const creater = async () => {
  try {
    // read contents of the file
    const data = fs.readFileSync('vocabulaire', 'UTF-8');

    // split the contents by new line
    const lines = data.split(/\r?\n/);

    // print all lines
    lines.forEach(async (line, nb) => {
      console.log(nb, line);
      await createData(line);
    });
  } catch (err) {
    console.error(err);
  }
};

creater();
