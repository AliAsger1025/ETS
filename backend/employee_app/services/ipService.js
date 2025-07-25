const ip = require("ip")

module.exports = {
    ipAddress: async (clockInIp) => {
        const empClockInIp = ip.address();
        return { empClockInIp }
    }
}
