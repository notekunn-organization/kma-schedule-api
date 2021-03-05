"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var account_1 = __importDefault(require("../controllers/account"));
var schedule_1 = __importDefault(require("../controllers/schedule"));
var router = express_1.Router();
var controller = new schedule_1["default"]();
var accountController = new account_1["default"]();
router.post('/semesters', accountController.validateAccount, controller.showSemesters);
router.post('/save', accountController.validateAccount, controller.saveSchedule);
router.post('/search', controller.searchSchedule.bind(controller));
exports["default"] = router;
//# sourceMappingURL=schedule.js.map