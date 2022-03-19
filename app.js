const express = require('express');
const mysql = require('mysql');

// Create connection
const db = mysql.createConnection({
    host: 'mysql_server',
    user: 'root',
    password: '',
    database: 'records',
    table: 'logs'
});

// Connect
db.connect((err) => {
    if (err) throw err;
    else console.log('MySql Connected..!');
});

// create database
const database = 'CREATE DATABASE IF NOT EXISTS records';
db.query(database, (err)=>{
    if(err) console.log(err);
    else console.log("Database created Successfully..!");
});

// create table
const table = 'CREATE TABLE IF NOT EXISTS logs(id int AUTO_INCREMENT, name VARCHAR(50), count int, PRIMARY KEY(id))';
db.query(table, (err)=>{
    if(err) console.log(err);
    else console.log("Table created Successfully..!");
});

const app = express();

app.get('/', (req, res) => {
    let name = req.query['name'];
    if(name){
        res.send(`Hello ${name}!`);
        const insert = 'INSERT INTO logs(name,count) values (?,?)';
        const update = 'update logs set count = count+1 where name=?';
        const getlogs = 'SELECT * FROM logs WHERE name = ?';
        // check wether it already exeiest or not
        db.query(getlogs,[name], (err, result) => {
            if (err) throw err;
            else{
                console.log(`parameter name = ${name} passed..!`);
                if (result.length>0) {
                    db.query(update, [name], (err) => {
                        if (err) throw err;
                        else {
                            console.log(result);
                            console.log(`${name} is already exiest, count updated..!`)
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
    else {
        res.send("Hello world!");
        console.log("parameter name is empty..!");
    }
});

app.listen(3000, () => {
    console.log('Server is live at port: ' + 3000);
});