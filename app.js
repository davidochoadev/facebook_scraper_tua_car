import express from "express";
import { scraper } from "./controllers/searchController.js";
import DeleteOldRecords from "./controllers/deleteController.js";
import cors from 'cors';
import corsOptions from "./config/corsOptions.js";
import chalk from "chalk";

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

app.get("/facebook", scraper);

/* app.get("/scraper", async (req, res) => {
  try {
    const res = await Scraper();
    res.status(200).json({ success: "✅ Successfully completed the Scraping Process on Facebook!" }, res );
  } catch (error) {
    res.status(500).json({ wrong: "❌ An error occurred during the Scraping Process." }, error);
  }
}); */

app.get("/remove", async (req, res) => {
    try {
        const result = await DeleteOldRecords();
        res.status(200).json({ success: "✅ Successfully completed the Delete Process on Facebook Database!" });
    } catch (error) {
        res.status(500).json({ error: "❌ An error occurred during the Delete Process." });
    }
});

app.get("/", (req, res) => {
    res.status(200).json({ welcome_message: "/ Facebook Scraper v1.0.0" });
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