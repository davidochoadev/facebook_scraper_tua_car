import Search from './classes/search.js'
import mysql from 'mysql'
import util from 'util'
import dotenv from 'dotenv'
import chalk from "chalk";
import { facebookApiService } from '../service/facebookApiService.js';
import { comuneApiService } from '../service/comuneApiService.js';
dotenv.config()
const search = new Search(0, process.env.FACEBOOK_EMAIL, process.env.FACEBOOK_PASSWORD);
const service = new facebookApiService();
const comune = new comuneApiService();

const db = mysql.createConnection({
  host : process.env.DB_HOST,
  port: process.env.DB_PORT,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_NAME
});

export const scraper = async (req,res) => {
  console.log(chalk.bgYellowBright("🏁 Starting Facebook Web Scraper!"));
  try{
    const carsFromDb = await service.getAllFacebookCars();
/*     const data = await search.main(carsFromDb); */
    var failures = 0;
      const geo_info = await comune.getComune("Roma");
      console.log(geo_info);
    console.log("Got the following duplicates number: " + JSON.stringify(carsFromDb));
/*     const data = await search.main(duplicates); */
    res.status(200).json({ successful : `✅ ${JSON.stringify(carsFromDb.length)} and geo_info: ${geo_info.comune}`});
  }
  catch (err){
    console.log(chalk.redBright("❌ Database Connection Failed..."),err)
    res.status(500).json({ failed : "❌ Database connection failed...", err});
  }
/*   const query = util.promisify(db.query).bind(db)
  const duplicates = await query('SELECT `urn` FROM `cars_facebook` WHERE 1')
  console.log("Got the following duplicates number: " + duplicates.length)
  const data = await search.main(duplicates)
  var failures = 0
  for (let car of data) {
    const geo_info = await query('SELECT * FROM `italy_munic` WHERE `comune` = ?', [car.geo_town])
    try {
      await query('INSERT INTO `cars_facebook`(`urn`, `subject`, `price`, `mileage_scalar`, `register_year`, `geo_region`, `geo_provincia`, `geo_town`, `url`, `advertiser_name`, `advertiser_phone`) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [car.urn, car.subject, car.price, car.mileage_scalar, car.register_year, car.geo_region, geo_info[0].provincia, car.geo_town, car.url, car.advertiser_name, car.advertiser_phone])
      console.log(`Element ${car.subject} added to database`)
    }
    catch (err) {
      console.log(chalk.bgRedBright("❌ Unable to add current item"))
      failures++
    }

  }
  return (`${data.length - failures} out of ${data.length} were added successfully to the database`) */
}


export default async function Scraper() {

/*   try {
    await query('DELETE FROM `cars_facebook` WHERE `date_remote` <= ?', [new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000 + 1)])
    console.log("Database was updated successfully")
  }
  catch (err) {
    console.log(err)
  } */
}
