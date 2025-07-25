const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const empSchema = require('../../model/employeeSchema');

module.exports = {
    isEmployeeExist: async (email) => {
        let value = false;
        let empData = await empSchema.findOne({
            empEmail: email,
        })
        if (empData) {
            value = true;
        }
        return value;
    },

    validateEmployee: async (email, password = 0) => {
        let value = false;
        let token = ""
        let empData = await empSchema.findOne({
            empEmail: email,
        })
        if (password == 0) {
            if (empData) {
                token = await jwt.sign({ empData }, process.env.SECRET_KEY, {
                    expiresIn: "30m"
                })
            }
        } else {
            if (empData) {
                let hashPassword = await bcrypt.compare(
                    password,
                    empData.empPassword
                );
                if (empData && hashPassword) {
                    token = await jwt.sign({ empData }, process.env.SECRET_KEY, {
                        expiresIn: "1h",
                    });
                    value = true
                }
            }
        }
        return { value, token, empData };
    }
};
