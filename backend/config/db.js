const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  console.log("MONGO URL HERE", process.env.MONGO_URI);
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://tushargahlaut:123@cluster0.q8zcg.mongodb.net/chatAPP?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
