"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var account_1 = __importDefault(require("../controllers/account"));
var router = express_1.Router();
var controller = new account_1["default"]();
router.get('/', function (req, res, next) {
    res.status(403).send({
        error: "You don't allowed to visit here"
    });
});
router.post('/login', controller.login);
exports["default"] = router;
//# sourceMappingURL=account.js.map