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

//________________________ OBTENIR DADES (GET) ________________________
app.get('/api/getAlumnes/:id', async (req, res) => {
  const alum = await alumnes.findByPk(req.params.id)
  res.json(alum)
})

app.get('/api/getAlumnes/registre/:id', async (req, res) => {
  const alum = await alumnes.findByPk(req.params.id, {
    attributes: ['nom_alum', 'cog1_alum', 'cog2_alum', 'foto_alum', 'susceptible']
  })
  res.json(alum)
})

app.get('/api/getProfe/:id', async (req, res) => {
  const prof = await professors.findByPk(req.params.id)
  res.json(prof)
})
//________________________ CREAR DADES (POST) ________________________




app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

