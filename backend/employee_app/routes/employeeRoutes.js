const express = require('express');
const employee = require("../controller/employeeController");
const notice = require("../controller/notificationController")
const { registerEmployeeVal, loginEmployeeVal, resetPasswordVal } =
    require('../../authValidations/empDatavalidate');
const authToken = require('../../middlewares/authToken');
const { employeeUpload } = require('../../middlewares/imageStorage');
const authService = require('../../middlewares/authUser');

let employeeRouter = express.Router();

employeeRouter.post("/create", registerEmployeeVal, employee.createEmployee);
employeeRouter.post("/login", authService.isUser, loginEmployeeVal, employee.employeeLogin);
employeeRouter.post("/sendmail", employee.sendMailToResetPass);
employeeRouter.patch("/forgetpassword/:id/:token", resetPasswordVal,
    employee.forgetPasswordReset);
employeeRouter.patch("/resetpassword/:id/:token", resetPasswordVal, employee.resetPassword);
employeeRouter.patch("/updateempdata/:id", employeeUpload.single("empProfilePic"), employee.updateEmpData);
employeeRouter.get("/empnotice", notice.showNotification);

module.exports = employeeRouter;
