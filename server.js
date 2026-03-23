require("dotenv").config();

const express = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN
});

app.post("/crear-preferencia", async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: "Premium",
          quantity: 1,
          currency_id: "ARS",
          unit_price: 1000
        }
      ],
      notification_url: "https://TU_BACKEND.onrender.com/webhook"
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({
      init_point: response.body.init_point
    });

  } catch (e) {
    res.status(500).send("Error");
  }
});

app.post("/webhook", (req, res) => {
  console.log("Pago recibido");
  res.sendStatus(200);
});

app.listen(3000, () => console.log("OK"));
