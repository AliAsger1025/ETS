const express = require('express');
const timeSheet = require("../controller/timeSheetController")

let timeSheetRouter = express.Router();

timeSheetRouter.post("/clockin/:id", timeSheet.empClockIn)
timeSheetRouter.patch("/empattendence/:id", timeSheet.empAttendence)

module.exports = timeSheetRouter;
