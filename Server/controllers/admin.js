import fs from "fs";
import { promisify } from "util";
import TryCatch from "../middleware/tryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";

const unlinkAsync = promisify(fs.unlink);

export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;
  const image = req.file;
  await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: image?.path,
    duration,
    price,
  });
  res.status(201).json({ message: "Course Created Successfully" });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "No Course with this ID" });
  const { title, description } = req.body;
  const file = req.file;
  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path,
    course: course._id,
  });
  res.status(201).json({ message: "Lecture Added", lecture });
});

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  if (!lecture) return res.status(404).json({ message: "Lecture not found" });
  if (lecture.video) {
    await unlinkAsync(lecture.video);
    console.log("Video deleted");
  }
  await lecture.deleteOne();
  res.json({ message: "Lecture Deleted" });
});

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  const lectures = await Lecture.find({ course: course._id });
  await Promise.all(
    lectures.map(async (lecture) => {
      if (lecture.video) {
        await unlinkAsync(lecture.video);
        console.log("Video deleted");
      }
    })
  );
  if (course.image) {
    await unlinkAsync(course.image);
    console.log("Image deleted");
  }
  await Lecture.deleteMany({ course: req.params.id });
  await course.deleteOne();
  await User.updateMany({}, { $pull: { subscription: req.params.id } });
  res.json({ message: "Course Deleted" });
});

export const getAllStats = TryCatch(async (req, res) => {
  const totalCourses = await Courses.countDocuments();
  const totalLectures = await Lecture.countDocuments();
  const totalUsers = await User.countDocuments();
  const stats = { totalCourses, totalLectures, totalUsers };
  res.json({ stats });
});

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
  res.json({ users });
});

export const updateRole = TryCatch(async (req, res) => {
  if (req.user.mainrole !== "superadmin")
    return res.status(403).json({ message: "This endpoint is assigned to superadmin" });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.role = user.role === "user" ? "admin" : "user";
  await user.save();
  res.status(200).json({ message: `Role updated to ${user.role}` });
});
