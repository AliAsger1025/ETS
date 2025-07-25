const mongoose = require('mongoose');
const logger = require("../utils/systemLogger");

mongoose.connect(process.env.URL, {
    useNewUrlParser: 'true',
});

mongoose.connection.on("connected", (err, res) => {
    // console.log("Mongoose is connected")
    logger.log('info', "Mongoose is connected")
});

mongoose.connection.on("error", (err) => {
    // console.log("Mongoose connection error", err)
    logger.log('error', "Mongoose connection error")
});