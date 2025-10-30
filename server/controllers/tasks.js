import Task from '../models/Task.js';

// Create
export const createTask = async (req,res) => {
  try {
    const { title, description, dueDate } = req.body;
    if(!title) return res.status(400).json({ message: 'Title required' });
    const task = await Task.create({ user: req.user._id, title, description, dueDate });
    res.status(201).json(task);
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }) }
};

// Read (list + search + filter)
export const getTasks = async (req,res) => {
  try {
    const { q, completed } = req.query;
    const filter = { user: req.user._id };
    if(q) filter.title = { $regex: q, $options: 'i' };
    if(completed !== undefined) filter.completed = completed === 'true';
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }) }
};

// Update
export const updateTask = async (req,res) => {
  try{
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if(!task) return res.status(404).json({ message: 'Not found' });
    res.json(task);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }) }
};

// Delete
export const deleteTask = async (req,res) => {
  try{
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if(!task) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }) }
};
