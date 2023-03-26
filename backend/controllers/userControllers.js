const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");


const allUsers = asyncHandler(async(req,res)=>{
    const keyword = req.query.search ? {
      $or:[
        {name: {$regex:req.query.search, $options:"i"}},
        {email: {$regex:req.query.search, $options:"i"}}
      ]
    }:{};
    try {
     const users = await User.find(keyword).find({
       _id: { $ne: req.user._id },
     });
          res.status(200).json(users);
    } catch (error) {
      console.log(error)
    }

});


const registerUser = asyncHandler(async (req,res) => {
    const {name,email,password,pic} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter All Fields");
    }

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
        name,email,password:hashedPassword,pic
    });
    if(user){
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          pic: user.pic,
          token: generateToken(user._id),
        });
    }
    else{
        res.status(400);
        throw new Error("Failed to Create User");
    }
});


const authUser = asyncHandler(async (req,res)=>{
        const {email,password} = req.body;

        try {
            const oldUser = await User.findOne({ email });
            if (!oldUser) {
              res.status(404).json({ message: "User Not Found" });
            }
            const isPasswordCorrect = await bcrypt.compare(
              password,
              oldUser.password
            );
            if (!isPasswordCorrect)
              return res.status(400).json({ message: "Invalid credentials" });
            else {
              res.json({
                _id: oldUser._id,
                name: oldUser.name,
                email: oldUser.email,
                isAdmin: oldUser.isAdmin,
                pic: oldUser.pic,
                token: generateToken(oldUser._id),
              });
            }    
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
            console.log(error);
        }

        
          
        
} );

module.exports = {registerUser, authUser, allUsers};