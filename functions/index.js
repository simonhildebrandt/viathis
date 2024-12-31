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
const { MongoClient, ObjectId } = require("mongodb");

const authorise = require('./authorise');

const app = express();
app.use(cors({ origin: true }));

// app.use((req, res, next) => {
//   // Clear function name out of url for Firebase rewrite
//   req.url = req.url.replace(/\/api/, "");
//   next();
// });

app.use(authorise(process.env.LWL_SECRET));


function getClientAndDatabase() {
  const uri = process.env.MONGODB_CONNECTION;
  const client = new MongoClient(uri);
  const database = client.db('viathisdev');
  return {client, database};
}

function userData(user) {
  const { lwlId, email, name } = user;
  return { lwlId, email, name };
}

async function ensureUser(lwlId, details = null) {
  const { client, database } = getClientAndDatabase();
  const users = database.collection('users');

  try {
    const query = { lwlId };

    const result = await users.findOne(query);
    if (result) {
      return result;
    } else if(details) {
      const { email, name = `user${lwlId}` } = details;
      const doc = {
        lwlId,
        email,
        name,
      };

      await users.insertOne(doc);

      return doc;
    } else {
      return { email: 'unknown', name: `user${lwlId}` };
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

app.get("/profile", async (req, res) => {
  try {
    const user = await ensureUser(req.auth.sub, req.auth);
    return res.status(200).json(userData(user));
  } catch(error) {
    console.error(error);
    res.status(500).json({message: error.message});
  }
});

app.post("/create", async (req, res) => {
  const { client, database } = getClientAndDatabase();
  const links = database.collection('links');

  const { title, description, link } = req.body;
  const createdAt = new Date();
  const owner = req.auth.sub;
  const doc = { title, description, link, createdAt, owner };

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

app.get("/user/:id", async (req, res) => {
  const user = await ensureUser(req.params.id);
  return res.status(200).json(userData(user));
});

app.get("/list/:folder", async (req, res) => {
  const { client, database } = getClientAndDatabase();
  const links = database.collection('links');

  const archived = req.params.folder === 'archived';

  try {
    const query = {
      owner: { $eq: req.auth.sub },
      archived: { $eq: archived }
    };
    const options = { sort: { createdAt: 1 } };

    const cursor = links.find(query, options);
    const result = await cursor.toArray();
    res.status(200).json(result);
  } catch(error) {
    console.error(error);
    res.status(500).json({message: error.message});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.get("/item/:id", async (req, res) => {
  const { client, database } = getClientAndDatabase();
  const links = database.collection('links');

  const { id } = req.params;

  try {
    const query = { _id: new ObjectId(id) };

    const result = await links.findOne(query);
    res.status(200).json(result);
  } catch(error) {
    console.error(error);
    res.status(500).json({message: error.message});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.post("/item/:id/archive", async (req, res) => {
  const { client, database } = getClientAndDatabase();
  const links = database.collection('links');

  const { id } = req.params;

  try {
    const query = { _id: new ObjectId(id) };

    const result = await links.updateOne(query, { $set: { archived: true } });
    res.status(200).json(result);
  } catch(error) {
    console.error(error);
    res.status(500).json({message: error.message});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.post("/item/:id/inbox", async (req, res) => {
  const { client, database } = getClientAndDatabase();
  const links = database.collection('links');

  const { id } = req.params;

  try {
    const query = { _id: new ObjectId(id) };

    const result = await links.updateOne(query, { $set: { archived: false } });
    res.status(200).json(result);
  } catch(error) {
    console.error(error);
    res.status(500).json({message: error.message});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.get("/friends", async (req, res) => {
  const { client, database } = getClientAndDatabase();
  const friends = database.collection('friends');

  const userId = req.auth.sub;
  const userEmail = req.auth.email;

  try {
    const query = {
      $or: [
        { createdBy: { $eq: userId }},
        { inviteeId: { $eq: userId }},
        { inviteeEmail: { $eq: userEmail }},
      ]
    };

    const cursor = await friends.find(query);
    const result = await cursor.toArray();
    res.status(200).json(result);
  } catch(error) {
    console.error(error);
    res.status(500).json({message: error.message});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.post("/friends", async (req, res) => {
  const { client, database } = getClientAndDatabase();
  const friends = database.collection('friends');

  try {
    const createdAt = new Date();
    const createdBy = req.auth.sub;
    const inviteeId = req.body.id;
    const inviteeEmail = req.body.email;
    const doc = {
      createdAt,
      createdBy,
      inviteeId,
      inviteeEmail,
      acceptedAt: null,
      cancelledAt: null,
      cancelledBy: null,
    };

    await friends.insertOne(doc);
    res.status(200).json({});
  } catch(error) {
    console.error(error);
    res.status(500).json({message: error.message});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.post("/friends/:id", async (req, res) => {
  const { client, database } = getClientAndDatabase();
  const friends = database.collection('friends');

  const { id } = req.params;
  const { action } = req.body;

  try {
    // TODO check that user is in the friend request

    const doc = {};

    if (action == 'accept') {
      doc.acceptedAt = new Date();
      doc.cancelledAt = null;
      doc.cancelledBy = null;
    } else if (action == 'cancel') {
      doc.cancelledAt = new Date();
      doc.cancelledBy = req.auth.sub;
    } else if (action == 'uncancel') {
      doc.cancelledAt = null;
      doc.cancelledBy = null;
    }

    const query = { _id: new ObjectId(id) };
    await friends.updateOne(query, { $set: doc });
    res.status(200).json({});
  } catch(error) {
    console.error(error);
    res.status(500).json({message: error.message});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

exports.api = functions.https.onRequest(app);
