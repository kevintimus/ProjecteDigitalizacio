import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { crearConfigBaseDades } from './dbConf.js';
import { initModels } from './Models/init-models.js';
import { Op } from 'sequelize';


//cd .\src\Backend\
//npx nodemon server.js

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(express.json());

const dbSQL = crearConfigBaseDades();
const { alumnes, grups, professors, registreLavabo } = initModels(dbSQL);

//________________________ OBTENIR DADES (GET) ________________________
app.get('/api/getAlumnes/:id', async (req, res) => {
  const alum = await alumnes.findByPk(req.params.id);
  res.json(alum);
});

//INFO QUE ES VEURÀ UN COP ES REGISTRI A UN ALUMNE
app.get('/api/getAlumnes/registre/:id', async (req, res) => {
  const alum = await alumnes.findByPk(req.params.id, {
    attributes: ['nom_alum', 'cog1_alum', 'cog2_alum', 'foto_alum', 'susceptible']
  });
  res.json(alum);
});

app.get('/api/getProfe/:id', async (req, res) => {
  const prof = await professors.findByPk(req.params.id);
  res.json(prof);
});

app.get('/api/getAlumnesPendents', async (req, res) => {
  const reg = await registreLavabo.findAll({
    where: {
      hora_sortida: {
        [Op.is]: null
      }
    }
  });
});
//________________________ CREAR DADES (POST) ________________________

app.post('/api/AfegirAlumne', async (req, res) => {
  try {
    const alum = await alumnes.create(req.body);
    res.status(201).json(alum);
  } catch (error) {
    console.error('Error en el post /api/AfegirAlumne');
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al afegir un alumne nou',
      error: error.message
    });
  }
});

app.post('/api/AfegirProfe', async (req, res) => {
  try {
    const prof = await professors.create(req.body);
    res.status(201).json(prof);
  } catch (error) {
    console.error('Error en el post /api/AfegirProfe');
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al afegir un profesor nou',
      error: error.message
    });
  }
});

app.post('/api/AfegirRegistreLavabo', async (req, res) => {
  try {
    const reg = await registreLavabo.create(req.body);
    res.status(201).json(reg);
  } catch (error) {
    console.error('Error en el post /api/AfegirRegistreLavabo');
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al afegir un registre',
      error: error.message
    });
  }
});

//________________________ MODIFICAR DADES (PUT) ________________________

app.put('/api/ModificarAlumne/:id', async (req, res) => {
  try {
    const alum = await alumnes.findByPk(req.params.id);
    if (!alum) {
      return res.status(404).json({
        mensaje: 'No s\'ha trobat aquest alumne'
      });
    }
    await alum.update(req.body);
    res.json(alum);
  } catch (error) {
    console.error('Error en el put /api/ModificarAlumne/:id');
    console.error(error);
    res.status(500).json({
      mensaje: 'Error modificant l\'alumne'
    });
  }
});

app.put('/api/ModificarProf/:id', async (req, res) => {
  try {
    const prof = await professors.findByPk(req.params.id);
    if (!prof) {
      return res.status(404).json({
        mensaje: 'Error modificant el professor'
      });
    }
    await prof.update(req.body);
    res.json(prof);
  } catch (error) {
    console.error('Error en el put /api/ModificarProf/:id');
    console.error(error);
    res.status(500).json({
      mensaje: 'Error modificant el profe'
    });
  }
});


app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
