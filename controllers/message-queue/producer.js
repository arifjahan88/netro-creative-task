const { Queue } = require("bullmq");
const { asyncHandler } = require("../../utils/asyncHandler");

const messageQueue = new Queue("message-queue", {
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
  },
});

exports.produceQueue = asyncHandler(async (req, res) => {
  async function addMessageToQueue() {
    const response = await messageQueue.add("sms from user", {
      name: "Arif Jahan",
      subject: "Test Message",
      body: "This is a test message",
    });
    console.log(`Job added to queue ${response?.id}`);

    //Send response
    res.status(200).json({
      message: "Producer added message to queue successfully!",
      success: true,
      data: {
        id: response?.id,
        name: `From ${response?.data?.name}`,
      },
    });
  }

  addMessageToQueue();
});
