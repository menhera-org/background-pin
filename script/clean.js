// -*- indent-tabs-mode: nil; tab-width: 2; -*-
// vim: set ts=2 sw=2 et ai :
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* eslint-env es2020, node */

/*
  Run with `make clean` and `npm run clean`
*/

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const findAndClear = function find(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    return;
  }

  var files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      // recursive search
      find(filename, filter);
    } else if (filename.endsWith(filter)) {
      console.log('removing:', filename);
      fs.unlinkSync(filename);
    }
  }
};

const distDir = path.join(__dirname, '../dist');
findAndClear(distDir, '.js');
findAndClear(distDir, '.js.map');

// const buildsDir = path.join(__dirname, '../builds');
// fs.rmSync(buildsDir, { recursive: true, force: true });
