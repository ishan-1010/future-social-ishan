import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const postId = params.id;
  const userId = user.id;

  // Check if the user has already liked the post
  const { data: existingLike, error: likeError } = await supabase
    .from("post_likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (likeError && likeError.code !== "PGRST116") {
    // PGRST116 means no rows found, which is fine.
    console.error("Error checking for like:", likeError);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }

  let userHasLiked = false;

  if (existingLike) {
    // User has liked, so unlike the post
    const { error: deleteError } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (deleteError) {
      console.error("Error unliking post:", deleteError);
      return new Response(JSON.stringify({ error: "Failed to unlike post" }), {
        status: 500,
      });
    }
    userHasLiked = false;
  } else {
    // User has not liked, so like the post
    const { error: insertError } = await supabase
      .from("post_likes")
      .insert({ post_id: postId, user_id: userId });

    if (insertError) {
      console.error("Error liking post:", insertError);
      return new Response(JSON.stringify({ error: "Failed to like post" }), {
        status: 500,
      });
    }
    userHasLiked = true;
  }

  // Get the new like count
  const { count, error: countError } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  if (countError) {
    console.error("Error counting likes:", countError);
    // We don't have to fail the whole request, but we can't return the new count
  }

  return new Response(
    JSON.stringify({
      like_count: count ?? 0,
      user_has_liked: userHasLiked,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
} 