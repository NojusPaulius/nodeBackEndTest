const express = require("express");

const router = express.Router();
const fs = require("fs");

const serviceController = require("./../controllers/serviceController")
const authController = require("../controllers/authController")

router.use(authController.protect);

router
.route('/')
.get(authController.restrictTo("user"),serviceController.getAllServices)
.post(serviceController.createService)

router
.route('/:id')
.get(serviceController.getServiceById)
.patch(serviceController.updateService)
.delete(serviceController.deleteService)

module.exports = router;
