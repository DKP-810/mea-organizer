import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { format, isPast, isToday } from 'date-fns'
import { Calendar, Clock, GripVertical } from 'lucide-react'

export function TaskCard({ task, column, onClick, overlay = false, landed = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task, columnId: column.id },
    disabled: overlay,
  })

  const style = {
    transform: overlay ? undefined : CSS.Transform.toString(transform),
    transition: overlay ? undefined : transition,
    opacity: !overlay && isDragging ? 0.4 : 1,
  }

  const dueDate = task.dueDate?.toDate
    ? task.dueDate.toDate()
    : task.dueDate
    ? new Date(task.dueDate)
    : null
  const overdue = dueDate && isPast(dueDate) && !isToday(dueDate)
  const dueToday = dueDate && isToday(dueDate)

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={style}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
      className={`bg-white rounded-xl border shadow-sm mb-2 select-none
        ${overlay
          ? 'shadow-xl ring-2 ring-mea-navy rotate-1 cursor-grabbing'
          : 'cursor-grab hover:shadow-md active:cursor-grabbing active:shadow-lg'}
        ${column.borderColor} border-l-4 transition-shadow
        ${landed ? 'card-land' : ''}`}
      onClick={overlay ? undefined : onClick}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 text-gray-200 shrink-0 hidden md:block">
            <GripVertical size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm leading-snug break-words">{task.title}</p>
            {task.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}

            {task.status === 'waiting_on' && task.waitingOn && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-[#F3ECF7] text-[#4A2D5A] text-xs font-medium px-2 py-1 rounded-full border border-[#C4A8D1]">
                <Clock size={11} />
                <span>Waiting on: {task.waitingOn}</span>
              </div>
            )}

            {dueDate && (
              <div
                className={`mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
                  ${overdue
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : dueToday
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'bg-gray-50 text-gray-500 border border-gray-200'}`}
              >
                <Calendar size={11} />
                <span>
                  {overdue ? 'Overdue · ' : dueToday ? 'Due today · ' : ''}
                  {format(dueDate, 'MMM d')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
