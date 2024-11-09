const mongoose = require("mongoose");

const AdminQuestionSchema = mongoose.Schema(
  {
    adminName: { type: String, unique: true },

    password: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("adminLogin", AdminQuestionSchema);
