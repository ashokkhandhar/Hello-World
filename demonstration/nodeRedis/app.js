const express = require('express');
const app = express();
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

let client = redis.createClient({
  host: 'localhost',
  port: 6379,
});

client.on('error', console.error);

session({
  store: new RedisStore({ client }),
  saveUninitialized: false,
  secret: 'amazing stuff',
  resave: false,
});

app.get('/', (req,res)=>{
    let key = req.query['name'];
    if(key){
        let value = RedisStore[key];
        if(value){
            value = ++RedisStore[key];
            res.send(`Hello ${key}, ${value}!`);
            console.log(`${key}, ${value}`);
        }
        else{
            value = RedisStore[key] = 1;
            res.send(`Hello ${key}, ${value}!`);
            console.log(`${key}, ${value}`);
        }
    }
    else{
        if(key==undefined) {
            console.log("Home");
            res.send("Hello World!");
        }
        else {
            console.log("Name is empty!");
            res.send("Please Enter Name..!");
        }
    }
});
const port = 3000;
app.listen(port,()=>{
    console.log(`App is listening at http://localhost:${port}`);
});