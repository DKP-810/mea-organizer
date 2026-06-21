import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        // sort by order field client-side so we don't need a composite index
        docs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        setTasks(docs)
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error:', err)
        setLoading(false)
      }
    )
    return unsub
  }, [])

  async function addTask(data) {
    const tasksInColumn = tasks.filter((t) => t.status === data.status)
    await addDoc(collection(db, 'tasks'), {
      ...data,
      order: tasksInColumn.length,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  async function updateTask(id, data) {
    await updateDoc(doc(db, 'tasks', id), {
      ...data,
      updatedAt: serverTimestamp(),
    })
  }

  async function deleteTask(id) {
    await deleteDoc(doc(db, 'tasks', id))
  }

  async function moveTask(id, newStatus) {
    const tasksInTarget = tasks.filter((t) => t.status === newStatus)
    await updateDoc(doc(db, 'tasks', id), {
      status: newStatus,
      order: tasksInTarget.length,
      updatedAt: serverTimestamp(),
    })
  }

  async function reorderTasks(orderedIds, status) {
    await Promise.all(
      orderedIds.map((id, index) =>
        updateDoc(doc(db, 'tasks', id), { order: index, updatedAt: serverTimestamp() })
      )
    )
  }

  return { tasks, loading, addTask, updateTask, deleteTask, moveTask, reorderTasks }
}
