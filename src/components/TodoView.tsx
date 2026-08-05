import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, ArrowUp, ArrowDown, Check, ListTodo } from 'lucide-react';
import { Todo } from '../types';

interface TodoViewProps {
  todos: Todo[];
  loading?: boolean;
  onAddTodo: (taskName: string) => void;
  onToggleTodo: (id: string, currentStatus: boolean) => void;
  onDeleteTodo: (id: string) => void;
  onReorderTodos: (todos: Todo[]) => void;
}

export const TodoView: React.FC<TodoViewProps> = ({
  todos,
  loading = false,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onReorderTodos,
}) => {
  const [newTaskName, setNewTaskName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    onAddTodo(newTaskName.trim());
    setNewTaskName('');
  };

  const moveTask = (index: number, direction: 'up' | 'down') => {
    const newTodos = [...todos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTodos.length) return;

    const temp = newTodos[index];
    newTodos[index] = newTodos[targetIndex];
    newTodos[targetIndex] = temp;

    onReorderTodos(newTodos);
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] px-5 py-6 w-full flex flex-col justify-between">
      <div>
        {/* Title Header */}
        <div className="flex items-center gap-2 mb-6">
          <ListTodo className="w-6 h-6 text-[#007AFF]" />
          <h2 className="text-xl font-bold text-white tracking-tight">To-Do List</h2>
        </div>

        {/* Create Task Form */}
        <form onSubmit={handleAdd} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Add a new quick task..."
            className="flex-1 bg-[#1C1C1E] border border-[#2C2C2E] focus:border-[#007AFF] text-white placeholder-[#8E8E93] text-sm rounded-xl px-4 py-3 outline-none transition-all"
          />
          <button
            type="submit"
            className="bg-white text-[#0A0A0C] hover:bg-[#F2F2F7] font-semibold text-sm px-5 rounded-xl flex items-center justify-center shrink-0 border border-white/20 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

        {/* Task List */}
        <div className="space-y-2.5">
          {loading ? (
            <div className="space-y-2.5 animate-pulse">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl px-4 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-4 h-4 rounded bg-[#2C2C2E]" />
                    <div className="h-3.5 bg-[#2C2C2E] rounded w-2/3" />
                  </div>
                  <div className="w-12 h-3 bg-[#2C2C2E] rounded" />
                </div>
              ))}
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12 px-4 bg-[#1C1C1E]/50 border border-[#2C2C2E] rounded-xl">
              <CheckSquare className="w-8 h-8 text-[#8E8E93] mx-auto mb-2" />
              <p className="text-sm text-[#8E8E93] font-medium">No tasks yet</p>
              <p className="text-xs text-[#8E8E93]/80 mt-1">Add tasks above to keep track of your daily action items.</p>
            </div>
          ) : (
            todos.map((todo, index) => (
              <div
                key={todo.id}
                className={`bg-[#1C1C1E] border border-[#2C2C2E] rounded-xl px-4 py-3 flex items-center justify-between gap-3 transition-all ${
                  todo.is_completed ? 'opacity-60' : ''
                }`}
              >
                {/* Left: Checkbox & Task Name */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => onToggleTodo(todo.id, todo.is_completed)}
                    className="w-5 h-5 flex items-center justify-center shrink-0 cursor-pointer focus:outline-none"
                    title={todo.is_completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {todo.is_completed ? (
                      <span className="text-[#007AFF] text-base font-bold select-none">✓</span>
                    ) : (
                      <div className="w-4 h-4 rounded-[4px] border border-[#3A3A3C] hover:border-[#007AFF] transition-colors" />
                    )}
                  </button>

                  <span
                    className={`text-sm tracking-tight break-words min-w-0 ${
                      todo.is_completed ? 'text-[#8E8E93] line-through' : 'text-white'
                    }`}
                  >
                    {todo.task_name}
                  </span>
                </div>

                {/* Right: Reorder Handles & Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveTask(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-[#8E8E93] hover:text-white disabled:opacity-20 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveTask(index, 'down')}
                    disabled={index === todos.length - 1}
                    className="p-1.5 text-[#8E8E93] hover:text-white disabled:opacity-20 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 transition-colors ml-1"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
