import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

// GET: Get like count and user's like status for a post
export const GET: APIRoute = async ({ request }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ count: 0, liked: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(request.url);
    const postSlug = url.searchParams.get('slug');
    const userId = url.searchParams.get('userId');

    if (!postSlug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get total like count
    const { count, error: countError } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_slug', postSlug);

    if (countError) throw countError;

    // Check if user liked this post
    let liked = false;
    if (userId) {
      const { data: userLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_slug', postSlug)
        .eq('user_id', userId)
        .single();

      liked = !!userLike;
    }

    return new Response(JSON.stringify({ count: count || 0, liked }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching post likes:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch likes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST: Toggle like on a post
export const POST: APIRoute = async ({ request }) => {
  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Database unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { postSlug, userId } = body;

    if (!postSlug || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user already liked this post
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_slug', postSlug)
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Unlike: delete the like
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_slug', postSlug)
        .eq('user_id', userId);

      if (error) throw error;

      // Get new count
      const { count } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_slug', postSlug);

      return new Response(JSON.stringify({ liked: false, count: count || 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // Like: insert new like
      const { error } = await supabase.from('post_likes').insert({
        post_slug: postSlug,
        user_id: userId,
      });

      if (error) throw error;

      // Get new count
      const { count } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_slug', postSlug);

      return new Response(JSON.stringify({ liked: true, count: count || 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error toggling post like:', error);
    return new Response(JSON.stringify({ error: 'Failed to toggle like' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
