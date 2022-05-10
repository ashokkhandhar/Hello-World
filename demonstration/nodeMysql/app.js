const express = require('express');
const app = express();
const mysql = require('mysql');

// Create mysql connection
const db = mysql.createConnection({
    host: 'localhost',
    // host: 'mysql_server',
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
    let name = req.query['name'];
    if(name){
        db.query(getlogs,[name], (err, result) => {
            if (err) throw err;
            else{
                res.send(`Hello ${name}!`);
                console.log(`parameter name = ${name} passed..!`);
                if (result.length>0) {
                    db.query(update, [name], (err) => {
                        if (err) throw err;
                        else {
                            console.log(result);
                            console.log(`${name} is already exiest, count updated..!`);
                        }
                    });
                }
                else {
                    db.query(insert, [name, 1], (err) => {
                        if (err) throw err;
                        else {
                            console.log(result);
                            console.log(`${name} is new, added to database..!`);
                        }
                    });
                }
            }
        }); 
    }
    else{
        if(name==undefined) {
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