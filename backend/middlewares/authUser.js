const empSchema = require("../model/employeeSchema")

module.exports = {
    isAdmin: async (req, res, next) => {
        const empData = await empSchema.findOne({
            empEmail: req.body.empEmail
        })
        if (empData.empRole === "Admin") {
            next();
        } else {
            res.status(404).json({
                success: false,
                message: "User not authorized!!"
            })
        }
    },

    isUser: async (req, res, next) => {
        const empData = await empSchema.findOne({
            empEmail: req.body.empEmail
        })
        if (empData.empRole === "Employee") {
            next();
        } else {
            res.status(404).json({
                success: false,
                message: "User not authorized!!"
            })
        }
    }
}
