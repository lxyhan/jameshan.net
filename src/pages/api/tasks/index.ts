import type { APIRoute } from 'astro'
import { supabase } from '@/lib/supabase'

export const prerender = false

function isAuthenticated(cookies: { get: (name: string) => { value: string } | undefined }): boolean {
  const session = cookies.get('tasks_session')
  return !!session?.value
}

// GET: Fetch all tasks
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
    const completed = url.searchParams.get('completed') === 'true'

    let query = supabase
      .from('tasks')
      .select('*')

    if (completed) {
      query = query.not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
    } else {
      query = query.is('completed_at', null)
        .order('due_date', { ascending: true, nullsFirst: false })
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
    }

    const { data, error } = await query

    if (error) throw error

    return new Response(JSON.stringify({ tasks: data || [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch tasks' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// POST: Create a new task
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
    const {
      description,
      due_date,
      priority,
      estimated_minutes,
      domain,
      area,
      completion_criteria,
      resources,
      completed_at,
    } = body

    if (!description || !priority || !estimated_minutes || !domain) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (priority < 1 || priority > 5) {
      return new Response(JSON.stringify({ error: 'Priority must be between 1 and 5' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!['career', 'school', 'life'].includes(domain)) {
      return new Response(JSON.stringify({ error: 'Domain must be career, school, or life' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        description: description.trim(),
        due_date: due_date || null,
        priority,
        estimated_minutes,
        domain,
        area: area || null,
        completion_criteria: completion_criteria?.trim() || null,
        resources: resources?.trim() || null,
        completed_at: completed_at || null,
      })
      .select()
      .single()

    if (error) throw error

    return new Response(JSON.stringify({ task: data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error creating task:', error)
    return new Response(JSON.stringify({ error: 'Failed to create task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
