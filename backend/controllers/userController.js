const User = require("../models/User");
const moment = require("moment");

const userController = {
  //GET ALL USER
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET NEW USERS  IN MONTH
  getNewUsersInMonth: async (req, res) => {
    const now = moment();
    const startOfMonth = moment().startOf("month");

    try {
      const users = await User.find({
        createdAt: {
          $gte: startOfMonth.toDate(),
          $lt: now.toDate(),
        },
      });

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // GET NEW USERS PER WEEK IN MONTH
  getNewUsersInPerWeekMonth: async (req, res) => {
    try {
      // sử dụng thư viện Moment.js để tính toán ngày bắt đầu và ngày kết thúc của tháng hiện tại
      // bằng cách sử dụng phương thức startOf và endOf:
      const startOfMonth = moment().startOf("month");
      const endOfMonth = moment().endOf("month");
      //tạo một mảng các tuần trong tháng bằng cách sử dụng vòng lặp while và phương thức clone của Moment.js:
      const weeksInMonth = [];
      let week = startOfMonth.clone().startOf("week");
      while (week.isBefore(endOfMonth)) {
        const options = {  day: 'numeric', month: 'numeric', year: 'numeric' };
        weeksInMonth.push({
          start: week.toDate().toLocaleDateString('vi-VN', options),
          end: week.clone().endOf("week").toDate().toLocaleDateString('vi-VN', options),
          countUser: 0,
          users: [],
        });
        week.add(1, "week");
      }

      //sử dụng phương thức aggregate của MongoDB để tính toán số lượng người dùng mới trong từng tuần của tháng hiện tại
      const userCountByWeek = await User.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startOfMonth.toDate(),
              $lte: endOfMonth.toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              week: {
                $week: "$createdAt",
              },
              year: {
                $year: "$createdAt",
              },
            },
            countUser: {
              $sum: 1,
            },
            users: {
              $push: "$_id",
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.week": 1,
          },
        },
      ]);

      userCountByWeek.forEach((item) => {
        const weekIndex = moment(item._id.year + "-W" + item._id.week).diff(
          startOfMonth,
          "weeks"
        );
        if (weekIndex >= 0 && weekIndex < weeksInMonth.length) {
          if (weekIndex == weeksInMonth.length - 1) {
            weeksInMonth[weekIndex].countUser += item.countUser;
            weeksInMonth[weekIndex].users.push(...item.users);
          } else {
            weeksInMonth[weekIndex + 1].countUser += item.countUser;
            weeksInMonth[weekIndex + 1].users.push(...item.users);
          }
        }
        // weeksInMonth[weekIndex].countUser += item.countUser;
      //   weeksInMonth[weekIndex].users.push(...item.users);
      // }
      });

      res.status(200).json(weeksInMonth);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  //GET USER BY ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A USER
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //UPDATE A USER
  updateUser: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json("User updated");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //search user
  searchUser: async (req, res) =>{
    const { query } = req.query;
    const queryString = String(query); // Chuyển đổi giá trị của query thành chuỗi
    try{
      const user = await User.find({
        $or: [
          { username: { $regex: queryString, $options: "i" } },
          { email: { $regex: queryString, $options: "i" } }
        ]
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
}


module.exports = userController;
