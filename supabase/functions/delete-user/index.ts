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
    console.log('Deactivate user function called')
    
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
    console.log('Attempting to deactivate user:', userId)

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

    console.log('User found, handling dependencies')

    // Update any documents uploaded by this user to set uploaded_by to null
    const { error: documentsError } = await supabaseClient
      .from('client_documents')
      .update({ uploaded_by: null })
      .eq('uploaded_by', userId)

    if (documentsError) {
      console.error('Error updating documents:', documentsError)
      throw documentsError
    }

    // Update user activities to set user_id to null
    const { error: activitiesError } = await supabaseClient
      .from('user_activities')
      .update({ user_id: null })
      .eq('user_id', userId)

    if (activitiesError) {
      console.error('Error updating activities:', activitiesError)
      throw activitiesError
    }

    console.log('Dependencies handled, proceeding with profile deactivation')

    // Update profile to mark as deactivated
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({ is_active: false })
      .eq('id', userId)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      throw profileError
    }

    console.log('Profile marked as inactive')

    // Delete auth user to prevent future logins
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError)
      throw deleteError
    }

    console.log('Auth user deleted successfully, user can no longer login:', userId)

    return new Response(
      JSON.stringify({ message: 'User deactivated successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in deactivate-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})