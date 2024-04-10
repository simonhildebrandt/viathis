/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');

const express = require('express');
const cors = require('cors');
// const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require("mongodb");

const authorise = require('./authorise');

const app = express();
app.use(cors({ origin: true }));

// app.use((req, res, next) => {
//   // Clear function name out of url for Firebase rewrite
//   req.url = req.url.replace(/\/api/, "");
//   next();
// });

app.use(authorise(process.env.LWL_SECRET));


const password = process.env.MONGODB_PASSWORD;
const uri = process.env.MONGODB_CONNECTION;


function getClientAndDatabase() {
  const client = new MongoClient(uri);
  const database = client.db('viathisdev');
  return {client, database};
}


app.get("/profile", async (req, res) => {
  return res.status(200).json({ name: "Simon" });
});

app.post("/create", async (req, res) => {
  const { client, database } = getClientAndDatabase();
  const links = database.collection('links');

  const { title, description, link } = req.body;
  const createdAt = new Date();
  const createdBy = req.auth.sub;
  const doc = { title, description, link, createdAt, createdBy };

  console.log({doc});

  try {
    links.insertOne(doc);
  } catch(error) {
    console.error(error);
    res.status(500).json({message: error.message});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }

  return res.status(200).json({ name: "Simon" });
});

app.get("/list", async (req, res) => {
  const { client, database } = getClientAndDatabase();
  const links = database.collection('links');

  try {
    const query = { createdBy: { $eq: req.auth.sub } };
    const options = { sort: { createdAt: 1 } };

    const cursor = links.find(query, options);
    const result = await cursor.toArray();
    console.log({result})
    res.status(200).json(result);
  } catch(error) {
    console.error(error);
    res.status(500).json({message: error.message});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

exports.api = functions.https.onRequest(app);
