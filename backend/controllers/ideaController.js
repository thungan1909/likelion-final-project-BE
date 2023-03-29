const Idea = require("../models/Idea");
const moment = require("moment");
const ideaController = {
  //Get All Idea
  getAllIdeas: async (req, res) => {
    try {
      const idea = await Idea.find();
      res.status(200).json(idea);
    } catch (err) {
      res.status(500).json(err);
    }
  },

   // GET NEW IDEAS PER WEEK IN MONTH
   getNewIdeasInPerWeekMonth: async (req, res) => {
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
          countIdea: 0,
          ideas: [],
        });
        week.add(1, "week");
      }

      // sử dụng phương thức aggregate của MongoDB để tính toán số lượng người dùng mới trong từng tuần của tháng hiện tại
      const ideaCountByWeek = await Idea.aggregate([
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
            countIdea: {
              $sum: 1,
            },
            ideas: {
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

      ideaCountByWeek.forEach((item) => {
        const weekIndex = moment(item._id.year + "-W" + item._id.week).diff(
          startOfMonth,
          "weeks"
        );
        if (weekIndex >= 0 && weekIndex < weeksInMonth.length) {
          if (weekIndex == weeksInMonth.length - 1) {
            weeksInMonth[weekIndex].countIdea += item.countIdea;
            weeksInMonth[weekIndex].ideas.push(...item.ideas);
          } else {
            weeksInMonth[weekIndex + 1].countIdea += item.countIdea;
            weeksInMonth[weekIndex + 1].ideas.push(...item.ideas);
          }
        }
      });

      res.status(200).json(weeksInMonth);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  //create idea
  createIdea: async (req, res) => {
    try {
      //create idea
      const newIdea = await new Idea({
        userId: req.body.userId,
        content: req.body.content,
      });
      //save idea to db
      const idea = await newIdea.save();
      res.status(200).json(idea);
    } catch (err) {
      res.status(500).json(err);
    }
  },
    //Get Idea By ID
    getIdeaById: async (req, res) => {
      try {
        const idea = await Idea.findById(req.params.id);
        res.status(200).json(idea);
      } catch (err) {
        res.status(500).json(err);
      }
    },
  
};
module.exports = ideaController;
