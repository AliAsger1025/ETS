const express = require('express');
const empLeave = require("../controller/empLeaveController")

let leaveRouter = express.Router();

leaveRouter.post("/leaveapply/:id", empLeave.empLeave);

module.exports = leaveRouter;
    