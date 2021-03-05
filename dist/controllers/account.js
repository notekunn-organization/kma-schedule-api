"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var client_1 = __importDefault(require("../client"));
var qldt_kma_1 = require("@notekunn/qldt-kma");
var AccountController = /** @class */ (function () {
    function AccountController() {
    }
    AccountController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, studentCode, password, qldt, isLogin, cookie, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, studentCode = _a.studentCode, password = _a.password;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!studentCode || !password)
                            throw new Error('Please input student code and password');
                        qldt = new qldt_kma_1.Client();
                        return [4 /*yield*/, qldt.login(studentCode, password, true)];
                    case 2:
                        isLogin = _b.sent();
                        if (!isLogin)
                            throw new Error('Student code or password not correct');
                        cookie = qldt.getCookie();
                        return [4 /*yield*/, client_1["default"].account.upsert({
                                create: {
                                    studentCode: studentCode,
                                    password: password,
                                    cookie: cookie
                                },
                                update: {
                                    password: password,
                                    cookie: cookie
                                },
                                where: {
                                    studentCode: studentCode
                                }
                            })];
                    case 3:
                        _b.sent();
                        res.send({
                            message: 'Login success!'
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        res.status(error_1.statusCode || 400).send({
                            error: error_1.message || 'Some thing wrong!'
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AccountController.prototype.validateAccount = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var studentCode, qldt, account, loginCookie, loginAccount, _a, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        studentCode = req.body.studentCode;
                        qldt = new qldt_kma_1.Client();
                        return [4 /*yield*/, client_1["default"].account.findUnique({
                                where: {
                                    studentCode: studentCode
                                }
                            })];
                    case 1:
                        account = _b.sent();
                        if (!account || !account.password)
                            throw new Error('Please login to system');
                        req.data = account;
                        return [4 /*yield*/, qldt.login(account.cookie)];
                    case 2:
                        loginCookie = _b.sent();
                        if (loginCookie)
                            return [2 /*return*/, next()];
                        return [4 /*yield*/, qldt.login(account.studentCode, account.password)];
                    case 3:
                        loginAccount = _b.sent();
                        if (!loginAccount) return [3 /*break*/, 5];
                        _a = req;
                        return [4 /*yield*/, client_1["default"].account.update({
                                where: {
                                    studentCode: studentCode
                                },
                                data: {
                                    cookie: qldt.getCookie()
                                }
                            })];
                    case 4:
                        _a.data = _b.sent();
                        return [2 /*return*/, next()];
                    case 5: return [4 /*yield*/, client_1["default"].account.update({
                            where: {
                                studentCode: studentCode
                            },
                            data: {
                                password: '',
                                cookie: ''
                            }
                        })];
                    case 6:
                        _b.sent();
                        throw new Error('Password is not correct');
                    case 7:
                        error_2 = _b.sent();
                        res.status(400).send({
                            error: error_2.message
                        });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return AccountController;
}());
exports["default"] = AccountController;
//# sourceMappingURL=account.js.map