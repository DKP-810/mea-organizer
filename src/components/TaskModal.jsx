import { useState, useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'
import { COLUMNS, COLUMN_MAP } from '../constants/columns'
import { format } from 'date-fns'

export function TaskModal({ task, defaultStatus, onSave, onDelete, onClose }) {
  const isNew = !task

  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState(task?.status ?? defaultStatus ?? 'immediate')
  const [waitingOn, setWaitingOn] = useState(task?.waitingOn ?? '')
  const [dueDate, setDueDate] = useState(() => {
    if (!task?.dueDate) return ''
    const d = task.dueDate?.toDate ? task.dueDate.toDate() : new Date(task.dueDate)
    return format(d, 'yyyy-MM-dd')
  })

  const column = COLUMN_MAP[status] ?? COLUMNS[0]

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      description: description.trim(),
      status,
      waitingOn: status === 'waiting_on' ? waitingOn.trim() : '',
      dueDate: dueDate || null,
    })
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className={`${column.headerBg} rounded-t-2xl px-5 py-4 flex items-center justify-between`}>
          <h2 className="text-white font-semibold text-lg">
            {isNew ? 'New Task' : 'Edit Task'}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task title *</label>
            <input
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Details (optional)</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Any additional context..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Move to column</label>
            <div className="flex flex-wrap gap-2">
              {COLUMNS.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setStatus(col.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                    ${status === col.id
                      ? `${col.headerBg} ${col.headerText} border-transparent`
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
                >
                  {col.shortLabel}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                  ${status === 'completed'
                    ? 'bg-gray-600 text-white border-transparent'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
              >
                Completed
              </button>
            </div>
          </div>

          {status === 'waiting_on' && (
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Waiting on who/what?</label>
              <input
                className="w-full border border-purple-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g. Dr. Henderson, IT department, budget approval..."
                value={waitingOn}
                onChange={(e) => setWaitingOn(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due date (optional)</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className={`flex-1 ${column.headerBg} text-white font-semibold py-2.5 rounded-xl text-sm disabled:opacity-40 transition-opacity hover:opacity-90`}
            >
              {isNew ? 'Add Task' : 'Save Changes'}
            </button>
            {!isNew && (
              <button
                type="button"
                onClick={onDelete}
                className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
