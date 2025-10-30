const Message = require("../../model/Message");
const Match = require("../../model/Match");

const jwt = require("jsonwebtoken");

exports.getMessages = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const matches = await Match.find({
      userIds: { $in: [loggedInUserId] },
    });
    const matchIds = matches.map((match) => match._id);
    const messages = await Message.find({
      matchId: { $in: matchIds },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
