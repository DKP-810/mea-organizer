import { useTasks } from './hooks/useTasks'
import { Board } from './components/Board'

export default function App() {
  const { tasks, loading, addTask, updateTask, deleteTask, moveTask, reorderTasks } = useTasks()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading board...</p>
        </div>
      </div>
    )
  }

  return (
    <Board
      tasks={tasks}
      addTask={addTask}
      updateTask={updateTask}
      deleteTask={deleteTask}
      moveTask={moveTask}
      reorderTasks={reorderTasks}
    />
  )
}
