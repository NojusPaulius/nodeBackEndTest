const express = require("express");

const router = express.Router();
const fs = require("fs");

const masterController = require("./../controllers/masterController")
const authController = require("../controllers/authController")
// const reviewRouter = require("./reviewRoutes")

// router.use(authController.protect)

router.use(authController.protect);

router
.route('/')
.get(authController.restrictTo("user"),masterController.getAllMasters)
// (authController.restrictTo("user"),

.post(masterController.createMaster)

router
.route('/:id')
.get(masterController.getMasterById)
.patch(masterController.updateMaster)
.delete(masterController.deleteMaster)

// router.use("/:hotelId/reviews", reviewRouter)

module.exports = router;