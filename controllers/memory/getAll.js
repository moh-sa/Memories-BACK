import { memoryModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";
import { imgConfig } from "../../configs/index.js";

export default async function (req, res) {
  const { page } = req.query;

  const LIMIT = 8;
  const startIndex = (parseInt(page) - 1) * LIMIT;
  let memories = [];
  let numberOfMemories = 1;

  try {
    numberOfMemories = await memoryModel.countDocuments();
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      statusCode: 503,
      from: "controllers/memory/getAll 1",
      message: "Something went wrong. Please try again.",
    });
  }

  try {
    memories = await memoryModel
      .find()
      .sort({ _id: -1 })
      .skip(startIndex)
      .limit(LIMIT)
      .populate("author", "username avatar")
      .lean();

    memories.map(
      (memory) =>
        (memory.coverURL = helpers.genImageURL(
          memory.cover,
          imgConfig.cover.small
        ))
    );

    memories.map(
      (memory) =>
        (memory.author.avatarURL = helpers.genImageURL(
          memory.author.avatar,
          imgConfig.avatar
        ))
    );

    return res.status(200).json({
      statusCode: 200,
      from: "controllers/memory/getAll 2",
      data: {
        memories,
        numberOfPages: Math.ceil(numberOfMemories / LIMIT),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      statusCode: 503,
      from: "controllers/memory/getAll 3",
      message: "Something went wrong. Please try again.",
    });
  }
}
