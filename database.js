const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_LOCALHOST);
    console.log("MongoDB Connected Successfuly...");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
