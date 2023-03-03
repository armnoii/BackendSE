const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const QRCode = require('qrcode')
const generatePayload = require('promptpay-qr')
const bodyParser = require('body-parser')
const _ = require('lodash')
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

mongoose.connect("mongodb://admin:1234@ac-7c0mbnp-shard-00-00.u5fneuc.mongodb.net:27017,ac-7c0mbnp-shard-00-01.u5fneuc.mongodb.net:27017,ac-7c0mbnp-shard-00-02.u5fneuc.mongodb.net:27017/?ssl=true&replicaSet=atlas-r19x1c-shard-0&authSource=admin&retryWrites=true&w=majority", {
  useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})

const mageSchema = new mongoose.Schema({
  name: {
      type: String,
      require: true
  },
  power_type: {
      type: String,
      require: true
  },
  mana_power: Number,
  health: Number,
  gold: Number
})

const Mage = new mongoose.model("Mage", mageSchema)

const createManyDocuments = async () =>{
  try {
   await Person.deleteMany({});    
   let persons = await Person.create(
    [
       {   
         name: "Theodore",
         title: "MERN Stack Developer",
         commit: 1000
       },
       {   
         name: "Chidera",
         title: "Network Administrator",
         commit: 1000
       },
       {
         name: "Elijah",
         title: "Backend Developer",
         commit: 200
       },
       {
         name: "Emeka",
         title: "Web Developer",
         commit: 500
       }
     ]
   )
   return persons
 }
 catch (error) {
   throw error
 }
}

app.get("/create", async (req, res) => {
  let persons = await createManyDocuments();
  res.json({documents: persons});
});

app.get("/findname", async (req, res)=>{
  Mage.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
})

app.get('/generateQR', (req, res) => {
  const amount = 12000;
  const mobileNumber = '0945378034';
  const payload = generatePayload(mobileNumber, {amount})
  const option = {
    color: {
      dark: '#000',
      light: '#fff'
    }
  }
  QRCode.toDataURL(payload, option, (err, url) => {
    if (err) {
      console.log(err);
    } else {
      return res.status(200).json({
        RespCode: 200,
        RespMessage: 'good',
        Result: url
      })
    }
  })
})


