import { Edit, Trash2, CheckCircle, Circle } from 'lucide-react';

const TaskCard = ({ task, onToggle, onDelete, onEdit }) => {
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <button className="icon-btn" onClick={() => onToggle(task)}>
          {task.completed ? <CheckCircle className="text-success" /> : <Circle />}
        </button>
        <div className="task-content">
          <h3 className={task.completed ? 'strike' : ''}>{task.title}</h3>
          {task.description && <p className={task.completed ? 'strike' : ''}>{task.description}</p>}
        </div>
      </div>
      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(task)}>
          <Edit size={18} />
        </button>
        <button className="icon-btn danger" onClick={() => onDelete(task._id)}>
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
