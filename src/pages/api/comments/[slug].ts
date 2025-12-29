import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';
import { checkSpam, sanitizeContent, sanitizeName } from '@/lib/spam';

export const prerender = false;

interface Comment {
  id: string;
  post_slug: string;
  parent_id: string | null;
  author_name: string;
  author_id: string;
  content: string;
  created_at: string;
  like_count?: number;
  replies?: Comment[];
}

// GET: Fetch comments for a post
export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!supabase) {
    return new Response(JSON.stringify({ comments: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get user_id from query params to check if they liked comments
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    // Fetch all approved comments for this post
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_slug', slug)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Fetch like counts for all comments
    const commentIds = (comments || []).map((c: Comment) => c.id);

    let likeCounts: Record<string, number> = {};
    let userLikes: Set<string> = new Set();

    if (commentIds.length > 0) {
      // Run like queries in parallel
      const [likesResult, userLikesResult] = await Promise.all([
        supabase.from('comment_likes').select('comment_id').in('comment_id', commentIds),
        userId
          ? supabase.from('comment_likes').select('comment_id').eq('user_id', userId).in('comment_id', commentIds)
          : Promise.resolve({ data: null }),
      ]);

      if (!likesResult.error && likesResult.data) {
        likeCounts = likesResult.data.reduce((acc: Record<string, number>, like: { comment_id: string }) => {
          acc[like.comment_id] = (acc[like.comment_id] || 0) + 1;
          return acc;
        }, {});
      }

      if (userLikesResult.data) {
        userLikes = new Set(userLikesResult.data.map((l: { comment_id: string }) => l.comment_id));
      }
    }

    // Organize into threaded structure
    const topLevel: Comment[] = [];
    const replies: Record<string, Comment[]> = {};

    for (const comment of comments || []) {
      const enrichedComment = {
        ...comment,
        like_count: likeCounts[comment.id] || 0,
        user_liked: userLikes.has(comment.id),
      };

      if (comment.parent_id) {
        if (!replies[comment.parent_id]) {
          replies[comment.parent_id] = [];
        }
        replies[comment.parent_id].push(enrichedComment);
      } else {
        topLevel.push(enrichedComment);
      }
    }

    // Attach replies to parent comments
    const threaded = topLevel.map((comment) => ({
      ...comment,
      replies: replies[comment.id] || [],
    }));

    return new Response(JSON.stringify({ comments: threaded }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST: Create a new comment
export const POST: APIRoute = async ({ params, request }) => {
  const { slug } = params;

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Slug is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!supabase) {
    return new Response(JSON.stringify({ error: 'Database unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { authorName, authorId, content, parentId } = body;

    // Validate required fields
    if (!authorName || !authorId || !content) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sanitize inputs
    const cleanName = sanitizeName(authorName);
    const cleanContent = sanitizeContent(content);

    // Check for spam
    const spamCheck = checkSpam(cleanContent, cleanName);

    // Insert comment
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_slug: slug,
        parent_id: parentId || null,
        author_name: cleanName,
        author_id: authorId,
        content: cleanContent,
        is_flagged: spamCheck.isSpam,
        is_approved: !spamCheck.isSpam,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        comment: data,
        flagged: spamCheck.isSpam,
        reasons: spamCheck.reasons,
        message: spamCheck.isSpam
          ? 'Your comment has been submitted for review'
          : 'Comment posted successfully',
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return new Response(JSON.stringify({ error: 'Failed to create comment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
