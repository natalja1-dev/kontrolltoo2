import React, { useEffect, useState } from 'react'

function Shops() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetch("http://localhost:8081/shops")
      .then((response) => response.json())
      .then((json) => setTodos(json))
  }, [])

  return (
    <div className="flex flex-col gap-4 pt-4">
      <h1 className="text-xl font-semibold">Shops</h1>

      {todos.slice(0, 20).map(todo => (
        <div key={todo.id} className="border p-4 rounded">
          <div>{todo.title}</div>
          <div>Completed: {todo.completed ? "Yes" : "No"}</div>
        </div>
      ))}
    </div>
  )
}

export default Shops