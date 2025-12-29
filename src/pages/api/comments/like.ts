import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

// POST: Toggle like on a comment
export const POST: APIRoute = async ({ request }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Database unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { commentId, userId } = body;

    if (!commentId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user already liked this comment
    const { data: existing } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Unlike: delete the like
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);

      if (error) throw error;

      return new Response(JSON.stringify({ liked: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Like: insert new like
      const { error } = await supabase.from('comment_likes').insert({
        comment_id: commentId,
        user_id: userId,
      });

      if (error) throw error;

      return new Response(JSON.stringify({ liked: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return new Response(JSON.stringify({ error: 'Failed to toggle like' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
