const { MongoClient } = require('mongodb');

async function fix() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('kindora');
  
  const donations = await db.collection('donations').find({ donorName: { $exists: false } }).toArray();
  for (const d of donations) {
      if (d.donorId) {
          const user = await db.collection('users').findOne({ _id: d.donorId });
          if (user) {
              await db.collection('donations').updateOne({ _id: d._id }, { $set: { donorName: user.name } });
          } else {
             // Maybe donorId is stored as a string or ObjectId differently?
             // Let's try string if _id is ObjectId
             const { ObjectId } = require('mongodb');
             try {
                 const user2 = await db.collection('users').findOne({ _id: new ObjectId(d.donorId) });
                 if (user2) {
                    await db.collection('donations').updateOne({ _id: d._id }, { $set: { donorName: user2.name } });
                 }
             } catch (e) {}
          }
      }
  }
  console.log("Done");
  await client.close();
}
fix();
