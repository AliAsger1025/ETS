const moment = require("moment");
const empTimeSheetSchema = require("../../model/empTimeSheetSchema");
const ipService = require("../services/ipService");
const logger = require("../../utils/timeSheetLogger")

module.exports = {
    empClockIn: async (req, res) => {
        try {
            const employeeId = await req.params.id;
            const { empClockInIp } = await ipService.ipAddress(req.body.clockInIp)
            const empData = new empTimeSheetSchema(req.body);
            empData.empClockIn = moment().format('YYYY-MM-DD HH:mm:ss');
            empData.empId = employeeId;
            empData.empClockInIp = empClockInIp;
            const attendenceTime = moment('10:15:00', 'HH:mm:ss');
            const clockIn = moment(empData.empClockIn, 'YYYY-MM-DD HH:mm:ss')
            if (clockIn.isAfter(attendenceTime)) {
                empData.empDaysLate = "You are late!!"
            }
            await empData.save();
            logger.log("info", "Clock in successful")
            res.status(200).json({
                success: true,
                message: "Clock in successful",
                info: empData
            });
        } catch (err) {
            logger.log("error", `${err.message}`);
            res.status(500).json({
                success: false,
                message: `Error occured ${err.message}`
            });
        }
    },

    empAttendence: async (req, res) => {
        try {
            const timeSheetId = req.params.id;
            const clockOutTime = await empTimeSheetSchema.findByIdAndUpdate(
                timeSheetId,
                { empClockOut: moment().format('YYYY-MM-DD HH:mm:ss') },
                { new: true }
            );
            const clockIn = moment(clockOutTime.empClockIn, 'YYYY-MM-DD HH:mm:ss');
            const clockOut = moment(clockOutTime.empClockOut, 'YYYY-MM-DD HH:mm:ss');
            let hoursWorked = clockOut.diff(clockIn, 'hours');
            if (hoursWorked >= 8) {
                clockOutTime.empStatus = "present";
            }
            else if (hoursWorked < 8) {
                clockOutTime.empStatus = "half day"
            } else {
                clockOutTime.empStatus = "absent"
            }
            clockOutTime.empHoursLogged = hoursWorked
            logger.log("info", "Clock out successful")
            res.status(200).json({
                success: true,
                message: "Clock out successful",
                info: clockOutTime
            });
        } catch (error) {
            logger.info('error', `${error.message}`);
            res.status(500).send({
                success: false,
                message: "Error!",
                error: error.message
            });
        }
    },
};
