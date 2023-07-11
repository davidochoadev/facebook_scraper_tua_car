import Search from './classes/search.js'
import mysql from 'mysql'
import util from 'util'
import dotenv from 'dotenv'
import chalk from "chalk";
dotenv.config()

const db = mysql.createConnection({
  host : process.env.DB_HOST,
  port: process.env.DB_PORT,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

export default async function DeleteOldRecords() {
   console.log(chalk.bgYellowBright("🧹 Deleting expired records!"));
   try{
      console.log(chalk.greenBright("✅ Database Connection Success..."))
      db.connect()
    }
    catch (err){
      console.log(chalk.redBright("❌ Database Connection Failed..."),err)
      return 0
    }
    const query = util.promisify(db.query).bind(db);
    try {
      await query('DELETE FROM `cars_facebook` WHERE `date_remote` <= ?', [new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000 + 1)])
      console.log(chalk.bgGreen("🗑 Database was updated successfully, expired records removed"))
    }
    catch (err) {
      console.log(err)
    }
 }
 