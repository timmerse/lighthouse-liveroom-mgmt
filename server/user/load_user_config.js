'use strict';
const fs = require('fs');

function createUserConfigFile(path) {
  const user = {
    username : 'root',
    password : Math.random().toString(36).slice(-8)
  };
  // create conf
  fs.writeFileSync(path, JSON.stringify(user));
}


function doReadUserFromFile(path) {
  try {
    if (!fs.existsSync(path)) {
      // create first
      createUserConfigFile(path);
    }
    const data = fs.readFileSync(path, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(err)
  }
}

function create(path) {
  return {
    readUserFromFile: function () {
      return doReadUserFromFile(path);
    },

  }
}
module.exports = {
  create,
};
