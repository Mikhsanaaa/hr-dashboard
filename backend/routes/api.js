const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const employeeController = require('../controllers/employeeController');

// Rute Auth
router.post('/login', authController.login);

// Rute Employee
router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/stats', employeeController.getDashboardStats);

router.get('/leaves/stats', employeeController.getLeaveStats);

router.get('/compensation/stats', employeeController.getCompensationStats);

module.exports = router;