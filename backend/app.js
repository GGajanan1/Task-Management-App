const express=require('express');
const app=express();
require('dotenv').config();
const connectDB=require('./database/dbConnection');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const userRouter=require('./router/userRouter');
const taskRouter=require('./router/taskRouter');
const errorMiddleware=require('./middlewares/error');

app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      method: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user',userRouter)
app.use('/api/v1/task',taskRouter)


connectDB();
const port=process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})