"use strict";

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

const dbName = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;

const { MongoClient } = require("mongodb");

const uri = `mongodb+srv://${dbName}:${password}@cluster0.9mirr.mongodb.net/linkShorter?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const linkCollection = client.db("linkShorter").collection("linkList");

  app.post("/link/insert", (req, res) => {
    const data = req.body;
    linkCollection.insertOne(data).then((result) => {
      res.send(result.acknowledged);
      console.log(result);
    });
  });

  app.post("/link/get", (req, res) => {
    const linkId = req.body.linkId;

    linkCollection.find({ urlName: linkId }).toArray((err, result) => {
      res.send(result);
    });
  });

  app.post("/link/find", (req, res) => {
    const linkId = req.body.linkId;
    console.log(linkId);

    linkCollection.find({ urlName: linkId }).toArray((err, exists) => {
      res.send(exists.length > 0);
    })
    
  });
});

app.get("/", (req, res) => {
  res.send("Server Running!");
});
app.listen(5000 || process.env.PORT);
