const User = require("../models/User");
const moment = require("moment");
const { months } = require("moment");
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

  //GET NUMBER OF NEW USERS IN MONTH
  // getNumberOfUsers: async (req, res) => {
  //   const now = moment();
  //    const startOfMonth = moment().startOf('month');

  //   try {
  //     const users = await User.find({ createdAt: {  $lt: now.toDate() } });

  //     res.status(200).json(users);
  //   }
  //   catch (err) {
  //         res.status(500).json(err);
  //       }
  // },

  getNewUsersInMonth: async (req, res) => {
    try {
      // sử dụng thư viện Moment.js để tính toán ngày bắt đầu và ngày kết thúc của tháng hiện tại
      // bằng cách sử dụng phương thức startOf và endOf:
        const startOfMonth = moment().startOf('month');
        const endOfMonth = moment().endOf('month');
        //tạo một mảng các tuần trong tháng bằng cách sử dụng vòng lặp while và phương thức clone của Moment.js:
        const weeksInMonth = [];
        let week = startOfMonth.clone().startOf("week");
        while (week.isBefore(endOfMonth)) {
            weeksInMonth.push({
                start: week.toDate(),
                end: week.clone().endOf("week").toDate(),
                count: 0,
            });
            week.add(1, "week");
        }

        //ử dụng phương thức aggregate của MongoDB để tính toán số lượng người dùng mới trong từng tuần của tháng hiện tại
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
                    count: {
                        $sum: 1,
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
            const weekIndex = moment(item._id.year + '-W' + item._id.week).diff(startOfMonth, 'weeks');
            if (weekIndex >= 0 && weekIndex < weeksInMonth.length) {
                weeksInMonth[weekIndex].count += item.count;
            }
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
};

module.exports = userController;
