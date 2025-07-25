const bcrypt = require('bcrypt');
const path = require("path");
const jwt = require("jsonwebtoken");

const logger = require("../../utils/empLogger")
const employeeSchema = require("../../model/employeeSchema");
const { transporter } = require("../../services/sendMail");
const authService = require("../services/authService");
const { mailOptions } = require("../../services/sendMail")


module.exports = {
  createEmployee: async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const employeeData = new employeeSchema(req.body);
    try {
      let isEmployeeExist = await authService.isEmployeeExist(req.body.empEmail);
      if (isEmployeeExist) {
        logger.log("error", "User is already registered with this email!");
        res.status(409).json({
          success: false,
          message: "User already exists with the same email!!"
        })
      }
      else {
        if (employeeData.empGender === "Male") {
          const filePath = path.join(__dirname, '..', 'uploads/male.png')
          employeeData.empProfilePic = filePath;
        } else {
          const filePath = path.join(__dirname, '..', 'uploads/female.png')
          employeeData.empProfilePic = filePath;
        }
        employeeData.empPassword = await bcrypt.hash(req.body.empPassword, salt);
        const employee = await employeeData.save();
        logger.log("info", "Employee successfully registered.");
        res.status(201).json({
          success: true,
          message: "Employee successfully registered.",
          employee: employee,
        });
      }
    } catch (err) {
      res.status(500).json({
        sucess: false,
        message: `Error occured ${err.message}`
      });
    }
  },

  employeeLogin: async (req, res) => {
    const { empEmail, empPassword } = req.body;
    try {
      let { value, token, empData } = await authService.validateEmployee(empEmail, empPassword);
      if (value) {
        logger.log("info", "User login successfull ");
        res.status(200).json({
          success: true,
          message: "User Login successfull.",
          accessToken: token,
          userId: empData._id
        })
      } else {
        logger.log("error", "Enter valid email or password!!")
        res.status(401).json({
          success: false,
          message: "Enter valid email or password",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error occur ${error.message}`,
      });
    }
  },

  sendMailToResetPass: async (req, res) => {
    const { empEmail } = req.body;
    try {
      let { generatedToken, empData } = await authService.validateEmployee(empEmail);
      if (empData) {
        const resetLink = `http://127.0.0.1:3000/employee/resetPassword/${empData._id}/${generatedToken}`;
        await mailOptions(empEmail, "reset password", resetLink)
        logger.log('info', "Email Sent Successfully ❤")
        res.status(201).json({
          success: true,
          message: "Email Sent Successfully ❤",
          token: generatedToken,
          userID: empData._id
        });
      } else {
        logger.log('error', "Invalid credentials")
        res.status(403).json({
          success: false,
          message: "Invalid credentials"
        });
      }
    } catch (error) {
      logger.log('error', `Error: ${error}`)
      res.status(500).json({
        success: false,
        message: `Error occur ${error.message}`,
      });
    }
  },


  forgetPasswordReset: async (req, res) => {
    const { id, token } = req.params;
    let { newPassword, confirmPassword } = req.body;
    try {
      const checkEmployee = await employeeSchema.findById(id);
      if (checkEmployee != null) {
        const secret = checkEmployee._id + process.env.SECRET_KEY;
        jwt.verify(token, secret);
        if (newPassword === confirmPassword) {
          const salt = await bcrypt.genSalt(10);
          const bcryptPassword = await bcrypt.hash(confirmPassword, salt);
          await employeeSchema.findByIdAndUpdate(checkEmployee._id, {
            $set: { empPassword: bcryptPassword },
          });
          logger.log("info", "Password updated successfully ")
          res.status(200).json({
            success: true,
            message: "Password updated successfully ✔",
          });
        } else {
          logger.log("error", "Password and confirm password do not match!!")
          res.status(400).json({
            success: false,
            error: "Password and confirm password do not match!!"
          });
        }
      } else {
        logger.log("error", "Employee not found!!")
        res.status(404).json({
          success: false,
          error: "Employee not found!!",
        });
      }
    } catch (err) {
      logger.log("error", err.message);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    const { id, token } = req.params;
    let { oldPassword, newPassword, confirmPassword } = req.body;
    try {
      let checkEmployee = await employeeSchema.findById(id)
      let hashPassword = await bcrypt.compare(
        oldPassword,
        checkEmployee.empPassword
      );
      if (hashPassword) {
        if (newPassword === confirmPassword) {
          const salt = await bcrypt.genSalt(10);
          const bcryptPassword = await bcrypt.hash(confirmPassword, salt);
          await employeeSchema.findByIdAndUpdate(checkEmployee._id, {
            $set: { empPassword: bcryptPassword },
          });
          logger.log("info", "Password updated successfully ")
          res.status(200).json({
            success: true,
            message: "Password updated successfully ✔",
          });
        } else {
          logger.log("error", "Password and confirm password do not match!!")
          res.status(400).json({
            success: false,
            error: "Password and confirm password do not match!!"
          });
        }
      } else {
        logger.log("error", "Old password do not match!!")
        res.status(400).json({
          success: false,
          error: "Old password do not match!!!"
        });
      }
    } catch (err) {
      logger.log("error", err.message);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  updateEmpData: async (req, res) => {
    try {
      const employeeId = req.params.id;
      const employeeAddress = req.body.empAddress;
      let newTechnologies = req.body.empTechnologies ? `${req.body.empTechnologies}` : undefined;
      let newPhoneNo = req.body.empPhoneNo ? `${req.body.empPhoneNo}` : undefined;
      let newCity = req.body.empCity ? `${req.body.empCity}` : undefined;
      const newProfilePic = req.file ? `/uploads/employeeProfilePic${req.file.filename}` : undefined;
      const updatedEmployee = await employeeSchema.findByIdAndUpdate(
        employeeId,
        {
          empProfilePic: newProfilePic,
          empAddress: employeeAddress,
          empTechnologies: newTechnologies,
          empPhoneNo: newPhoneNo,
          empCity: newCity,
        },
        { new: true }
      );

      if (!updatedEmployee) {
        logger.log("error", "Employee not found");
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      } else {
        logger.log("info", "User data updated successfully");
        res.status(200).json({
          success: true,
          message: "User data updated successfully ✔",
          user: updatedEmployee
        });
      }
    } catch (err) {
      logger.log("error", err.message);
      res.status(500).json({
        success: false,

      });
    }
  },
}
