const Task=require('../models/taskSchema');
const {catchAsyncErrors}=require('../middlewares/catchAsyncError');
const {ErrorHandler}=require('../middlewares/error');

module.exports.addTask=catchAsyncErrors(async(req,res,next)=>{
    const {name,priority,isDone,startTime,endTime}=req.body;
    if(!name || !priority || !startTime || !endTime){
        return next(new ErrorHandler("Please fill all the fields",400));
    }
    const task=await Task.create({
        name,
        priority,
        isDone,
        startTime,
        endTime,
        user:req.user._id
    });
    res.status(201).json({
        success:true,
        task,
        message:"Task added successfully"
    })
})

module.exports.getAllTasks=catchAsyncErrors(async(req,res,next)=>{
    // console.log(req);
    const tasks=await Task.find({user:req.user._id});
    if(!tasks || tasks.length===0){
        return next(new ErrorHandler("No tasks found",404));
    }
    res.status(200).json({
        success:true,
        tasks,
        message:"Tasks fetched successfully"
    })
})


module.exports.deleteTask=catchAsyncErrors(async(req,res,next)=>{
    const task=await Task.findByIdAndDelete(req.params.id);
    if(!task){
        return next(new ErrorHandler("Task not found",404));
    }
    res.status(200).json({
        success:true,
        message:"Task deleted successfully"
    })
})


module.exports.deleteMultipleTasks = catchAsyncErrors(async (req, res, next) => {
    const taskIds = req.body.taskIds;

    if (!taskIds || taskIds.length === 0) {
        return next(new ErrorHandler("No task IDs provided", 400));
    }
    const result = await Task.deleteMany({ _id: { $in: taskIds } });

    if (result.deletedCount === 0) {
        return next(new ErrorHandler("No tasks found to delete", 404));
    }

    res.status(200).json({
        success: true,
        message: `${result.deletedCount} task(s) deleted successfully`
    });
});


module.exports.updateTask=catchAsyncErrors(async(req,res,next)=>{
    const task=await Task.findByIdAndUpdate(req.params.id,req.body);
    if(!task){
        return next(new ErrorHandler("Task not found",404));
    }
    res.status(200).json({
        success:true,
        task,
        message:"Task updated successfully"
    })
})


module.exports.getTask=catchAsyncErrors(async(req,res,next)=>{
    const task=await Task.findById(req.params.id);
    if(!task){
        return next(new ErrorHandler("Task not found",404));
    }
    res.status(200).json({
        success:true,
        task,
        message:"Task fetched successfully"
    })
})
