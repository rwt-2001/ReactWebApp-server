import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes/posts.js";
import userRoutes from "./routes/user.js";
import dotenv from 'dotenv';

const app = express();
dotenv.config();



//Setup BodyParser
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use('/posts', router);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send("API for Share to all");
})

const PORT = process.env.PORT || 5000;
//Connecting to Database
mongoose.connect(process.env.DB_CONNECTION_URL).
    then(() => {
        app.listen(PORT, () => {

            console.log(`Server Running on port: ${PORT}`)
        })
    })
    .catch((error) => { console.log(error) });
;
