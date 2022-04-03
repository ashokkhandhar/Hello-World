const express = require('express');
const app = express();
const mysql = require('mysql');
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
  secret: 'om',
  resave: false,
});

// Create mysql connection
const db = mysql.createConnection({
    // host: 'localhost',
    host: 'mysql_server',
    user: 'root',
    password: '',
    database: 'records'
});

// Connect mysql
db.connect((err)=>{
    if(err) throw err;
    else console.log('MySql Connected..!');
});

// create database
const database = 'CREATE DATABASE IF NOT EXISTS records';
db.query(database, (err)=>{
    if(err) throw err;
    console.log("Database created Successfully!");
});

// create table
const table = 'CREATE TABLE IF NOT EXISTS logs(id int AUTO_INCREMENT, name VARCHAR(50), count int, PRIMARY KEY(id))';
db.query(table, (err)=>{
    if(err) throw err;
    console.log("Table created Successfully!");
});

// variables to interact with mysql database
const insert = 'INSERT INTO logs(name,count) values (?,?)';
const update = 'update logs set count = count+1 where name=?';
const getlogs = 'SELECT * FROM logs WHERE name = ?';

// Driver code
app.get('/', (req, res)=>{
    let key = req.query['name'];
    if(key){
        let value = RedisStore[key];
        // found in redis
        if(value){
            db.query(getlogs,[key], (err, result)=>{
                if(err) throw err;
                else{
                    // found in database
                    if(result.length>0){
                        // value = (result[0].count)+1;     //to take count from database 
                        value++;                            //to take count from redis
                        RedisStore[key] = value;
                        db.query(update,[key], (err)=>{
                            if(err) throw err;
                            else console.log(`[${key}, ${value}] : log is already exiest in database and redis, count updated!`);
                        });
                        res.send(`Hello ${key}, ${value}!`);
                    }
                    // not found in database
                    else{
                        RedisStore[key] = ++value;
                        db.query(insert,[key,value], (err)=>{
                            if(err) throw err;
                            else console.log(`[${key}, ${value}] : log is already exiest in redis but not in database, added to database and count updated!`);
                        });
                        res.send(`Hello ${key}, ${value}!`)
                    }
                }
            });
        }
        // not found in redis
        else{
            db.query(getlogs,[key], (err, result)=>{
                if(err) throw err;
                else{
                    // found in database
                    if(result.length>0){
                        value = (result[0].count)+1;
                        RedisStore[key] = value;
                        db.query(update,[key], (err)=>{
                            if(err) throw err;
                            else console.log(`[${key}, ${value}] : log is already exiest in database but not in redis, key added and count updated!`);
                        });
                        res.send(`Hello ${key}, ${value}!`);
                    }
                    // not found in database
                    else{
                        value = 1;
                        RedisStore[key] = value;
                        db.query(insert,[key,value], (err)=>{
                            if(err) throw err;
                            else console.log(`[${key}, ${value}] : log is new for database and redis, added!`);
                        });
                        res.send(`Hello ${key}, ${value}!`)
                    }
                }
            });
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

app.listen(3000, () => {
    console.log(`App is listening at http://localhost:3000`);
});