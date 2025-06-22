import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Use the new view 'posts_with_details' to get posts
  // This view includes like_count and user_has_liked
  const { data, error } = await supabase
    .from("posts_with_details")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { content, imageUrl } = await req.json();

  // Normalize empty image strings to null
  const sanitizedImageUrl =
    typeof imageUrl === "string" && imageUrl.trim() !== ""
      ? imageUrl.trim()
      : null;

  if (!content) {
    return new Response(JSON.stringify({ error: "Content is required" }), {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("posts")
    .insert([{ content, image_url: sanitizedImageUrl, author_id: user.id }])
    .select();

  if (error) {
    console.error("Error creating post:", error);
    return new Response(JSON.stringify({ error: "Failed to create post" }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
} 