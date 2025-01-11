import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Delete user function called')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { userId } = await req.json()
    console.log('Attempting to delete user:', userId)

    if (!userId) {
      throw new Error('userId is required')
    }

    // First check if user exists
    const { data: user, error: userError } = await supabaseClient.auth.admin.getUserById(userId)
    
    if (userError || !user) {
      console.error('Error finding user:', userError)
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    console.log('User found, proceeding with deletion')

    // Delete in correct order to maintain referential integrity
    // 1. First delete user_activities
    const { error: activitiesError } = await supabaseClient
      .from('user_activities')
      .delete()
      .eq('user_id', userId)

    if (activitiesError) {
      console.error('Error deleting user activities:', activitiesError)
      throw activitiesError
    }

    console.log('User activities deleted successfully')

    // 2. Delete from user_roles
    const { error: rolesError } = await supabaseClient
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    if (rolesError) {
      console.error('Error deleting user roles:', rolesError)
      throw rolesError
    }

    console.log('User roles deleted successfully')

    // 3. Delete from profiles
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting profile:', profileError)
      throw profileError
    }

    console.log('Profile deleted successfully')

    // 4. Finally delete the auth user
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError)
      throw deleteError
    }

    console.log('User deleted successfully:', userId)

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in delete-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})