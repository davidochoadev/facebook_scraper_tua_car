import express from "express";
import Scraper from "./controllers/searchController.js";
import DeleteOldRecords from "./controllers/deleteController.js";
import chalk from "chalk";

const app = express();

const PORT = process.env.PORT || 8000;

app.get("/scraper", async (req, res) => {
  try {
    await Scraper();
    res.status(200).json({ success: "✅ Successfully completed the Scraping Process on Facebook!" });
  } catch (error) {
    res.status(500).json({ error: "❌ An error occurred during the Scraping Process." });
  }
});

app.get("/remove", async (req, res) => {
    try {
        const result = await DeleteOldRecords();
        res.status(200).json({ success: "✅ Successfully completed the Delete Process on Facebook Database!" });
    } catch (error) {
        res.status(500).json({ error: "❌ An error occurred during the Delete Process." });
    }
});

app.get("/", (req, res) => {
  res.send("Facebook Scraper Server is Up and Running");
});

//Messaggio di avvio del server
const connection = app.listen(PORT, () => {
  console.log(
    chalk.bgGreenBright(`🚀 App is running on http://localhost:${PORT}`)
  );
});

//Messaggio di chiusura al termine del server
const closeServer = () => {
    connection.close(() => {
      console.log(chalk.bgRedBright("❌ Closed Server"));
      process.exit(0);
    });
  };

// SIGINT signal di chiusura del server
process.on("SIGINT", closeServer);