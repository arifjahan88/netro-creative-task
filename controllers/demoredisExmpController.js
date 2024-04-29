const { asyncHandler } = require("../utils/asyncHandler");
const client = require("../utils/redisClient");
const axios = require("axios").default;

exports.demoRedisExmp = asyncHandler(async (req, res, next) => {
  //check if data is in cache
  const cacheValue = await client.get("todos");
  if (cacheValue) {
    return res.status(200).json({
      message: "Demo Redis Example",
      success: true,
      data: JSON.parse(cacheValue),
    });
  }

  //if data is not in cache
  const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos");
  //set data to cache for 60 seconds
  await client.set("todos", JSON.stringify(data), "EX", 60);
  res.status(200).json({
    message: "Demo Redis Example",
    success: true,
    data: data,
  });
});
