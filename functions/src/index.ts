// Imports
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { Config } from './config';
import { Routes } from './routes';

// Express Initialization
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Firebase Admin SDK Initialization
admin.initializeApp({
  credential: admin.credential.cert(new Config().firebasePrivate)
});

// Automatically allow cross-origin requests
// @ts-ignore
app.use(cors());

// Routes
app.use(new Routes().app);

// Create api to host all other top-level functions
const api = express();
api.use('/api', app);

// Set Cloud Functions
export const main = functions.https.onRequest(api);