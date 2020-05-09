import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import routes from "./routes";
import path from "path";
import dotenv from "dotenv";

dotenv.config({path:'.env'});
const development = process.env.NODE_ENV !== 'production';
const connectionUrl = process.env.MongoUrl as string;
const app = express();

mongoose.connect(
  connectionUrl, { useNewUrlParser: true }
);

mongoose.Promise = global.Promise;

if(development){
  app.use(morgan("dev"));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use('/pictures', express.static(path.join(__dirname, '../pictures')));
app.use("/api", routes);

if(!development){
  app.use('/', express.static(__dirname + '/build'));
  app.get('/', function(req, res){
    res.sendFile(__dirname + '/build/index.html');
  });
}

export default app;