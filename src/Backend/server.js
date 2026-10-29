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
const { alumnes, grups, professors, registres_lababo } = initModels(dbSQL);

//________________________ OBTENIR DADES (GET) ________________________

//-----------------------------------------------
//------------------- ALUMNES -------------------
//-----------------------------------------------
app.get('/api/getAlumnes', async (req, res) => {
  try {
    const alum = await alumnes.findAll()
    res.json(alum)
  } catch (error) {
    console.error("Error en el get /api/getAlumnes");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtenir Alumnes",
      error: error.message
    })
  }
})

app.get('/api/getAlumnes/:id', async (req, res) => {
  try {
    const alum = await alumnes.findByPk(req.params.id)
    res.json(alum)
  } catch (error) {
    console.error("Error en el get /api/getAlumnes/:id");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtenir un alumne",
      error: error.message
    })
  }
})

//INFO QUE ES VEURÀ UN COP ES REGISTRI A UN ALUMNE
app.get('/api/getAlumnes/registre/:id', async (req, res) => {
  try {
    const alum = await alumnes.findByPk(req.params.id, {
      attributes: ['nom_alum', 'cog1_alum', 'cog2_alum', 'foto_alum', 'susceptible']
    })
    res.json(alum)
  } catch (error) {
    console.error("Error en el get /api/getAlumnes/registre/:id");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtenir l'alumne",
      error: error.message
    })
  }
})

//-----------------------------------------------
//----------------- PROFESSORS ------------------
//-----------------------------------------------
app.get('/api/getProfe', async (req, res) => {
  try {
    const prof = await professors.findAll()
    res.json(prof)
  } catch (error) {
    console.error("Error en el get /api/getProfe");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtenir Professors",
      error: error.message
    })
  }
})

app.get('/api/getProfe/:id', async (req, res) => {
  try {
    const prof = await professors.findByPk(req.params.id)
    res.json(prof)
  } catch (error) {
    console.error("Error en el get /api/getProfe/:id");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtenir un Professor",
      error: error.message
    })
  }
})

//-----------------------------------------------
//------------------ REGISTRES ------------------
//-----------------------------------------------
app.get('/api/getRegistreLavabo', async (req, res) => {
  try {
    const regis = await registres_lababo.findAll()
    res.json(regis)
  } catch (error) {
    console.error("Error en el get /api/getRegistreLavabo");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtenir registres",
      error: error.message
    })
  }
})

app.get('/api/getRegistreLavabo/oberts', async (req, res) => {
  try {
    const regis = await registres_lababo.findAll({
      where: {
        hora_sortida: null
      }
    })
    res.json(regis)
  } catch (error) {
    console.error("Error en el get /api/getRegistreLavabo/oberts");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtenir registres oberts",
      error: error.message
    })
  }
})

//-----------------------------------------------
//-------------------- GRUPS --------------------
//-----------------------------------------------

app.get('/api/getGrups', async (req, res) => {
  try {
    const grup = await grups.findAll()
    res.json(grup)
  } catch (error) {
    console.error("Error en el get /api/getGrups");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtenir Grups",
      error: error.message
    })
  }
})

app.get('/api/getGrups/:id', async (req,res) => {
  try {
    const grup = await grups.findByPk(req.params.id)
    res.json(grup)
  } catch (error) {
    console.error("Error en el get /api/getGrups/:id");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al obtenir un grup",
      error: error.message
    })
  }

})
//________________________ CREAR DADES (POST) ________________________

//-----------------------------------------------
//------------------- ALUMNES -------------------
//-----------------------------------------------

app.post('/api/AfegirAlumne', async (req, res) => {
  try {
    const alum = await alumnes.create(req.body)
    res.status(201).json(alum)
  } catch (error) {
    console.error("Error en el post /api/AfegirAlumne");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al afegir un alumne nou",
      error: error.message
    })
  }
})

app.post('/api/AfegirAlumneAmbImport', async (req, res) => {
  try {
    const alum = await alumnes.create({
      id_ieducat: req.body.id,
      nom_alum: req.body.nombre,
      cog1_alum: req.body.apellido1,
      cog2_alum: req.body.apellido2,
      foto_alum: req.body.foto,
      correu_alum: req.body.email,
      susceptible: req.body.susceptible,
      codi_grup_mat: req.body.codigo
    })
    res.status(201).json(alum)
  } catch (error) {
    console.error("Error en el post /api/AfegirAlumneAmbImport");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al afegir un alumne nou",
      error: error.message
    })
  }
})

//-----------------------------------------------
//----------------- PROFESSORS ------------------
//-----------------------------------------------

app.post('/api/AfegirProfe', async (req, res) => {
  try {
    const prof = await professors.create(req.body)
    res.status(201).json(prof)
  } catch (error) {
    console.error("Error en el post /api/AfegirProfe");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al afegir un profesor nou",
      error: error.message
    })
  }
})

//-----------------------------------------------
//------------------ REGISTRES ------------------
//-----------------------------------------------

