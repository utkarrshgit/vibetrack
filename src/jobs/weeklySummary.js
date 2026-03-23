const cron = require("node-cron");
const Session = require("../models/Session");
const WeeklySummary = require("../models/WeeklySummary");
const User = require("../models/User");

// Runs every Sunday at midnight
cron.schedule("0 0 * * 0", async () => {
  console.log("Running weekly summary job...");

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const currentYear = new Date().getFullYear();
  const currentWeek = Math.ceil(
    Math.floor(
      (new Date() - new Date(currentYear, 0, 1)) / (24 * 60 * 60 * 1000),
    ) / 7,
  );
  const weekString = `${currentYear}-${currentWeek}`;

  try {
    const users = await User.find();

    for (const user of users) {
      const sessions = await Session.find({
        userId: user._id,
        status: "closed",
        createdAt: { $gte: oneWeekAgo },
      });

      if (sessions.length === 0) continue;

      let totalMood = 0;
      const tagCounts = {};

      sessions.forEach((session) => {
        totalMood += session.moodScore;
        session.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      const avgMoodScore = totalMood / sessions.length;
      const dominantTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map((entry) => entry[0]);

      await WeeklySummary.create({
        userId: user._id,
        week: weekString,
        avgMoodScore,
        dominantTags,
      });
    }
  } catch (error) {
    console.error("Error generating weekly summaries:", error);
  }
});
