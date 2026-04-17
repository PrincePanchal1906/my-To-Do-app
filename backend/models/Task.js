import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a task title'],
    },
    group:{
      type: String,

    },
    due:{
      type: String,
    },
    notes: {
      type: String,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
  type: Boolean,
  default: false,
}
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
