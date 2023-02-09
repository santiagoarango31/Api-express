const { Router } = require('express')
const router = Router()
const taskController = require('../controllers/tasks.controller')
router.post('/',taskController.createTask)


module.exports = router;