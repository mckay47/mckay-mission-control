import { supabase } from './supabase.ts'

export function useTodoActions() {
  const addTodo = async (projectId: string | null, title: string, priority: 'P1' | 'P2' | 'P3', due?: string) => {
    // Get max sort_order for this scope
    const query = supabase
      .from('todos')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)

    if (projectId) {
      query.eq('project_id', projectId)
    } else {
      query.is('project_id', null)
    }

    const { data: existing } = await query

    const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1

    const row: Record<string, unknown> = {
      title,
      priority,
      status: 'open',
      description: '',
      agent: '',
      duration: '',
      sort_order: nextOrder,
    }
    if (projectId) row.project_id = projectId
    if (due) row.due = due

    await supabase.from('todos').insert(row)

    // Sync back to TODOS.md (only for project todos)
    if (projectId) {
      fetch('/api/todos/sync-to-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId }),
      }).catch(() => {})
    }
  }

  const setStatus = async (todoId: string, status: 'open' | 'in-progress' | 'done', projectId?: string | null) => {
    await supabase.from('todos').update({ status }).eq('id', todoId)

    if (projectId) {
      fetch('/api/todos/sync-to-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId }),
      }).catch(() => {})
    }
  }

  const deleteTodo = async (todoId: string, projectId?: string | null) => {
    await supabase.from('todos').delete().eq('id', todoId)

    if (projectId) {
      fetch('/api/todos/sync-to-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId }),
      }).catch(() => {})
    }
  }

  return { addTodo, setStatus, deleteTodo }
}
