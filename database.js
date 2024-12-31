import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
async function openDB() {
  const db = await open({
    filename: './todo.db',
    driver: sqlite3.Database,
  })
  return db
}

export default openDB
