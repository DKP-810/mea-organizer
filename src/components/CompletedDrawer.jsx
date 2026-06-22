import { useState } from 'react'
import { ChevronDown, ChevronUp, RotateCcw, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

export function CompletedDrawer({ tasks, onRestore, onDelete }) {
  const [open, setOpen] = useState(false)

  if (tasks.length === 0 && !open) {
    return (
      <div className="text-center py-6 text-gray-400 text-sm">
        No completed tasks yet.
      </div>
    )
  }

  return (
    <div className="border-t border-gray-200 mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
      >
        <span>
          Completed ({tasks.length})
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="divide-y divide-gray-100">
          {tasks.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-6">Nothing completed yet.</p>
          )}
          {tasks.map((task) => {
            const dueDate = task.dueDate?.toDate
              ? task.dueDate.toDate()
              : task.dueDate
              ? new Date(task.dueDate)
              : null
            return (
              <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 line-through truncate">{task.title}</p>
                  {dueDate && (
                    <p className="text-xs text-gray-400 mt-0.5">{format(dueDate, 'MMM d, yyyy')}</p>
                  )}
                </div>
                <button
                  onClick={() => onRestore(task.id)}
                  className="flex items-center gap-1 text-xs text-[#2A7A5F] hover:text-[#1F5C4E] font-medium px-2 py-1 rounded-lg hover:bg-[#E8F5F0] transition-colors shrink-0"
                >
                  <RotateCcw size={13} />
                  Restore
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-gray-300 hover:text-red-400 p-1 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
