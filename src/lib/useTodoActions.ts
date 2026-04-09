import { supabase } from './supabase.ts'

export function useTodoActions() {
  const addTodo = async (projectId: string, title: string, priority: 'P1' | 'P2' | 'P3') => {
    // Get max sort_order for this project
    const { data: existing } = await supabase
      .from('todos')
      .select('sort_order')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: false })
      .limit(1)

    const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1

    await supabase.from('todos').insert({
      project_id: projectId,
      title,
      priority,
      status: 'open',
      description: '',
      agent: '',
      duration: '',
      sort_order: nextOrder,
    })

    // Sync back to TODOS.md
    fetch('/api/todos/sync-to-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId }),
    }).catch(() => {})
  }

  const setStatus = async (todoId: string, status: 'open' | 'in-progress' | 'done', projectId: string) => {
    await supabase.from('todos').update({ status }).eq('id', todoId)

    fetch('/api/todos/sync-to-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId }),
    }).catch(() => {})
  }

  const deleteTodo = async (todoId: string, projectId: string) => {
    await supabase.from('todos').delete().eq('id', todoId)

    fetch('/api/todos/sync-to-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: projectId }),
    }).catch(() => {})
  }

  return { addTodo, setStatus, deleteTodo }
}
