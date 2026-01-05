import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json()
  const { password } = body

  const correctPassword = import.meta.env.TASKS_PASSWORD

  if (!correctPassword) {
    return new Response(JSON.stringify({ error: 'Server not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (password === correctPassword) {
    // Set a simple session cookie (24 hour expiry)
    const token = btoa(`tasks_auth_${Date.now()}`)
    cookies.set('tasks_session', token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ error: 'Invalid password' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}
