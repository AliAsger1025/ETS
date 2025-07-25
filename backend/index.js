let express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/modelConfig");
const logger = require("./utils/systemLogger");
const mainRouter = require("./urls");

let app = express();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5001",
    "https://ets-aliasger1025s-projects.vercel.app",
    "https://ets-aliasger1025s-projects.vercel.app/"
  ],
  credentials: true,
  optionSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/", mainRouter);

const server = app.listen(process.env.PORT, ()=>{
    // console.log(`server is running on port number: ${process.env.PORT}`);
    logger.info(`Server started and is running on http://:${process.env.PORT}`)
});

module.exports = server;