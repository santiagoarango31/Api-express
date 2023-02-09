const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.set('port',process.env.PORT || 3000);

app.use(cors({
    origin:"http://localhost:*",
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/encode",require('./routes/tasks.routes'));

module.exports = app;