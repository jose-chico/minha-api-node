import express from "express";
import { router } from "./routes/router";
import cors from "cors";
import path from "path";


import dotenv from "dotenv"; 
dotenv.config();


const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(router);

import { verifySMTP } from "./controllers/services/mailer/mailer";
verifySMTP();


app.listen(PORT, () => {
	console.log(`Server Rodando na Porta ${PORT}`);
}); 
