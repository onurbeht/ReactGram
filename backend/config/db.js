const mongoose = require("mongoose");

//connection

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const conn = async () => {
  try {
    const dbConn = await mongoose.connect(
      `mongodb+srv://${dbUser}:${dbPass}@reactgram.pcn3zqy.mongodb.net/?retryWrites=true&w=majority`
    );

    console.log("conectou ao DB!");

    return dbConn;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn;
