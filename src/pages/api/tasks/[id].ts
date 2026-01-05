import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const prerender = false

function isAuthenticated(cookies: { get: (name: string) => { value: string } | undefined }): boolean {
  const session = cookies.get('tasks_session')
  return !!session?.value
}

// PATCH: Update a task
export const PATCH: APIRoute = async ({ params, cookies, request }) => {
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

  const { id } = params

  if (!id) {
    return new Response(JSON.stringify({ error: 'Task ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    const updates: Record<string, unknown> = {}

    // Only include fields that were provided
    if (body.description !== undefined) updates.description = body.description.trim()
    if (body.due_date !== undefined) updates.due_date = body.due_date || null
    if (body.priority !== undefined) {
      if (body.priority < 1 || body.priority > 5) {
        return new Response(JSON.stringify({ error: 'Priority must be between 1 and 5' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      updates.priority = body.priority
    }
    if (body.estimated_minutes !== undefined) updates.estimated_minutes = body.estimated_minutes
    if (body.domain !== undefined) {
      if (!['career', 'school', 'life'].includes(body.domain)) {
        return new Response(JSON.stringify({ error: 'Domain must be career, school, or life' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      updates.domain = body.domain
    }
    if (body.area !== undefined) updates.area = body.area || null
    if (body.completion_criteria !== undefined) updates.completion_criteria = body.completion_criteria?.trim() || null
    if (body.resources !== undefined) updates.resources = body.resources?.trim() || null
    if (body.completed_at !== undefined) updates.completed_at = body.completed_at

    if (Object.keys(updates).length === 0) {
      return new Response(JSON.stringify({ error: 'No updates provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ task: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error updating task:', error)
    return new Response(JSON.stringify({ error: 'Failed to update task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// DELETE: Delete a task
export const DELETE: APIRoute = async ({ params, cookies }) => {
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

  const { id } = params

  if (!id) {
    return new Response(JSON.stringify({ error: 'Task ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
