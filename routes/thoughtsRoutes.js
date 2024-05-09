const express = require("express");
const router = express.Router();

const checkAuth = require("../helpers/auth").checkAuth;

const ThoughtController = require("../controllers/ThoughtsController");

router.get("/add", checkAuth, ThoughtController.createThought);
router.get("/dashboard", checkAuth, ThoughtController.dashboard);
router.get("/", ThoughtController.showThoughts);
router.get("/edit/:id", checkAuth, ThoughtController.editThought);
router.post("/edit", checkAuth, ThoughtController.editThoughtSave);
router.post("/add", checkAuth, ThoughtController.createThoughtPost);
router.post("/remove", checkAuth, ThoughtController.removeThought);

module.exports = router;
