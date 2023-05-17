const express = require('express');
const mongoose = require('mongoose');
const route = require('./route/route.js');
const app =express();
app.use(express.json());

mongoose.connect("mongodb+srv://birendrakumar:Kumar123@cluster0.2om9guo.mongodb.net/Assignment", {
    useNewUrlParser: true
})
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err))
app.use('/', route)

app.listen(3000, function () {
    console.log('Express app running on port ' + (3000))
});
