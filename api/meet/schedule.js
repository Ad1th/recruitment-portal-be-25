const { google } = require("googleapis");
const MeetDetails = require("../models/meetModel");
const mongoose = require("mongoose");
const User = mongoose.models.User || require("../models/userModel");
const InterviewSlot = require("../models/interviewModel");
const nodemailer = require("nodemailer");
const path = require("path");

// Number of Bookings Allowed Per Slots
const MAX_BOOKINGS = 3;

// Interviewer List , Update Before Deployment, UPDATED hehe
const INTERVIEWERS = [
  "adith.manikonda2024@vitstudent.ac.in",
  "yuvraj.bansal2024@vitstudent.ac.in",
  "adithyanachiyappan.2024@vitstudent.ac.in",
  "pranjal.sahay2024@vitstudent.ac.in",
  "dakshata.abhyankar2024@vitstudent.ac.in",
  "arshia.ghosh2024@vitstudent.ac.in",
  // "sarthak.jain2024@vitstudent.ac.in",
  // "anurag.thakur2024@vitstudent.ac.in",
  "aadya.agarwal2024b@vitstudent.ac.in",
  // "ritwin.as2024@vitstudent.ac.in",
  "traya.jawahar2024@vitstudent.ac.in",
  "neha.damani2024@vitstudent.ac.in",
  // "shubham.mishra2024@vitstudent.ac.in",
  "pooja.goel2023@vitstudent.ac.in",
  "riyan.johnson2024@vitstudent.ac.in",
  // "anuraag.chakraborty2024@vitstudent.ac.in",
  "aayush.keshwani2024@vitstudent.ac.in",
  // "shreya.yadav2024@vitstudent.ac.in",
  // "jaanya.bagdi2024@vitstudent.ac.in",
  "manya.praveensingh2024@vitstudent.ac.in",
  "rishita.khetan2024@vitstudent.ac.in",
];
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MFC_EMAIL,
    pass: process.env.MFC_EMAIL_PASSWORD,
  },
});

function emailTemplate({ candidateName, date, start, end, meetLink }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">

<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #000000 !important;
    font-family: Arial, sans-serif;
  }

  table {
    border-collapse: collapse;
  }

  .outer {
    width: 100%;
    max-width: 600px;
  }

  /* MOBILE FIRST */
  .two-col {
    width: 320px;
  }

  .text {
    color: #ffffff !important;
    font-size: 11.5px;
    line-height: 1.4;
  }

  .muted {
    color: #d8d8d8 !important;
  }

  .link {
    color: #ff7824 !important;
    text-decoration: none;
    word-break: break-word;
  }

  /* DESKTOP ONLY */
  @media only screen and (min-width: 601px) {
    .two-col {
      width: 560px !important;
    }

    .left-img {
      width: 280px !important;
    }

    .left-img img {
      width: 280px !important;
      height: auto !important;
    }

    .right-text {
      width: 280px !important;
      font-size: 13.5px !important;
      line-height: 1.55 !important;
    }
  }
</style>
</head>

<body>

<!-- WRAPPER 1 -->
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#000000">
<tr>
<td align="center" bgcolor="#000000">

<!-- WRAPPER 2 -->
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#000000">
<tr>
<td align="center" bgcolor="#000000">

<!-- WRAPPER 3 / OUTER -->
<table class="outer" width="100%" cellpadding="0" cellspacing="0" align="center"
       bgcolor="#000000" style="background-color:#000000;">

<!-- HEADER IMAGE -->
<tr>
<td align="center" bgcolor="#000000" style="background-color:#000000;">
  <img
    src="cid:header_img"
    width="600"
    style="width:100%; max-width:600px; display:block;"
    alt="MFC Interview Confirmation"
  />
</td>
</tr>

<!-- CONTENT -->
<tr>
<td align="center" bgcolor="#000000" style="background-color:#000000;">

<table class="two-col" width="320" cellpadding="0" cellspacing="0" align="center"
       bgcolor="#000000" style="background-color:#000000;">
<tr>

