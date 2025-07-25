let express = require("express")
let empRouter = require("./employee_app/routes/employeeRoutes")
let timeSheetRouter = require("./employee_app/routes/timeSheetRoutes")
let leaveRouter = require("./employee_app/routes/empLeaveRoutes")
let adminRouter = require("./adminapp/routes/adminRoutes")
let benchRouter = require("./adminapp/routes/benchRoutes")
let noticeRouter = require("./adminapp/routes/noticeRoutes")

let mainRouter = express.Router();

mainRouter.use("/employee", empRouter)
mainRouter.use("/timesheet", timeSheetRouter)
mainRouter.use("/leave", leaveRouter)
mainRouter.use("/admin", adminRouter)
mainRouter.use("/bench", benchRouter)
mainRouter.use("/notice",noticeRouter)

module.exports = mainRouter
