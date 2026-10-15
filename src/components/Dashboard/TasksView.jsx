import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useLanguage } from '../../context/LanguageContext';

export default function TasksView() {
  const { workspace, createTask, updateTask, deleteTask } = useWorkspace();
  const { isAr } = useLanguage();

  const [filterStatus, setFilterStatus] = useState('all'); // all, todo, in_progress, completed
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('emp-1');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!workspace) return null;

  const { tasks, team } = workspace;

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterAssignee !== 'all' && t.assignedTo !== filterAssignee) return false;
    return true;
  });

  const coreTeam = team.filter(m => m.type === 'core');
  const salesTeam = team.filter(m => m.type === 'sales');

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    await createTask({
      title: title.trim(),
      description: description.trim(),
      assignedTo,
      priority,
      dueDate: dueDate || new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
    });
    setSubmitting(false);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const getAssignee = (id) => {
    return team.find(m => m.id === id) || { nameAr: 'غير معين', nameEn: 'Unassigned', avatar: '👤' };
  };

  const priorityColors = {
    urgent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    normal: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/30'
  };

  const priorityLabels = {
    urgent: isAr ? 'عاجل 🔴' : 'Urgent 🔴',
    medium: isAr ? 'متوسط 🟡' : 'Medium 🟡',
    normal: isAr ? 'عادي 🟢' : 'Normal 🟢'
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Top Header & Mobile-Optimized Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📋</span>
            <span>{isAr ? 'المهام ومتابعة الأعمال' : 'Tasks & Work Assignment'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mirqam-teal/20 text-mirqam-teal font-semibold">
              {tasks.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isAr 
              ? 'إنشاء ومتابعة المهام وإسنادها للموظفين الأساسيين (3) أو لمسوقي المبيعات' 
              : 'Assign and track tasks for core employees (3) and sales representatives'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-hover text-white text-xs sm:text-sm font-semibold shadow-md shadow-mirqam-teal/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>{isAr ? 'إضافة مهمة جديدة' : 'New Task'}</span>
        </button>
      </div>

      {/* Filters Bar - Mobile Scrollable & Stackable */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#122033] p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'todo', labelAr: 'جديدة', labelEn: 'To Do' },
            { id: 'in_progress', labelAr: 'قيد التنفيذ', labelEn: 'In Progress' },
            { id: 'completed', labelAr: 'مكتملة', labelEn: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                filterStatus === tab.id
                  ? 'bg-mirqam-teal text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Assignee Filter Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{isAr ? 'المسؤول:' : 'Assignee:'}</span>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-mirqam-teal"
          >
            <option value="all">{isAr ? 'جميع الأعضاء' : 'All Members'}</option>
            <optgroup label={isAr ? 'الفريق الأساسي (3)' : 'Core Team (3)'}>
              {coreTeam.map(m => (
                <option key={m.id} value={m.id}>
                  {isAr ? m.nameAr : m.nameEn} ({isAr ? m.roleAr : m.roleEn})
                </option>
              ))}
            </optgroup>
            <optgroup label={isAr ? 'فريق المبيعات (العمولات)' : 'Sales Team'}>
              {salesTeam.map(m => (
                <option key={m.id} value={m.id}>
                  {isAr ? m.nameAr : m.nameEn} ({isAr ? 'مبيعات' : 'Sales'})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 sm:py-12 bg-white dark:bg-[#122033] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <span className="text-3xl">✨</span>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mt-2">
              {isAr ? 'لا توجد مهام مطابقة' : 'No tasks match your filter'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              {isAr ? 'يمكنك إنشاء مهمة جديدة وتعيينها لأي فرد في الفريق' : 'Create a new task and assign it to any team member'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const assignee = getAssignee(task.assignedTo);
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-50/70 dark:bg-[#122033]/40 border-slate-200 dark:border-slate-800/80 opacity-80'
                    : 'bg-white dark:bg-[#122033] border-slate-200 dark:border-slate-800 hover:shadow-md'
                }`}
              >
                {/* Mobile-Friendly Stack Layout */}
                <div className="flex flex-col gap-3">
                  {/* Top Row: Checkbox + Title + Priority */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => updateTask(task.id, { status: isCompleted ? 'todo' : 'completed' })}
                        className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-mirqam-teal'
                        }`}
                        title={isAr ? 'تبديل حالة الإنجاز' : 'Toggle Completed'}
                      >
                        {isCompleted && (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      <div>
                        <span className={`text-sm font-semibold leading-snug ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                          {task.title}
                        </span>

                        {task.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Priority Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${priorityColors[task.priority] || priorityColors.normal}`}>
                      {priorityLabels[task.priority] || task.priority}
                    </span>
                  </div>

                  {/* Middle Row: Assignee + Due Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                        <span>{assignee.avatar}</span>
                        <span>{isAr ? assignee.nameAr : assignee.nameEn}</span>
                        <span className="text-[10px] text-mirqam-teal font-normal">
                          ({assignee.type === 'core' ? (isAr ? 'أساسي' : 'Core') : (isAr ? 'مبيعات' : 'Sales')})
                        </span>
                      </span>

                      <span className="flex items-center gap-1 text-slate-400 dark:text-slate-400 text-[11px]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{task.dueDate}</span>
                      </span>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      title={isAr ? 'حذف المهمة' : 'Delete Task'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Bottom Row: 1-Click Status Bar */}
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-[#0A1420] rounded-xl p-1 text-[11px]">
                    <button
                      onClick={() => updateTask(task.id, { status: 'todo' })}
                      className={`py-1.5 rounded-lg transition-all text-center font-medium ${
                        task.status === 'todo'
                          ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white font-bold shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      {isAr ? 'جديدة' : 'To Do'}
                    </button>
                    <button
                      onClick={() => updateTask(task.id, { status: 'in_progress' })}
                      className={`py-1.5 rounded-lg transition-all text-center font-medium ${
                        task.status === 'in_progress'
                          ? 'bg-amber-500 text-white font-bold shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      {isAr ? 'قيد العمل' : 'Doing'}
                    </button>
                    <button
                      onClick={() => updateTask(task.id, { status: 'completed' })}
                      className={`py-1.5 rounded-lg transition-all text-center font-medium ${
                        task.status === 'completed'
                          ? 'bg-emerald-500 text-white font-bold shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                      }`}
                    >
                      {isAr ? 'منجزة ✓' : 'Done ✓'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#122033] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>➕</span>
                <span>{isAr ? 'إنشاء مهمة جديدة' : 'Create New Task'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {isAr ? 'عنوان المهمة *' : 'Task Title *'}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: تجهيز العرض التقديمي للعميل الجديد' : 'e.g., Prepare pitch for new client'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {isAr ? 'الوصف والتفاصيل (اختياري)' : 'Description (Optional)'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder={isAr ? 'أضف أي تفاصيل أو متطلبات للمهمة...' : 'Add details or requirements...'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {isAr ? 'إسناد إلى *' : 'Assign To *'}
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                  >
                    <optgroup label={isAr ? 'الفريق الأساسي (3 موظفين)' : 'Core Team (3)'}>
                      {coreTeam.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.avatar} {isAr ? m.nameAr : m.nameEn} - {isAr ? m.roleAr : m.roleEn}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={isAr ? 'فريق المبيعات والعمولات' : 'Sales Team (Commission)'}>
                      {salesTeam.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.avatar} {isAr ? m.nameAr : m.nameEn} ({isAr ? 'مسوق' : 'Sales Rep'})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    {isAr ? 'الأولوية *' : 'Priority *'}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                  >
                    <option value="urgent">{isAr ? 'عاجل 🔴' : 'Urgent 🔴'}</option>
                    <option value="medium">{isAr ? 'متوسط 🟡' : 'Medium 🟡'}</option>
                    <option value="normal">{isAr ? 'عادي 🟢' : 'Normal 🟢'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  {isAr ? 'تاريخ الاستحقاق' : 'Due Date'}
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0A1420] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-mirqam-teal"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-white text-xs font-semibold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-mirqam-teal hover:bg-mirqam-teal-hover text-white text-xs font-bold shadow-md shadow-mirqam-teal/20"
                >
                  {submitting ? (isAr ? 'جاري الإضافة...' : 'Adding...') : (isAr ? 'حفظ المهمة' : 'Create Task')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
