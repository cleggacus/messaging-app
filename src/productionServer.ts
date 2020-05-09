import https from "https";
import fs from "fs";
import express from "express";
import app from "./app";

let http = express();

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(process.env.PORT || 443, () => {
  console.log("running https");
});

http.get('*', (req, res) => {  
    res.redirect('https://' + req.headers.host + req.url);
});

http.listen(process.env.PORT || 80, () => {
  console.log("running http");
});