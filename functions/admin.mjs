import { MongoClient, ObjectId } from "mongodb";

function getClientAndDatabase() {
  const uri = process.env.MONGODB_CONNECTION;
  const client = new MongoClient(uri);
  const database = client.db('viathisdev');
  return {client, database};
}

async function updateAll() {
  const { client, database } = getClientAndDatabase();
  const links = database.collection('links');

  const cursor = await links.updateMany({},
    [
      {
          $set: {
              tags: ['untagged']
          }
      }
  ]
  );
  console.log('done');
}

async function deleteAll() {
  const { client, database } = getClientAndDatabase();
  const links = database.collection('friends');

  const cursor = await links.deleteMany({});
  console.log('done');
}

async function findAll() {
  const { client, database } = getClientAndDatabase();
  const links = database.collection('friends');

  const cursor = links.find();
  const result = await cursor.toArray();
  console.log(result);
}


await updateAll();
await findAll();
