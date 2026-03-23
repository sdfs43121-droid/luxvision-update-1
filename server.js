// 🧪 ACTIVAR PREMIUM MANUAL (PRUEBA)
app.get("/activar", async (req, res) => {
  const userId = req.query.userId || "user123";

  const expira = Date.now() + (30 * 24 * 60 * 60 * 1000);

  await db.ref("usuarios/" + userId).update({
    premium: true,
    expira: expira
  });

  res.send("Premium activado manualmente");
});
