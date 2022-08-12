import { memoryModel } from "../../models/index.js";
import { helpers } from "../../utils/index.js";

export default async function fetchRecommendations(req, res) {
  const { _id } = req.params;

  //TODO: convert this to middleware
  // if (!mongoose.Types.ObjectId.isValid(_id)) {
  //   return res.status(404).send("No Post with that ID was found.");
  // }

  try {
    const memory = await memoryModel.findById(_id).lean();

    const data = await memoryModel
      .aggregate([
        { $match: { tags: { $in: memory.tags } } },
        { $sample: { size: 5 } },
      ])
      .then((res) => {
        //removing the requested memory from the array
        const memoryData = res.filter(
          (memory) => memory._id.toString() !== _id
        );

        //replacing the coverID with coverURL
        memoryData.map(
          (memory) =>
            (memory.cover = helpers.genImageURL(
              memory.cover,
              "c_fill,w_512,h_512,g_auto/q_auto:best/dpr_auto"
            ))
        );

        return memoryData;
      });

    await memoryModel.populate(data, { path: "author", select: "username" });

    return res.status(200).json({
      statusCode: 200,
      from: "conrollers/memory/recommendations 1",
      data: {
        recommendations: data,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      statusCode: 503,
      from: "controllers/memory/recommendations 2",
      message: error.message,
    });
  }
}
