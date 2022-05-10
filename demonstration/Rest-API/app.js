const express = require('express');
const app = express();

app.get('/', (req, res)=>{
    let name = req.query['name'];
    if(name){
        res.send(`Hello ${name}!`);
        console.log(`${name}`);
    }
    else{
        console.log("Home");
        res.send("Hello World!");
    }
});

app.listen(3000, () => {
    console.log(`App is listening at http://localhost:3000`);
});