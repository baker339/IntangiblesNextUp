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

  const data = [
    {
      id: 0,
      name: "Aidan Baker",
      image: "https://ca.slack-edge.com/EC088DZV2-U022GE8DQA3-2f073837434c-512",
      nextUp: 0,
      lastUp: "",
      order: 0,
    },
    {
      id: 1,
      name: "Neeley Holroyd",
      image: "https://ca.slack-edge.com/EC088DZV2-WKT1YGYGJ-99e6d7e26867-512",
      nextUp: 0,
      lastUp: "",
      order: 1,
    },
    {
      id: 2,
      name: "Zachary Shuford",
      image: "https://ca.slack-edge.com/EC088DZV2-U01PNKJ7B25-95242ae53b95-512",
      nextUp: 0,
      lastUp: "",
      order: 2,
    },
    {
      id: 3,
      name: "Hanna Sydorova",
      image: "https://ca.slack-edge.com/EC088DZV2-U01HLM2SWMT-f2a5e068dc99-512",
      nextUp: 0,
      lastUp: "12/17/2021",
      order: 3,
    },
    {
      id: 4,
      name: "Isabella Patterson",
      image: "https://ca.slack-edge.com/EC088DZV2-U01KPPVUAK1-3a0d64333dd9-512",
      nextUp: 1,
      lastUp: "",
      order: 4,
    },
    {
      id: 5,
      name: "Isaac Mick",
      image: "https://ca.slack-edge.com/EC088DZV2-U0239RMDTED-e780ad154536-512",
      nextUp: 0,
      lastUp: "",
      order: 5,
    },
    {
      id: 6,
      name: "Vinod Sundaramurthy",
      image: "https://ca.slack-edge.com/EC088DZV2-U02B832MEL8-49f7561670f9-512",
      nextUp: 0,
      lastUp: "",
      order: 6,
    },
    {
      id: 7,
      name: "Mohammed Kashif Uddin Ansari",
      image: "https://ca.slack-edge.com/EC088DZV2-U02JGLPK26S-eb855e25ea37-512",
      nextUp: 0,
      lastUp: "",
      order: 7,
    },
  ];

  try {
    for (let i = 0; i < data.length; i++) {
      await members.create(data[i].id, data[i]);
    }

    return {
      statusCode: 200,
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};
