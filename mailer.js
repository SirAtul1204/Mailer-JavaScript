const express = require("express");
const mailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const QRcode = require("easyqrcodejs-nodejs");
require("dotenv/config");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Mailer for my applications");
});

let transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post("/withQRcode", async (req, res) => {
  try {
    const API_KEY = req.body.API_KEY;
    if (API_KEY === process.env.API_KEY) {
      let QR = new QRcode({
        text: req.body.id,
        width: 200,
        height: 200,
      });

      QR.saveImage({
        path: "out.png",
      });

      let mailOption = {
        from: process.env.USER,
        to: req.body.email,
        subject: "Welcome!",
        text: "Your QR code is attached with the email",
        attachments: [{ filename: "out.png", path: "./out.png" }],
      };

      let mailRes = await transporter.sendMail(mailOption);
      console.log(mailRes);
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Listening to Port", PORT);
});
