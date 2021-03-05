"use strict";
exports.__esModule = true;
var client_1 = require("@prisma/client");
var prisma;
if (process.env.NODE_ENV === 'production') {
    prisma = new client_1.PrismaClient();
}
else {
    if (!global.prisma) {
        global.prisma = new client_1.PrismaClient();
    }
    prisma = global.prisma;
}
exports["default"] = prisma;
//# sourceMappingURL=client.js.map