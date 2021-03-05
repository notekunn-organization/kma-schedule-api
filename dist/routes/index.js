"use strict";
exports.__esModule = true;
var express_1 = require("express");
var router = express_1.Router();
router.get('/', function (req, res) {
    res.status(200).send({
        message: 'Hello world!'
    });
});
exports["default"] = router;
//# sourceMappingURL=index.js.map