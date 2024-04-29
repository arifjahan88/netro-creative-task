const { Worker } = require("bullmq");

const sendEmail = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms * 1000));

new Worker(
  "message-queue",
  async (job) => {
    console.log(`Received job with id ${job.id}`);
    await sendEmail(1);
    console.log(`Processing job with ${job.data.name}`);
    await sendEmail(3);
    console.log(`sms sending to ${job.data.name}`);
    await sendEmail(5);
    console.log("Sms Sent Successfully!");
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: process.env.REDIS_PORT || 6379,
    },
  }
);