<!-- LEFT IMAGE -->
<td width="150" valign="bottom" class="left-img"
    bgcolor="#000000" style="background-color:#000000;">
  <img
    src="cid:building_img"
    width="150"
    style="display:block;"
    alt="MFC Building"
  />
</td>

<!-- RIGHT TEXT -->
<td
  width="170"
  valign="top"
  class="text right-text"
  bgcolor="#000000"
  style="padding-left:14px; background-color:#000000;"
>

  <b>Dear candidate,</b><br><br>

  <span class="muted">
    Please find the details for your scheduled meeting below:
  </span><br><br>

  <b>Candidate:</b> ${candidateName}<br>
  <b>Date:</b> ${date}<br>
  <b>Time:</b> ${start} – ${end}<br><br>

  <b>Google Meet:</b><br>
  <a class="link" href="${meetLink}">
    ${meetLink}
  </a>

</td>
</tr>
</table>

</td>
</tr>

<!-- FOOTER (FORCED ORANGE, CLICKABLE, GMAIL-iOS SAFE) -->
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0"
       bgcolor="#FF8C42" style="background-color:#FF8C42;">
<tr>
<td align="center"
    bgcolor="#FF8C42"
    style="padding:14px; background-color:#FF8C42;">

  <a href="https://www.instagram.com/mfc_vit" style="display:inline-block;">
    <img src="cid:insta_icon" width="22"
         style="display:block; margin:0 12px;" />
  </a>

  <a href="https://www.linkedin.com/company/mfcvit" style="display:inline-block;">
    <img src="cid:linkedin_icon" width="22"
         style="display:block; margin:0 12px;" />
  </a>

  <a href="mailto:mozillafirefox@vit.ac.in" style="display:inline-block;">
    <img src="cid:mail_icon" width="22"
         style="display:block; margin:0 12px;" />
  </a>

</td>
</tr>
</table>

</td>
</tr>

</table>
</td>
</tr>
</table>
</td>
</tr>
</table>

