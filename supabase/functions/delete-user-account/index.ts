
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a client with the user's JWT to verify the user
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader }
        }
      }
    )

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser()
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = user.id

    // Delete user data in the correct order to avoid foreign key constraints
    console.log('Starting deletion process for user:', userId)

    // Delete notifications where user is actor or recipient
    await supabaseAdmin.from('notifications').delete().eq('user_id', userId)
    await supabaseAdmin.from('notifications').delete().eq('actor_id', userId)

    // Delete post interactions
    await supabaseAdmin.from('post_likes').delete().eq('user_id', userId)
    await supabaseAdmin.from('post_views').delete().eq('user_id', userId)
    await supabaseAdmin.from('post_reports').delete().eq('user_id', userId)
    await supabaseAdmin.from('saved_posts').delete().eq('user_id', userId)

    // Delete comments by the user
    await supabaseAdmin.from('comments').delete().eq('author_id', userId)

    // Delete posts by the user
    await supabaseAdmin.from('posts').delete().eq('author_id', userId)

    // Delete hidden profiles relationships
    await supabaseAdmin.from('hidden_profiles').delete().eq('user_id', userId)
    await supabaseAdmin.from('hidden_profiles').delete().eq('hidden_profile_id', userId)

    // Delete user profile
    await supabaseAdmin.from('profiles').delete().eq('id', userId)

    // Finally, delete the auth user account
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (deleteError) {
      console.error('Error deleting auth user:', deleteError)
      return new Response(
        JSON.stringify({ error: 'Failed to delete user account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('User account deleted successfully:', userId)

    return new Response(
      JSON.stringify({ success: true, message: 'User account deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in delete-user-account function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
