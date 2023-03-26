const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(cors());
dotenv.config();
connectDB();

//5.8.11

app.use(express.json());

const __dirname1 = path.resolve();

app.get("/",(req,res)=>{
  res.send("welcome to my API");
})

app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;



const server = app.listen(
  PORT,
  console.log(`Server running on Port ${PORT}`.yellow.bold)
);

const io = require("socket.io")(server,{
  pingTimeout:6000,
  cors:{
    origin:"*"
  }
});

io.on("connection",(socket)=>{
    console.log("Connected to Socket");
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        console.log(userData.name);
        socket.emit("connected");
    })
    socket.on("join chat",(room)=>{
      socket.join(room);
      console.log("User Joined Room",room);
    });

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageReceived)=>{
      var chat = newMessageReceived.chat;
      if(!chat.users) return console.log("chat.users not defined");
       chat.users.forEach(user =>{
        if(user._id == newMessageReceived.sender._id) return;
        socket.in(user._id).emit("message received",newMessageReceived);
       })
    });

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
})