</body>
</html>`;
}
const scheduleMeeting = async (req, res) => {
  try {
    // Request for these three from the Frontend - Switched Slot for scheduleTime
    const { candidateId, domains, scheduletime } = req.body;

    if (!candidateId || !scheduletime) {
      return res.status(400).json({
        error: "Missing required fields: candidateId or scheduletime",
      });
    }

    // Convert string to Date object for accurate comparison
    const requestedTime = new Date(scheduletime);

    //Find slot by matching the startTime in the DB
    const slotDoc = await InterviewSlot.findOne({ startTime: requestedTime });

    if (!slotDoc) {
      return res
        .status(404)
        .json({ error: "No interview slot found for this time." });
    }

    // Check if Slot is Booked Out
    if (slotDoc.status === "full" || slotDoc.bookedCount >= MAX_BOOKINGS) {
      return res.status(409).json({ error: "This slot is fully booked." });
    }

    // Check for Existing Slot for the Same Candidate
    const existingBooking = await MeetDetails.findOne({
      user_id: candidateId,
    });

    if (existingBooking) {
      return res.status(400).json({ error: "You have already booked a slot" });
    }

    const candidate = await User.findById(candidateId);
    if (!candidate)
      return res.status(404).json({ error: "Candidate not found" });

    const adminUser = await User.findOne({ admin: true });
    if (!adminUser || !adminUser.googleRefreshToken) {
      return res
        .status(400)
        .json({ error: "Admin must connect Google Calendar first." });
    }

    const oauth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
    oauth.setCredentials({ refresh_token: adminUser.googleRefreshToken });
    const calendar = google.calendar({ version: "v3", auth: oauth });
    const startDate = new Date(slotDoc.startTime);
    const endDate = new Date(slotDoc.endTime);

    const event = {
      summary: `${candidate.username} - MFC Interview`,
      description: `Candidate interview for MFC recruitment. Domains: ${domains}`,
      start: { dateTime: startDate.toISOString() },
      end: { dateTime: endDate.toISOString() },
      attendees: [
        { email: candidate.email },
        ...INTERVIEWERS.map((email) => ({ email })),
      ],
      conferenceData: {
        createRequest: {
          requestId: "mfc-" + Date.now(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
    });

    const meetLink = response.data.hangoutLink;
    const eventId = response.data.id;

    // Update Slot Counts
    slotDoc.bookedCount += 1;
    if (slotDoc.bookedCount >= MAX_BOOKINGS) {
      slotDoc.status = "full";
    }
    await slotDoc.save();

    const entry = await MeetDetails.create({
      user_id: candidateId,
      intervieweremail: INTERVIEWERS,
      scheduledTime: startDate,
      endTime: endDate,
      gmeetLink: meetLink,
      googleEventId: eventId,
    });

    // Send Email
    const formattedDate = startDate.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const startTimeStr = startDate.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTimeStr = endDate.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    });

    const html = emailTemplate({
      candidateName: candidate.username,
      date: formattedDate,
      start: startTimeStr,
      end: endTimeStr,
      meetLink,
    });

    await transporter.sendMail({
      from: process.env.MFC_EMAIL,
      to: [candidate.email, ...INTERVIEWERS],
      subject: "MFC Interview Scheduled",
      text: `MFC Interview Confirmation\n\nCandidate: ${candidate.username}\nDate: ${formattedDate}\nTime: ${startTimeStr} - ${endTimeStr}\nGoogle Meet Link: ${meetLink}`,
      html,
      attachments: [
        {
          filename: "header.webp",
          path: path.join(__dirname, "header.webp"),
          cid: "header_img",
        },
        {
          filename: "building.webp",
          path: path.join(__dirname, "building.webp"),
          cid: "building_img",
        },
        {
          filename: "instagram.png",
          path: path.join(__dirname, "instagram.png"),
          cid: "insta_icon",
        },
        {
          filename: "linkedin.png",
          path: path.join(__dirname, "linkedin.png"),
          cid: "linkedin_icon",
        },
        {
          filename: "email.png",
          path: path.join(__dirname, "email.png"),
          cid: "mail_icon",
        },
      ],
    });

    // Include the generated Google Meet link explicitly so frontend sees it immediately
    return res.json({
      success: true,
      message: "Interview scheduled!",
      data: entry,
      gmeetLink: meetLink,
      meetingStartTime: startDate,
    });
  } catch (err) {
    console.error("Error scheduling meeting:", err);
    return res.status(500).json({ error: "Failed to schedule meeting" });
  }
};

const cancelMeeting = async (req, res) => {
  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({ error: "Missing candidateId" });
    }

    const booking = await MeetDetails.findOne({ user_id: candidateId });
    if (!booking) {
      return res
        .status(404)
        .json({ error: "No booking found for this candidate" });
    }

    const adminUser = await User.findOne({ admin: true });
    if (!adminUser || !adminUser.googleRefreshToken) {
      return res.status(400).json({ error: "Admin Google Token missing" });
    }

    const oauth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
    oauth.setCredentials({ refresh_token: adminUser.googleRefreshToken });
    const calendar = google.calendar({ version: "v3", auth: oauth });

    try {
      await calendar.events.delete({
        calendarId: "primary",
        eventId: booking.googleEventId,
      });
    } catch (googleError) {
      console.warn(
        "Google Event not found or already deleted:",
        googleError.message,
      );
    }

    const slotDoc = await InterviewSlot.findOne({
      startTime: booking.scheduledTime,
    });

    if (slotDoc) {
      slotDoc.bookedCount = Math.max(0, slotDoc.bookedCount - 1);

      if (slotDoc.status === "full" && slotDoc.bookedCount < MAX_BOOKINGS) {
        slotDoc.status = "free";
      }
      await slotDoc.save();
    }

    await MeetDetails.deleteOne({ _id: booking._id });

    return res.json({
      success: true,
      message: "Booking cancelled and slot freed successfully",
    });
  } catch (err) {
    console.error("Error cancelling meeting:", err);
    return res.status(500).json({ error: "Failed to cancel meeting" });
  }
};

module.exports = { scheduleMeeting, cancelMeeting };
