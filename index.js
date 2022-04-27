const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

//database info
// name: remadeEmajon
//pass: 9QQnm4FVa90MUYZ4

const uri =
  "mongodb+srv://remadeEmajon:9QQnm4FVa90MUYZ4@cluster0.nvnfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
//  const collection = client.db("emajhon").collection("products");

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("emajhon").collection("products");
    const orderColection = client.db("emajhon").collection("orders");

    app.get("/products", async (req, res) => {
      console.log(req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const querry = {};
      const cursor = productCollection.find(querry);
      let result;
      if(page || size){
        result = await cursor.skip(page*size).limit(size).toArray();
      }else{
        result = await cursor.toArray();
      }
      res.send(result);
    });

    app.get("/productsCount", async (req, res) => {
      const querry = {};
      const cursor = productCollection.find(querry);
      const count = await cursor.count();
      res.send({ count });
    });

    app.post('/products/keys', async(req, res) => {
        const keys = req.body;
        const ids = keys.map(id=>ObjectId(id))
        const querry = {_id: {$in: ids}}
        const cursor = productCollection.find(querry);
        const result = await cursor.toArray();
        res.send(result);
        console.log(keys);
    });

    //order collection
    app.post('/order', async(req, res) => {
        const order = req.body;
        const result = await orderColection.insertOne(order);
        res.send(result)
    })

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

//
app.get("/", (req, res) => {
  res.send("hello mama ami remade emajon server");
});
app.listen(port, () => {
  console.log("remade ema-jhon server running", port);
});
