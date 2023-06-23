const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
var cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/error')

require("dotenv").config();

//  IMPORT ROUTES
const authRoutes = require('./routes/authRoutes');
const postRoute = require('./routes/postRoute');

// DATABASE
mongoose.connect(process.env.DATABASE)
    .then(() => console.log("Db Connected!"))
    .catch((err) => console.log(err));

// MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({
    limit: '5mb',
    extended: true
}));
app.use(cookieParser());
app.use(cors());

// ROUTES MIDDLEWARE
app.use('/api', authRoutes);
app.use('/api', postRoute);

// ERROR MIDDLEWARE
app.use(errorHandler);

// PORT
const port = process.env.port || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})