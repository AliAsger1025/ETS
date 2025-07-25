const joi = require("joi")
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);


const employeeValSchema = {
    registerEmployee: joi.object({
        empName: joi
            .string()
            .min(3)
            .max(20)
            .message({
                "string.min": "{#label} should contain at least {#limit} characters",
                "string.max": "{#label} should contain at least {#limit} characters",
            })
            .required(),
        empPassword: joiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(3)
            .minOfUppercase(1)
            .minOfNumeric(3)
            .noWhiteSpaces()
            .onlyLatinCharacters()
            .messages({
                'password.minOfUppercase': '{#label} should contain at least {#min} uppercase character',
                'password.minOfSpecialCharacters':
                    '{#label} should contain at least {#min} special character',
                'password.minOfLowercase': '{#label} should contain at least {#min} lowercase character',
                'password.minOfNumeric': '{#label} should contain at least {#min} numeric character',
                'password.noWhiteSpaces': '{#label} should not contain white spaces',
                'password.onlyLatinCharacters': '{#label} should contain only latin characters',
            }),
        empEmail: joi
            .string()
            .email()
            .required(),
        empCity: joi
            .string()
            .required(),
        empAddress: joi
            .string(),
        empGender: joi
            .string()
            .valid('Male', 'Female')
            .required(),
        empPhoneNo: joi
            .number()
            .integer()
            .min(1000000000)
            .max(9999999999)
            .message("Invalid phone number")
            .required(),
        empWorkingStatus: joi
            .string()
            .required(),
        empTechnologies: joi
            .string()
            .required(),
        empRole: joi
            .string()
            .valid('Admin', 'Employee')
            .required(),
    }),

    employeeLogin: joi.object({
        empEmail: joi
            .string()
            .email()
            .required(),
        empPassword: joiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(3)
            .minOfUppercase(1)
            .minOfNumeric(3)
            .noWhiteSpaces()
            .onlyLatinCharacters()
            .messages({
                'password.minOfUppercase': '{#label} should contain at least {#min} uppercase character',
                'password.minOfSpecialCharacters':
                    '{#label} should contain at least {#min} special character',
                'password.minOfLowercase': '{#label} should contain at least {#min} lowercase character',
                'password.minOfNumeric': '{#label} should contain at least {#min} numeric character',
                'password.noWhiteSpaces': '{#label} should not contain white spaces',
                'password.onlyLatinCharacters': '{#label} should contain only latin characters',
            }),
    }),
    resetPassword: joi.object({
        newPassword: joiPassword
            .string()
            .minOfSpecialCharacters(1)
            .minOfLowercase(3)
            .minOfUppercase(1)
            .minOfNumeric(3)
            .noWhiteSpaces()
            .onlyLatinCharacters()
            .messages({
                'password.minOfUppercase': '{#label} should contain at least {#min} uppercase character',
                'password.minOfSpecialCharacters':
                    '{#label} should contain at least {#min} special character',
                'password.minOfLowercase': '{#label} should contain at least {#min} lowercase character',
                'password.minOfNumeric': '{#label} should contain at least {#min} numeric character',
                'password.noWhiteSpaces': '{#label} should not contain white spaces',
                'password.onlyLatinCharacters': '{#label} should contain only latin characters',
            }),
        confirmPassword: joiPassword
            .string()
            .required(),
    }).unknown(true),
}

module.exports = employeeValSchema;