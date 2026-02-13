require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECT_STRING);
    console.log("Database connected:", connect.connection.host);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const interviewSlotSchema = new mongoose.Schema({
  slotNumber: { type: Number, required: true, unique: true },
  bookedCount: { type: Number, default: 0 },
  startTime: Date,
  endTime: Date,
  status: { type: String, enum: ["free", "full"], default: "free" },
});

const InterviewSlot = mongoose.model("InterviewSlot", interviewSlotSchema);
const START_DATE = new Date("2025-2-13T21:00:00+05:30");
const END_DATE = new Date("2025-2-14T01:00:00+05:30");
const SLOT_DURATION_MINS = 20;
const MAX_BOOKINGS_PER_SLOT = 3;
const TOTAL_SLOTS_REQUIRED = 504;

/* ========================================== */

async function seedSlots() {
  try {
    await connectDb();
    await InterviewSlot.deleteMany({});
    console.log("Cleared existing slots");

    const slots = [];
    let slotCounter = 1;

    while (currentTime < END_DATE) {
      const nextTime = new Date(
        currentTime.getTime() + SLOT_DURATION_MINS * 60000,
      );

    while (slots.length < TOTAL_SLOTS_REQUIRED) {
      const dayStart = new Date(currentDay);
      dayStart.setHours(DAILY_START_HOUR, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      dayEnd.setHours(DAILY_END_HOUR, 0, 0, 0);

      let currentTime = new Date(dayStart);

      while (
        currentTime < dayEnd &&
        currentTime >= RANGE_START &&
        currentTime < RANGE_END &&
        slots.length < TOTAL_SLOTS_REQUIRED
      ) {
        const nextTime = new Date(
          currentTime.getTime() + SLOT_DURATION_MINS * 60000
        );

        if (nextTime > dayEnd || nextTime > RANGE_END) break;

        slots.push({
          slotNumber: slotCounter++,
          startTime: new Date(currentTime),
          endTime: new Date(nextTime),
          bookedCount: 0,
          status: "free",
        });

        currentTime = nextTime;
      }

      currentDay.setDate(currentDay.getDate() + 1);
      
      if (currentDay > RANGE_END && slots.length < TOTAL_SLOTS_REQUIRED) {
        break;
      }
    }

    await InterviewSlot.insertMany(slots);
    console.log(`Successfully created ${slots.length} slots.`);
    console.log(`Each slot allows ${MAX_BOOKINGS_PER_SLOT} bookings.`);
    console.log(
      "First Slot:",
      slots[0].startTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    );
  } catch (err) {
    console.error("Error seeding slots:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed");
  }
}

seedSlots();
