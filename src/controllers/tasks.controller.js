import Task from "../models/task.model.js";

export const getTasks = async (req, res) => {
  const task = await Task.find({
    user: req.user.id
  }).populate('user')
  res.json(task);
};

export const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id).populate("user")
  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json(task);
};

export const createTask = async (req, res) => {
  const { title, description, date } = req.body;

  const newTask = new Task({
    title,
    description,
    date,
    user: req.user.id
  });

  const saveTask = await newTask.save();
  res.json(saveTask);
};
export const updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json(task);
};
export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.sendStatus(204)
};