app.post('/api/AfegirRegistreLavabo', async (req, res) => {
  try {
    const reg = await registres_lababo.create(req.body)
    res.status(201).json(reg)
  } catch (error) {
    console.error("Error en el post /api/AfegirRegistreLavabo");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al afegir un registre",
      error: error.message
    })
  }
})

//-----------------------------------------------
//-------------------- GRUPS --------------------
//-----------------------------------------------

app.post('/api/AfegirGrups', async (req, res) => {
  try {
    const grup = await grups.create(req.body)
    res.status(201).json(grup)
  } catch (error) {
    console.error("Error en el post /api/AfegirGrups");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al afegir un grup",
      error: error.message
    })
  }
})

//________________________ MODIFICAR DADES (PUT) ________________________

//-----------------------------------------------
//------------------- ALUMNES -------------------
//-----------------------------------------------
app.put('/api/ModificarAlumne/:id', async (req, res) => {
  try{
    const alum = alumnes.findByPk(req.params.id)
    if (!alum) {
      return res.status(404).json({
        mensaje: "Alumne no trobat"
      })
    }
    await alum.update({
      nom_alum: req.body.nom_alum,
      cog1_alum: req.body.cog1_alum,
      cog2_alum: req.body.cog2_alum,
      foto_alum: req.body.foto_alum,
      correu_alum: req.body.correu_alum,
      susceptible: req.body.susceptible,
      id_grup: req.body.id_grup
    });
    res.json(alum);
  } catch (error) {
    console.error("Error en el put /api/ModificarAlumne/:id");
    console.error(error);
    res.status(500).json({
      mensaje: "Error al modificar l'alumne",
      error: error.message
    });
  }
})

//-----------------------------------------------
//----------------- PROFESSORS ------------------
//-----------------------------------------------

app.put('/api/ModificarProfessor/:id', async (req, res) => {
  try {
    const profe = await professors.findByPk(req.params.id)

    if (!profe) {
      res.status(404).json({
        mensaje: "Professor no trobat",
      })
    }
    await profe.update({
      nom_prof: req.body.nom_prof,
      cog1_prof: req.body.cog1_prof,
      cog2_prof: req.body.cog2_prof,
      correu: req.body.correu,
      admin: req.body.admin
    })
    res.json(profe)
  } catch (error) {
    console.error("Error en el put /api/ModificarProfessor/:id");
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al modificar el professor',
      error: error.message
    });
  }
})

//-----------------------------------------------
//------------------ REGISTRES ------------------
//-----------------------------------------------

app.put('/api/ModificarRegistreLavabo/:id', async (req, res) => {
  try {
    const regis = await registres_lababo.findByPk(req.params.id);

    if (!regis) {
      return res.status(404).json({
        mensaje: 'No s\'ha trobat el registre'
      });
    }

    if (regis.hora_sortida) {
      return res.status(400).json({
        mensaje: 'Aquest registre ja està tancat'
      });
    }

    await regis.update({
      hora_sortida: new Date()
    });

    res.json(regis);

  } catch (error) {
    console.error('Error en el put /api/ModificarRegistreLavabo/:id');
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al tancar el registre',
      error: error.message
    });
  }
});

//-----------------------------------------------
//-------------------- GRUPS --------------------
//-----------------------------------------------

app.put('/api/ModificarGrup/:id', async (req, res) => {
  try {
    const grup = await grups.findByPk(req.params.id)

    if (!grup) {
      res.status(404).json({
        mensaje: "Grup no trobat"
      })
    }
    await grup.update({
      curs: req.body.curs,
      grup: req.body.grup
    })

    res.json(grup);

  } catch (error) {
    console.error("Error en el put /api/ModificarGrup/:id");
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al modificar el grup',
      error: error.message
    })
  }
})
//________________________ ELIMINAR DADES (DELETE) ________________________

//-----------------------------------------------
//------------------- ALUMNES -------------------
//-----------------------------------------------

app.delete('/api/EliminarAlumne/:id', async (req, res) => {
  try {
    const alum = await alumnes.findByPk(req.params.id);

    if (!alum) {
      return res.status(404).json({
        mensaje: 'No s\'ha trobat l\'alumne'
      });
    }

    await alum.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Error en el delete /api/EliminarAlumne/:id');
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al eliminar l\'alumne',
      error: error.message
    });
  }
});

//-----------------------------------------------
//----------------- PROFESSORS ------------------
//-----------------------------------------------

app.delete('/api/EliminarProfessor/:id', async (req, res) => {
  try {
    const prof = await professors.findByPk(req.params.id);

    if (!prof) {
      return res.status(404).json({
        mensaje: 'No s\'ha trobat el professor'
      });
    }

    await prof.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Error en el delete /api/EliminarProfessor/:id');
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al eliminar el professor',
      error: error.message
    });
  }
})


app.delete('/api/EliminarGrup/:id', async (req,res) => {
  try {
    const grup = await grups.findByPk(req.params.id);

    if (!grup) {
      return res.status(404).json({
        mensaje: 'No s\'ha trobat el grup'
      });
    }

    await grup.destroy();

    res.status(204).send();
  } catch (error) {
    console.error('Error en el delete /api/EliminarGrup/:id');
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al eliminar el grup',
      error: error.message
    });
  }
})
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
