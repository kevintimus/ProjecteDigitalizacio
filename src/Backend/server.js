import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


//cd .\src\Backend\
//npx nodemon server.js

dotenv.config();

const app  = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(express.json());


app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));

