import openDB from '../../../../database'

export async function GET() {
  const db = await openDB()
  const todos = await db.all('SELECT * FROM todo')
  return new Response(JSON.stringify(todos), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// post route handler

export async function POST(request) {
  const { name, description } = await request.json()

  if (!name || !description) {
    return new Response(
      JSON.stringify({ error: 'Name and description are required' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } else {
    const db = await openDB()
    const result = await db.run(
      'INSERT INTO todo (name, description) VALUES (?, ?)',
      [name, description]
    )
    return new Response(
      JSON.stringify({
        id: result.lastID,
        name: name,
        description: description,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// patch route handler

export async function PATCH(request) {
  const { id, is_completed } = await request.json()
  const db = await openDB()
  // check id not exists and is_completed is boolean
  if (
    !id ||
    typeof is_completed !== 'boolean' ||
    typeof is_completed === 'undefined'
  ) {
    return new Response(
      JSON.stringify({ error: 'Id and is_completed are required' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } else {
    const result = await db.run(
      'UPDATE todo SET is_completed = ? WHERE id = ?',
      [is_completed, id]
    )
    return new Response(
      JSON.stringify({
        id: id,
        is_completed: is_completed,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// delete route handler

export async function DELETE(request) {
  const db = await openDB()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'ID is required for deletion.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  await db.run('DELETE FROM todo WHERE id = ?', [id])
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
