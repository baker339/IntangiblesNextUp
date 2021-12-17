const { createClient } = require("@astrajs/collections");

const collection = "members";

exports.handler = async function (event, context, callback) {
  // create an {astra_db} client
  const astraClient = await createClient({
    astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN,
  });

  const members = astraClient
    .namespace(process.env.ASTRA_DB_KEYSPACE)
    .collection(collection);

  try {
    const res = await members.find();

    return {
      statusCode: 200,
      body: JSON.stringify(Object.keys(res.data).map((i) => res.data[i])),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};
