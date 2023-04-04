const Idea = require("../models/Idea");
const moment = require("moment");
const User = require("../models/User");
const mongoose = require("mongoose");
const ideaController = {
  //CREATE IDEA
  createIdea: async (req, res) => {
    const { content, author } = req.body;
    // Kiểm tra xem content có rỗng hay không
    if (!content) {
      return res.status(400).json("Content is required");
    }
    try {
      //create idea
      const newIdea = await new Idea({
        content,
        author,
      });
      //save idea to db
      const idea = await newIdea.save();
      res.status(200).json(idea);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Get All Idea
  getAllIdeas: async (req, res) => {
    try {
      const ideas = await Idea.find();
      if (!ideas) {
        return res.status(404).send({
          message: "No ideas found",
        });
      }
      res.status(200).json(ideas);
    } catch (err) {
      res.status(500).json(err);
    }
  },
    //GetIdeaByUserID
    getAllIdeasByAuthor: async (req, res) => {
      console.log(req.params.id);
      const authorId = req.params.id;
      // Chuyển đổi authorId sang ObjectId
      const authorObjectId = mongoose.Types.ObjectId(authorId);
      try {
        const ideas = await Idea.find({ author: authorObjectId });
        if (!ideas) {
          return res.status(404).json("Idea not found");
        }
        res.status(200).json(ideas);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },


  // GET NEW IDEA IN MONTH
  getNewIdeasInMonth: async (req, res) => {
    const now = moment();
    const startOfMonth = moment().startOf("month");

    try {
      const ideas = await Idea.find({
        createdAt: {
          $gte: startOfMonth.toDate(),
          $lt: now.toDate(),
        },
      });

      res.status(200).json(ideas);
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
        const options = { day: "numeric", month: "numeric", year: "numeric" };
        weeksInMonth.push({
          start: week.toDate().toLocaleDateString("vi-VN", options),
          end: week
            .clone()
            .endOf("week")
            .toDate()
            .toLocaleDateString("vi-VN", options),
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


  //endpoint API to get idea by idea id
  getIdeaById: async (req, res) => {
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) {
        return res.status(404).json("Idea not found");
      }
      res.status(200).json(idea);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //endpoint like idea
  likeIdeaByIdeaId: async (req, res) => {
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) {
        return res.status(404).json("Idea not found");
      }
      if ( idea.likedBy.includes(req.body.userId)) {
        return res.status(400).json("Idea already liked");
      }
      idea.likedBy.push(req.body.userId);
      idea.countLike += 1;
      await idea.save();

      const user = await User.findById(req.body.userId);
      if (!user.likedIdeas.includes(idea._id))
      {
        user.likedIdeas.push(idea._id);
        await user.save();
      }
      res.status(200).json(idea);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  //endpoint unlike/dislike idea
  unlikeIdeaByIdeaId: async (req, res) => {
    try {
      const idea = await Idea.findById(req.params.id);
      if (!idea) {
        return res.status(404).json("Idea not found");
      }
      if (!idea.likedBy.includes(req.body.userId)) {
        return res.status(400).json("Idea not liked by user");
      }
      // const currentVersion = idea.__v; // Lấy phiên bản hiện tại
      idea.likedBy = idea.likedBy.filter((id) => id.toString() != req.body.userId);
      idea.countLike -= 1;

      const updatedIdea = await Idea.findOneAndUpdate(
        { _id: req.params.id },
        { likedBy: idea.likedBy, countLike: idea.countLike },
        { new: true, upsert: true }
      );
      const user = await User.findById(req.body.userId);
      if (user.likedIdeas.includes(idea._id)) {
        user.likedIdeas = user.likedIdeas.filter((id) => id.toString() != idea._id.toString());
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.body.userId},
        { likedIdeas: user.likedIdeas },
        { new: true, upsert: true }
      );
      res.status(200).json(updatedIdea);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

 
};
module.exports = ideaController;
