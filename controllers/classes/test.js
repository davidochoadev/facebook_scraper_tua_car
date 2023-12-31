import fsPromises from "fs/promises";
import puppeteer from "puppeteer";
import JSON2CSVParser from "json2csv/lib/JSON2CSVParser.js";
import { facebookApiService } from "../../service/facebookApiService.js";
import chalk from "chalk";
import { type } from "os";

export default class Test {
  constructor(debugMode = 0) {
    this.debugMode = debugMode;
  }

  async launch() {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        ignoreDefaultArgs: [],
        timeout: 3000,
      });
      this.page = await browser.newPage();
      await browser.close();
      return { success: "Puppeteer is working successfully!" };
    } catch (error) {
      return { error };
    }
  }
}
