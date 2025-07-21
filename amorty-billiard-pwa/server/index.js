const express = require("express");
const admin = require("firebase-admin");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://amorty-billiards-pwa-default-rtdb.firebaseio.com/"
});

const db = admin.database();

app.get("/log-bookings", async (req, res) => {
  try {
    const snapshot = await db.ref("booking").once("value");
    const data = snapshot.val();

    // Simpan log ke file agar dibaca SIEM/Wazuh
    fs.writeFileSync("booking-log.json", JSON.stringify(data, null, 2));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).send("Error retrieving booking data");
  }
});

app.listen(3001, () => {
  console.log("Middleware server running on http://localhost:8080");
});
