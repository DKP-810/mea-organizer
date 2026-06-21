import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Column } from './Column'
import { TaskCard } from './TaskCard'
import { TaskModal } from './TaskModal'
import { CompletedDrawer } from './CompletedDrawer'
import { COLUMNS, COLUMN_MAP } from '../constants/columns'

export function Board({ tasks, addTask, updateTask, deleteTask, moveTask, reorderTasks }) {
  const [activeTask, setActiveTask] = useState(null)
  const [landedId, setLandedId] = useState(null)
  const [modalTask, setModalTask] = useState(undefined) // undefined = closed, null = new
  const [defaultStatus, setDefaultStatus] = useState('immediate')
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  function getTasksByStatus(status) {
    return tasks
      .filter((t) => t.status === status)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  function openNewTask(status) {
    setDefaultStatus(status)
    setModalTask(null)
  }

  function handleDragStart({ active }) {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null)
  }

  async function handleDragEnd({ active, over }) {
    setActiveTask(null)
    if (!over) return

    const draggedTask = tasks.find((t) => t.id === active.id)
    if (!draggedTask) return

    // Dropped onto a column's droppable zone
    if (COLUMN_MAP[over.id]) {
      if (draggedTask.status !== over.id) {
        await moveTask(active.id, over.id)
        setLandedId(active.id)
        setTimeout(() => setLandedId(null), 300)
      }
      return
    }

    // Dropped onto another card
    const overTask = tasks.find((t) => t.id === over.id)
    if (!overTask) return

    if (draggedTask.status !== overTask.status) {
      await moveTask(active.id, overTask.status)
      setLandedId(active.id)
      setTimeout(() => setLandedId(null), 300)
      return
    }

    // Reorder within the same column
    const columnTasks = getTasksByStatus(draggedTask.status)
    const oldIndex = columnTasks.findIndex((t) => t.id === active.id)
    const newIndex = columnTasks.findIndex((t) => t.id === over.id)
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const reordered = arrayMove(columnTasks, oldIndex, newIndex)
      await reorderTasks(reordered.map((t) => t.id), draggedTask.status)
    }
  }

  async function handleSave(data) {
    if (modalTask === null) {
      await addTask(data)
    } else {
      await updateTask(modalTask.id, data)
    }
    setModalTask(undefined)
  }

  async function handleDelete() {
    if (modalTask) {
      await deleteTask(modalTask.id)
      setModalTask(undefined)
    }
  }

  const completedTasks = getTasksByStatus('completed')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-mea-blue text-white px-4 py-4 shadow-md">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">MEA CLL Task Board</h1>
            <p className="text-blue-200 text-xs mt-0.5">Michigan Education Association</p>
          </div>
          <button
            onClick={() => openNewTask('immediate')}
            className="flex items-center gap-2 bg-mea-gold text-gray-900 font-semibold text-sm px-4 py-2 rounded-xl hover:brightness-110 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </header>

      {/* Board */}
      <main className="flex-1 p-4 max-w-screen-xl mx-auto w-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {isMobile ? (
            <div className="flex flex-col gap-2 pb-6">
              {COLUMNS.map((col) => (
                <Column
                  key={col.id}
                  column={col}
                  tasks={getTasksByStatus(col.id)}
                  onCardClick={(task) => setModalTask(task)}
                  onAddClick={() => openNewTask(col.id)}
                  isMobile={true}
                  landedId={landedId}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 pb-6">
              {COLUMNS.map((col) => (
                <Column
                  key={col.id}
                  column={col}
                  tasks={getTasksByStatus(col.id)}
                  onCardClick={(task) => setModalTask(task)}
                  onAddClick={() => openNewTask(col.id)}
                  isMobile={false}
                  landedId={landedId}
                />
              ))}
            </div>
          )}

          <DragOverlay dropAnimation={null}>
            {activeTask && (
              <div className="w-72">
                <TaskCard
                  task={activeTask}
                  column={COLUMN_MAP[activeTask.status] ?? COLUMNS[0]}
                  overlay
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>

        <CompletedDrawer
          tasks={completedTasks}
          onRestore={(id) => moveTask(id, 'follow_up')}
          onDelete={deleteTask}
        />
      </main>

      {/* Floating add button (mobile only) */}
      {isMobile && (
        <button
          onClick={() => openNewTask('immediate')}
          className="fixed bottom-6 right-6 bg-mea-blue text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all z-40"
        >
          <Plus size={26} />
        </button>
      )}

      {modalTask !== undefined && (
        <TaskModal
          task={modalTask}
          defaultStatus={defaultStatus}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModalTask(undefined)}
        />
      )}
    </div>
  )
}
