let express = require("express");
require("dotenv").config();
require("./config/modelConfig");
const logger = require("./utils/systemLogger");
const mainRouter = require("./urls");

let app = express();

app.use(express.json());
app.use("/", mainRouter);

const server = app.listen(process.env.PORT, ()=>{
    // console.log(`server is running on port number: ${process.env.PORT}`);
    logger.info(`Server started and is running on http://:${process.env.PORT}`)
});

module.exports = server;