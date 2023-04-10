import express from "express";
import bodyParser from "body-parser";
import mongoose  from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import  multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js"
import authroutes from "./routes/auth.js"
import userroutes from "./routes/users.js"
import postroutes from "./routes/posts.js"
import { createPost } from "./controllers/posts.js"
import { verifyToken } from "./middleware/auth.js";


/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname =path.dirname(__filename);
dotenv.config();
const app=express();
app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"))
app.use(bodyParser.json({limit:"30mb", extended:true}))
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname,'public/assets')) );


/* FILE STORAGE */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const upload =multer({storage});



/* ROUTES WITH FILES */
// upload.single() is a middleware which is used to upload picture

app.post("/auth/register", upload.single("picture"), register )
app.post("/posts",verifyToken ,upload.single("picture"), createPost)



/* ROUTES */

app.use("/auth" ,authroutes);
app.use("/users", userroutes);
app.use("/posts",postroutes)


/* MONGOOSE SETUP*/
mongoose.set('strictQuery', true);
const connect= async ()=>{
    try{
    const connect=await mongoose.connect(process.env.MONGO_URL) // We replace special character using percent encoding if it is present in username or password
    console.log('Congratulations! MongoDb is conected')
}catch(e)
{
    console.log(e)
    process.exit(1)
}
};


app.listen(3000,()=>console.log("connected"))
