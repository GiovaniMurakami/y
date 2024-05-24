const express = require("express");
const router = express.Router();

const checkAuth = require("../helpers/auth").checkAuth;

const YController = require("../controllers/YsController");

router.get("/add", checkAuth, YController.createY);
router.get("/dashboard", checkAuth, YController.dashboard);
router.get("/", YController.showYs);
router.get("/edit/:id", checkAuth, YController.editY);
router.post("/edit", checkAuth, YController.editYSave);
router.post("/add", checkAuth, YController.createYPost);
router.post("/remove", checkAuth, YController.removeY);

module.exports = router;
