const express=require('express');
const router=express.Router();
const {addTask,getAllTasks,deleteTask,updateTask,deleteMultipleTasks,getTask}=require('../controller/taskController');
const {isUserAuthenticated}=require('../middlewares/auth');

router.post('/addTask',isUserAuthenticated,addTask);
router.get('/getAllTasks',isUserAuthenticated,getAllTasks);
router.delete('/deleteTask/:id',deleteTask);
router.patch('/updateTask/:id',isUserAuthenticated,updateTask);
router.get('/getTask/:id',isUserAuthenticated,getTask);
module.exports=router;