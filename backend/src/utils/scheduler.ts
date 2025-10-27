import schedule from "node-schedule";
import { transporter } from "../config/mailer.js";
import { Application, type IApplication } from "../models/Application.js";
import { User } from "../models/User.js";

export const scheduleReminders = (app: IApplication, email: string) => {
  if (!app.deadline) return;
  const times = [
    { offset: 24 * 60 * 60 * 1000, subject: "Your application is due tomorrow!" },
    { offset: 2 * 60 * 60 * 1000, subject: "2 hours left to submit!" },
    { offset: 0, subject: "Did you finish your application?" },
  ];

  times.forEach(({ offset, subject }) => {
    const time = new Date(app.deadline!.getTime() - offset);
    if (time > new Date()) {
      schedule.scheduleJob(time, async () => {
        await transporter.sendMail({
          from: process.env.MAIL_USER,
          to: email,
          subject,
          text: `Reminder for: ${app.title}\nDeadline: ${app.deadline}`,
        });
      });
    }
  });
};

export const schedulePendingReminders = async () => {
  const futureApps = await Application.find({ deadline: { $gt: new Date() } });
  for (const app of futureApps) {
    const user = await User.findById(app.userId);
    if (user) scheduleReminders(app, user.email);
  }
};
