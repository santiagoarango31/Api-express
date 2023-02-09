const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/crud-tasks')
    .then((db)=>console.log("connect to database"))
    .catch((err)=>console.log(err))