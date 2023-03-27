const mongoose = require("mongoose");
const moment = require('moment');
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 6,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// middleware để sửa đổi định dạng ngày giờ
// userSchema.post("find", function (docs) {
//   docs.forEach((doc) => {
//     const dateStr = doc.createdAt.toISOString(); // ví dụ: "2022-03-27T09:30:00.000Z"
//     const formattedDate = moment(dateStr).format("DD/MM/YYYY"); // ví dụ: "27/03/2022 16:30:00"

//     doc.createdAt = formattedDate;
//     doc.updatedAt = doc.updatedAt.toISOString();
//   });
// });
module.exports = mongoose.model("User", userSchema);
