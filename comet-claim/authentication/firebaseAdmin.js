/*backend/firebaseAdmin.js
import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com'
});

export default admin;*/


import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

/*const serviceAccount = JSON.parse(
  await readFile(new URL('./serviceAccount.json', import.meta.url))
);*/

admin.initializeApp({
  //credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lostandfound-d79fa.firebaseio.com'
});

export default admin;
