const empLeaveSchema = require("../../model/empLeaveSchema");

module.exports = {
    empLeave: async (req, res) => {
        const empId = req.params.id;
        const leaveData = new empLeaveSchema(req.body);
        try {
            leaveData.empId = empId
            await leaveData.save();
            if (leaveData.leaveType === "Casual leave") {
                res.status(200).json({
                    success: true,
                    message: "Appliyed for casual leave",
                    LeaveInfo: leaveData
                })
            } else if (leaveData.leaveType === "Sick leave") {
                res.status(200).json({
                    success: true,
                    message: "Appliyed for sick leave",
                    leaveInfo: leaveData
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: "Appliyed for other leave",
                    leaveInfo: leaveData
                })
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error!",
                error: error.message,
            });
        }
    }
}
