const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const QRCode = require('qrcode')
const generatePayload = require('promptpay-qr')
const bodyParser = require('body-parser')
const _ = require('lodash');
const { response } = require('express');
const port = 80;

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

var amount = 500000;
var currency = 'thb';

var omise = require('omise')({
  'publicKey': process.env.OMISE_PUBLIC_KEY,
  'secretKey': process.env.OMISE_SECRET_KEY
});

var cardDetails = {
  card: {
    'name': 'arm',
    'city': 'Bangkok',
    'postal_code': 10160,
    'number': '4242424242424242',
    'expiration_month': 12,
    'expiration_year': 2024,
  },
};

var source = {
  'type': 'internet_banking_bbl',
  'amount': 500000,
  'currency': 'thb',
};

// omise.sources.create(source).then(function(resSource) {
//   return omise.charges.create({
//     'amount':     amount,
//     'source':     resSource.id,
//     'currency':   currency,
//     'return_uri': 'http://localhost:3000/message',
//   });
// }).then(function(charge) {
//   console.log(charge);
// }).catch(function(err) {
//   console.log(err);
// });


// omise.tokens.create(cardDetails, function (err, token) {
//   omise.charges.create({
//     amount: 120000,
//     currency: 'thb',
//     card: token.id,
//     metadata: {
//       note: 'test card'
//     }
//   }, function (err, charge) {
//     if (err) {
//       console.log('error', err);
//       return;
//     }
//     console.log('charge', charge);
//   });
// });

mongoose.connect("mongodb://admin:1234@ac-7c0mbnp-shard-00-00.u5fneuc.mongodb.net:27017,ac-7c0mbnp-shard-00-01.u5fneuc.mongodb.net:27017,ac-7c0mbnp-shard-00-02.u5fneuc.mongodb.net:27017/?ssl=true&replicaSet=atlas-r19x1c-shard-0&authSource=admin&retryWrites=true&w=majority", {
  useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})

const customersSchema = new mongoose.Schema({
  accounts: String,
  active: String,
  address: String,
  birthdate: String,
  email: String,
  name: String,
  username: String
})

const Customers = new mongoose.model("customers", customersSchema)

app.get('/find', (req, res) => {
  Customers.find({}, function (err, docs) {
    if (err) {
      res.send(err)
    }
    else {
      res.send(docs)
    }
  });
})


app.post('/show', (req, res) => {
  var cardDetails = req.body;
  console.log(cardDetails)

  omise.tokens.create(cardDetails, function (err, token) {
    console.log('token', token.id)
    omise.charges.create({
      amount: 120000,
      currency: 'thb',
      return_uir: 'http://example.com',
      card: token.id,
      metadata: {
        note: 'test card'
      }
    }, function (err, charge) {
      if (err) {
        console.log('error', err);
        return;
      }
    });
  });

  return res.send('success')
})

app.get('/generateQR', (req, res) => {
  const amount = 12000;
  const mobileNumber = '0945378034';
  const payload = generatePayload(mobileNumber, { amount })
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



