import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Calendar, User, Tag, AlertCircle, Plus, Trash2, Pencil } from 'lucide-react';
import { Tasks } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { format } from 'date-fns';

interface TaskBoardProps {
  tasks: Tasks[];
  projectId: string;
  onTasksUpdate: (tasks: Tasks[]) => void;
}

const COLUMNS = [
  { id: 'To Do', title: 'To Do', color: 'electric-teal' },
  { id: 'In Progress', title: 'In Progress', color: 'electric-magenta' },
  { id: 'Done', title: 'Done', color: 'green-400' },
];

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

interface EditState {
  taskId: string;
  title: string;
  description: string;
  priority: string;
  assignedTo: string;
  dueDate: string;
  labels: string;
}

export default function TaskBoard({ tasks, projectId, onTasksUpdate }: TaskBoardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editState, setEditState] = useState<EditState | null>(null);

  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const updated = tasks.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t));
    onTasksUpdate(updated);
    try {
      await BaseCrudService.update<Tasks>('tasks', { _id: draggableId, status: newStatus });
    } catch {
      onTasksUpdate(tasks);
    }
  };

  const handleCreateTask = async (status: string) => {
    if (!newTaskTitle.trim()) return;
    const newTask: Tasks = {
      _id: crypto.randomUUID(),
      projectId,
      title: newTaskTitle,
      status,
      priority: 'Medium',
      description: '',
    };
    onTasksUpdate([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskColumn(null);
    setIsCreating(false);
    try {
      await BaseCrudService.create('tasks', newTask);
    } catch {
      onTasksUpdate(tasks);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    onTasksUpdate(tasks.filter((t) => t._id !== taskId));
    try {
      await BaseCrudService.delete('tasks', taskId);
    } catch {
      onTasksUpdate(tasks);
    }
  };

  const openEdit = (task: Tasks) => {
    setEditState({
      taskId: task._id,
      title: task.title ?? '',
      description: task.description ?? '',
      priority: task.priority ?? 'Medium',
      assignedTo: task.assignedTo ?? '',
      dueDate: task.dueDate ? String(task.dueDate).slice(0, 10) : '',
      labels: task.labels ?? '',
    });
  };

  const handleSaveEdit = async () => {
    if (!editState) return;
    const { taskId, ...fields } = editState;
    const updated = tasks.map((t) => (t._id === taskId ? { ...t, ...fields } : t));
    onTasksUpdate(updated);
    setEditState(null);
    try {
      await BaseCrudService.update<Tasks>('tasks', { _id: taskId, ...fields });
    } catch {
      onTasksUpdate(tasks);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': case 'critical': return 'text-destructive';
      case 'medium': return 'text-electric-magenta';
      case 'low': return 'text-electric-teal';
      default: return 'text-foreground/60';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-4xl font-bold text-foreground">
          Task <span className="text-electric-teal">Board</span>
        </h2>
        <div className="font-paragraph text-sm text-foreground/60">
          {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
        </div>
      </div>

      {/* Edit Modal */}
      {editState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-charcoal border border-electric-teal/30 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="font-heading text-xl font-bold text-foreground mb-4">Edit Task</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Title</label>
                <input value={editState.title} onChange={(e) => setEditState((s) => s && ({ ...s, title: e.target.value }))}
                  className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-electric-teal" />
              </div>
              <div>
                <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Description</label>
                <textarea value={editState.description} onChange={(e) => setEditState((s) => s && ({ ...s, description: e.target.value }))}
                  rows={2} className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-electric-teal resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Priority</label>
                  <select value={editState.priority} onChange={(e) => setEditState((s) => s && ({ ...s, priority: e.target.value }))}
                    className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-electric-teal">
                    {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Due Date</label>
                  <input type="date" value={editState.dueDate} onChange={(e) => setEditState((s) => s && ({ ...s, dueDate: e.target.value }))}
                    className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-electric-teal" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Assigned To</label>
                <input value={editState.assignedTo} onChange={(e) => setEditState((s) => s && ({ ...s, assignedTo: e.target.value }))}
                  className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-electric-teal" />
              </div>
              <div>
                <label className="block text-xs text-foreground/60 mb-1 font-paragraph">Labels</label>
                <input value={editState.labels} onChange={(e) => setEditState((s) => s && ({ ...s, labels: e.target.value }))}
                  placeholder="e.g. frontend, bug"
                  className="w-full bg-deep-space-blue border border-electric-teal/20 rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-electric-teal" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleSaveEdit}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded font-paragraph text-sm font-semibold hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all">
                Save
              </button>
              <button onClick={() => setEditState(null)}
                className="flex-1 border border-foreground/20 text-foreground/70 py-2 rounded font-paragraph text-sm hover:border-foreground/40 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid lg:grid-cols-3 gap-6">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div key={column.id} className="flex flex-col">
                {/* Column Header */}
                <div className="bg-charcoal/50 backdrop-blur-sm border border-electric-teal/20 rounded-t-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading text-xl font-semibold text-foreground">{column.title}</h3>
                    <span className={`w-8 h-8 rounded-full bg-${column.color}/10 border border-${column.color}/30 flex items-center justify-center font-paragraph text-sm font-medium text-${column.color}`}>
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => { setNewTaskColumn(column.id); setIsCreating(true); }}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-deep-space-blue border border-electric-teal/20 rounded text-foreground/70 hover:text-electric-teal hover:border-electric-teal/50 transition-colors font-paragraph text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 bg-charcoal/30 backdrop-blur-sm border-x border-b border-electric-teal/20 rounded-b-lg p-4 min-h-[500px] transition-colors ${snapshot.isDraggingOver ? 'bg-electric-teal/5' : ''}`}
                    >
                      <div className="space-y-4">
                        {/* New Task Form */}
                        {isCreating && newTaskColumn === column.id && (
                          <div className="bg-deep-space-blue border border-electric-teal/30 rounded-lg p-4">
                            <input
                              type="text"
                              placeholder="Task title..."
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateTask(column.id);
                                if (e.key === 'Escape') { setIsCreating(false); setNewTaskColumn(null); setNewTaskTitle(''); }
                              }}
                              autoFocus
                              className="w-full bg-transparent border-none outline-none font-paragraph text-sm text-foreground placeholder:text-foreground/40 mb-3"
                            />
                            <div className="flex gap-2">
                              <button onClick={() => handleCreateTask(column.id)}
                                className="flex-1 bg-primary text-primary-foreground py-2 rounded font-paragraph text-xs font-semibold hover:shadow-[0_0_15px_rgba(0,255,255,0.4)] transition-all">
                                Add
                              </button>
                              <button onClick={() => { setIsCreating(false); setNewTaskColumn(null); setNewTaskTitle(''); }}
                                className="flex-1 bg-transparent border border-foreground/20 text-foreground/70 py-2 rounded font-paragraph text-xs font-medium hover:border-foreground/40 transition-colors">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Tasks */}
                        {columnTasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`group/task bg-deep-space-blue border border-electric-teal/20 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-electric-teal/50 transition-all relative ${snapshot.isDragging ? 'shadow-[0_0_20px_rgba(0,255,255,0.3)] rotate-2' : ''}`}
                              >
                                {/* Task actions */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity">
                                  <button onClick={() => openEdit(task)}
                                    className="p-1 bg-charcoal border border-electric-teal/20 rounded hover:border-electric-teal/60 text-foreground/50 hover:text-electric-teal transition-colors">
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => handleDelete(task._id)}
                                    className="p-1 bg-charcoal border border-destructive/20 rounded hover:border-destructive/60 text-foreground/50 hover:text-destructive transition-colors">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Task Header */}
                                <div className="flex items-start justify-between mb-3 pr-14">
                                  <h4 className="font-heading text-base font-semibold text-foreground flex-1">
                                    {task.title || 'Untitled Task'}
                                  </h4>
                                  {task.priority && (
                                    <div className={`flex items-center gap-1 ml-2 ${getPriorityColor(task.priority)}`}>
                                      <AlertCircle className="w-3 h-3" />
                                      <span className="font-paragraph text-xs">{task.priority}</span>
                                    </div>
                                  )}
                                </div>

                                {task.description && (
                                  <p className="font-paragraph text-xs text-foreground/60 mb-3 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}

                                <div className="space-y-2">
                                  {task.assignedTo && (
                                    <div className="flex items-center gap-2 text-foreground/50">
                                      <User className="w-3 h-3" />
                                      <span className="font-paragraph text-xs">{task.assignedTo}</span>
                                    </div>
                                  )}
                                  {task.dueDate && (
                                    <div className="flex items-center gap-2 text-foreground/50">
                                      <Calendar className="w-3 h-3" />
                                      <span className="font-paragraph text-xs">
                                        {format(new Date(task.dueDate), 'MMM dd')}
                                      </span>
                                    </div>
                                  )}
                                  {task.labels && (
                                    <div className="flex items-center gap-2 text-foreground/50">
                                      <Tag className="w-3 h-3" />
                                      <span className="font-paragraph text-xs">{task.labels}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
