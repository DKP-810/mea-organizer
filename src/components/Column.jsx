import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { TaskCard } from './TaskCard'

export function Column({ column, tasks, onCardClick, onAddClick, isMobile, landedId }) {
  const [collapsed, setCollapsed] = useState(false)
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const taskIds = tasks.map((t) => t.id)

  return (
    <div className={`flex flex-col ${isMobile ? 'mb-2' : 'w-72 shrink-0'}`}>
      <div
        className={`${column.headerBg} ${column.headerText} flex items-center justify-between px-4 py-3
          ${isMobile ? 'rounded-xl cursor-pointer' : 'rounded-t-xl'}`}
        onClick={isMobile ? () => setCollapsed(!collapsed) : undefined}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{column.label}</span>
          <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!isMobile && (
            <button
              onClick={onAddClick}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              title="Add task"
            >
              <Plus size={18} />
            </button>
          )}
          {isMobile && (
            collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />
          )}
        </div>
      </div>

      {!collapsed && (
        <div
          ref={setNodeRef}
          className={`flex-1 p-2 min-h-[80px] transition-colors
            ${isMobile
              ? `rounded-b-xl border border-t-0 ${column.borderColor} bg-white`
              : `rounded-b-xl border border-t-0 ${column.borderColor} bg-gray-50`}
            ${isOver ? 'bg-blue-50 ring-2 ring-blue-300 ring-inset' : ''}`}
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                column={column}
                onClick={() => onCardClick(task)}
                landed={task.id === landedId}
              />
            ))}
          </SortableContext>

          {tasks.length === 0 && (
            <p className="text-center text-gray-400 text-xs py-4">Empty</p>
          )}
        </div>
      )}

      {isMobile && !collapsed && (
        <button
          onClick={onAddClick}
          className={`mt-2 w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl border-2 border-dashed
            ${column.badgeText} ${column.borderColor} hover:${column.badgeBg} transition-colors`}
        >
          <Plus size={16} />
          Add task
        </button>
      )}
    </div>
  )
}
