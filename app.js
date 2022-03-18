const express = require('express');
const app = express();

app.get('/', (req, res)=>{
    let name = req.query['name'];
    if(name) {
        res.send(`Heloo ${name}!`);
        console.log(`parameter name: ${name}`);
    }
    else {
        res.send("Hello world!");
        console.log("parameter name is empty!");
    }
});

app.listen(3000, ()=>{
    console.log('Server is live at port: ' + 3000);
});