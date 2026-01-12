import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const prerender = false

function isAuthenticated(cookies: { get: (name: string) => { value: string } | undefined }): boolean {
  const session = cookies.get('tasks_session')
  return !!session?.value
}

// GET: Fetch subtasks for a task
export const GET: APIRoute = async ({ cookies, url }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Database unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const taskId = url.searchParams.get('task_id')

    let query = supabase
      .from('subtasks')
      .select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: true })

    if (taskId) {
      query = query.eq('task_id', taskId)
    }

    const { data, error } = await query

    if (error) throw error

    return new Response(JSON.stringify({ subtasks: data || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching subtasks:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch subtasks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// POST: Create a new subtask
export const POST: APIRoute = async ({ cookies, request }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Database unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    const { task_id, description } = body

    if (!task_id || !description) {
      return new Response(JSON.stringify({ error: 'task_id and description are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get current max position for this task
    const { data: existing } = await supabase
      .from('subtasks')
      .select('position')
      .eq('task_id', task_id)
      .order('position', { ascending: false })
      .limit(1)

    const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0

    const { data, error } = await supabase
      .from('subtasks')
      .insert({
        task_id,
        description: description.trim(),
        position: nextPosition,
      })
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ subtask: data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating subtask:', error)
    return new Response(JSON.stringify({ error: 'Failed to create subtask' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// PATCH: Update a subtask
export const PATCH: APIRoute = async ({ cookies, request }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Database unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return new Response(JSON.stringify({ error: 'Subtask ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const updates: Record<string, unknown> = {}

    if (body.description !== undefined) updates.description = body.description.trim()
    if (body.completed !== undefined) updates.completed = body.completed
    if (body.position !== undefined) updates.position = body.position

    if (Object.keys(updates).length === 0) {
      return new Response(JSON.stringify({ error: 'No updates provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data, error } = await supabase
      .from('subtasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ subtask: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error updating subtask:', error)
    return new Response(JSON.stringify({ error: 'Failed to update subtask' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// DELETE: Delete a subtask
export const DELETE: APIRoute = async ({ cookies, request }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Database unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return new Response(JSON.stringify({ error: 'Subtask ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', id)

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error deleting subtask:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete subtask' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
