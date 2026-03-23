require("dotenv").config();

const express = require("express");
const mercadopago = require("mercadopago");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 CONFIGURAR MERCADO PAGO
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN
});

// 🧪 RUTA DE PRUEBA (para ver si funciona el server)
app.get("/", (req, res) => {
  res.send("Backend funcionando OK 🚀");
});

// 💳 CREAR PAGO (IMPORTANTE: GET para probar en navegador)
app.get("/crear-preferencia", async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: "Suscripción Premium",
          quantity: 1,
          currency_id: "ARS",
          unit_price: 1000
        }
      ],
      back_urls: {
        success: "https://google.com",
        failure: "https://google.com",
        pending: "https://google.com"
      },
      notification_url: "https://backend-mp-1a6g.onrender.com/webhook",
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);

    res.json({
      init_point: response.body.init_point
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).send("Error al crear pago");
  }
});

// 🔔 WEBHOOK (cuando alguien paga)
app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook recibido:", req.body);

    // 👉 Aquí luego activamos premium (Firebase)
    
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// 🚀 PUERTO
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
