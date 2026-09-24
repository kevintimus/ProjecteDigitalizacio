import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { crearConfigBaseDades } from './dbConf.js';
import {initModels} from './Models/init-models.js'


//cd .\src\Backend\
//npx nodemon server.js

dotenv.config();

const app  = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(express.json());

const dbSQL = crearConfigBaseDades();
const { alumnes, grups, professors, registreLababo } = initModels(dbSQL);

app.get('/Prova', async (req, res) => {
  const alum = await alumnes.findAll()
  res.json(alum)
})


app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));


