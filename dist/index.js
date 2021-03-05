"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var dotenv = __importStar(require("dotenv"));
var express_1 = __importDefault(require("express"));
var index_1 = __importDefault(require("./routes/index"));
var account_1 = __importDefault(require("./routes/account"));
var schedule_1 = __importDefault(require("./routes/schedule"));
var app = express_1["default"]();
app.use(express_1["default"].json());
dotenv.config();
var PORT = process.env.PORT;
app.use('/', index_1["default"]);
app.use('/accounts', account_1["default"]);
app.use('/schedules', schedule_1["default"]);
app.use('*', function (req, res, next) {
    var error = new Error('404 Not found');
    error.statusCode = 404;
    next(error);
});
app.use(function (error, req, res) {
    res.status(error.statusCode || 400).send({
        error: error.message || 'Some thing wrong!'
    });
});
app.listen(PORT, function () {
    console.log('Listening in port %d', PORT);
});
//# sourceMappingURL=index.js.map