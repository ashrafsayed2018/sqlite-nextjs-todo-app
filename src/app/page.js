'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState({ name: '', description: '' })
  const [isLoading, setIsLoading] = useState(true) // Add a loading state

  // Fetch TODOs from the API
  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch('/api/todo')
        const data = await response.json()
        setTodos(data)
      } catch (error) {
        console.error('Failed to fetch todos:', error)
      } finally {
        setIsLoading(false) // Loading complete
      }
    }

    fetchTodos()
  }, [])

  async function handleAddTodo(e) {
    e.preventDefault()
    if (!newTodo.name || !newTodo.description) {
      alert('Please fill out both fields')
      return
    }

    const response = await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    })

    if (response.ok) {
      const todo = await response.json()
      setTodos([...todos, todo])
      setNewTodo({ name: '', description: '' })
    } else {
      console.error('Failed to add TODO')
    }
  }

  async function handleComplete(id, isCompleted) {
    const response = await fetch('/api/todo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_completed: !isCompleted }),
    })

    if (response.ok) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, is_completed: !isCompleted } : todo
        )
      )
    } else {
      console.error('Failed to update TODO')
    }
  }

  async function handleDelete(id) {
    const response = await fetch(`/api/todo?id=${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setTodos(todos.filter((todo) => todo.id !== id))
    } else {
      console.error('Failed to delete TODO')
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">TODO List</h1>

      {isLoading ? (
        <p>Loading...</p> // Show loading state
      ) : (
        <>
          {/* Form to add a new TODO */}
          <form
            onSubmit={handleAddTodo}
            className="mb-8 bg-white p-6 shadow rounded-lg"
          >
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter task name"
                value={newTodo.name}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, name: e.target.value })
                }
                className="w-full px-4 py-2 text-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Enter task description"
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
                className="w-full px-4 py-2 text-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add TODO
            </button>
          </form>

          {/* TODO List */}
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`p-4 border rounded-lg shadow ${
                  todo.is_completed ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                <h2 className="font-semibold text-lg text-gray-800">
                  {todo.name}
                </h2>
                <p className="text-gray-600">{todo.description}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleComplete(todo.id, todo.is_completed)}
                    className={`px-4 py-2 rounded-lg text-white ${
                      todo.is_completed
                        ? 'bg-gray-500 hover:bg-gray-600'
                        : 'bg-green-500 hover:bg-green-600'
                    } transition`}
                  >
                    {todo.is_completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
