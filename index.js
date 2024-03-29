const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// middle
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST"],
};
app.use(cors(corsConfig));

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wpfolqw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const applicationCollection = client.db("bcsDb").collection("applications");

    app.get("/applicants", async (req, res) => {
      const result = await applicationCollection.find().toArray();
      res.send(result);
    });

    app.post("/applications", async (req, res) => {
      const body = req.body;
      const result = await applicationCollection.insertOne(body);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! Mahadi");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
