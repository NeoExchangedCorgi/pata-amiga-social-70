
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the user making the request
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if the user is an admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.user_type !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { targetUserId } = await req.json();

    if (!targetUserId) {
      // Delete the current user's account (original functionality)
      const userId = user.id;

      // Delete user data in order (foreign key dependencies)
      await supabaseClient.from('notifications').delete().eq('user_id', userId);
      await supabaseClient.from('notifications').delete().eq('actor_id', userId);
      await supabaseClient.from('user_history').delete().eq('user_id', userId);
      await supabaseClient.from('post_views').delete().eq('user_id', userId);
      await supabaseClient.from('saved_posts').delete().eq('user_id', userId);
      await supabaseClient.from('post_reports').delete().eq('user_id', userId);
      await supabaseClient.from('post_likes').delete().eq('user_id', userId);
      await supabaseClient.from('hidden_posts').delete().eq('user_id', userId);
      await supabaseClient.from('hidden_profiles').delete().eq('user_id', userId);
      await supabaseClient.from('hidden_profiles').delete().eq('hidden_profile_id', userId);
      await supabaseClient.from('posts').delete().eq('author_id', userId);
      await supabaseClient.from('profiles').delete().eq('id', userId);

      // Delete from auth.users
      const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId);
      
      if (deleteError) {
        throw deleteError;
      }
    } else {
      // Admin deleting another user's account
      const { data: targetProfile, error: targetProfileError } = await supabaseClient
        .from('profiles')
        .select('user_type')
        .eq('id', targetUserId)
        .single();

      if (targetProfileError) {
        return new Response(
          JSON.stringify({ error: 'User not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Prevent admin from deleting another admin
      if (targetProfile.user_type === 'admin') {
        return new Response(
          JSON.stringify({ error: 'Cannot delete admin accounts' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Delete target user data in order (foreign key dependencies)
      await supabaseClient.from('notifications').delete().eq('user_id', targetUserId);
      await supabaseClient.from('notifications').delete().eq('actor_id', targetUserId);
      await supabaseClient.from('user_history').delete().eq('user_id', targetUserId);
      await supabaseClient.from('post_views').delete().eq('user_id', targetUserId);
      await supabaseClient.from('saved_posts').delete().eq('user_id', targetUserId);
      await supabaseClient.from('post_reports').delete().eq('user_id', targetUserId);
      await supabaseClient.from('post_likes').delete().eq('user_id', targetUserId);
      await supabaseClient.from('hidden_posts').delete().eq('user_id', targetUserId);
      await supabaseClient.from('hidden_profiles').delete().eq('user_id', targetUserId);
      await supabaseClient.from('hidden_profiles').delete().eq('hidden_profile_id', targetUserId);
      await supabaseClient.from('posts').delete().eq('author_id', targetUserId);
      await supabaseClient.from('profiles').delete().eq('id', targetUserId);

      // Delete from auth.users
      const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(targetUserId);
      
      if (deleteError) {
        throw deleteError;
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
