import Search from './classes/search.js'
import mysql from 'mysql'
import util from 'util'
import dotenv from 'dotenv'
import chalk from "chalk";
import { facebookApiService } from '../service/facebookApiService.js';
import { comuneApiService } from '../service/comuneApiService.js';
dotenv.config()
const service = new facebookApiService();
const comune = new comuneApiService();

export const scraper = async (req,res) => {
  console.log(chalk.bgYellowBright("🏁 Starting Facebook Web Scraper!"));
  const location = req.query.location;
  const scrollCount = req.query.scroll_count || 0
  console.log("Page is:", scrollCount)
  const search = new Search(parseInt(scrollCount), process.env.FACEBOOK_EMAIL, process.env.FACEBOOK_PASSWORD);
  try{
    const carsFromDb = await service.getAllFacebookCars();
    console.log("Got the following duplicates number from db: " + JSON.stringify(carsFromDb.length));
    const duplicates = carsFromDb.map(obj => obj.urn); 
    const data = await search.main(duplicates, location);
    var failures = 0;
    var correct = 0;
    for (let car of data) {
      const geo_info = await comune.getComune(car.geo_town) || "";
      
      try {
        await service.createFacebookCar(car.urn, car.subject, isNaN(car.price) ? 0 : car.price, car.mileage_scalar, car.register_year, car.geo_region, geo_info.provincia, car.geo_town, car.url, car.advertiser_name, car.advertiser_phone);
        console.log(`Element ${car.subject} added to database`);
        correct++
      }
      catch (err) {
        console.log(chalk.bgRedBright("❌ Unable to add current item"), err);
        failures++
      }
    }
/*     const data = await search.main(duplicates); */
    res.status(200).json({ successful : `✅ Created new ${correct} announcement from facebook on the database`});
  }
  catch (err){
    console.log(chalk.redBright("❌ Database Connection Failed..."),err);
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

export const test = async (req,res) => {
  try {
    const search = new Search(parseInt(scrollCount), process.env.FACEBOOK_EMAIL, process.env.FACEBOOK_PASSWORD, 0);
    const data = await search.launch();
    res.status(200).json({ok: "test is working!", data});
  }catch(err) {
    res.status(500).json({ failed : "❌ Test is not working...", err});
  }
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
