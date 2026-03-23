require("dotenv").config();

const express = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());
app.use(cors());

// 🔥 FIREBASE
const serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://miprimeraapp-62377-default-rtdb.firebaseio.com"
});

const db = admin.database();

// 💳 MERCADO PAGO
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN
});

// 🧪 TEST
app.get("/", (req, res) => {
  res.send("Backend funcionando OK 🚀");
});

// 💳 CREAR PAGO
app.get("/crear-preferencia", async (req, res) => {
  try {
    const userId = req.query.userId || "user123";

    const preference = {
      items: [
        {
          title: "Suscripción Premium",
          quantity: 1,
          currency_id: "ARS",
          unit_price: 8000
        }
      ],
      metadata: {
        userId: userId
      },
      notification_url: "https://backend-mp-r7nd.onrender.com/webhook",
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({
      init_point: response.body.init_point
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

// 🔔 WEBHOOK → ACTIVAR PREMIUM
app.post("/webhook", async (req, res) => {
  try {
    if (req.body.type === "payment") {

      const payment = await mercadopago.payment.findById(req.body.data.id);

      if (payment.body.status === "approved") {

        const userId = payment.body.metadata.userId;

        const expira = Date.now() + (30 * 24 * 60 * 60 * 1000);

        await db.ref("usuarios/" + userId).update({
          premium: true,
          expira: expira
        });

        console.log("Premium activado:", userId);
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
