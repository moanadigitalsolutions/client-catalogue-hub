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

    // First check if user exists and is an admin
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

    // Instead of updating client_activities, we'll keep the records for audit purposes
    // Update user_activities to set user_id to null where possible
    const { error: userActivitiesError } = await supabaseClient
      .from('user_activities')
      .update({ user_id: null })
      .eq('user_id', userId)

    if (userActivitiesError) {
      console.error('Error updating user activities:', userActivitiesError)
      throw userActivitiesError
    }

    // Update client_deletion_requests to set requested_by and reviewed_by to null
    const { error: clientDeletionRequestsError } = await supabaseClient
      .from('client_deletion_requests')
      .update({ 
        requested_by: null,
        reviewed_by: null 
      })
      .or(`requested_by.eq.${userId},reviewed_by.eq.${userId}`)

    if (clientDeletionRequestsError) {
      console.error('Error updating client deletion requests:', clientDeletionRequestsError)
      throw clientDeletionRequestsError
    }

    // Update document_deletion_requests to set requested_by and reviewed_by to null
    const { error: docDeletionRequestsError } = await supabaseClient
      .from('document_deletion_requests')
      .update({ 
        requested_by: null,
        reviewed_by: null 
      })
      .or(`requested_by.eq.${userId},reviewed_by.eq.${userId}`)

    if (docDeletionRequestsError) {
      console.error('Error updating document deletion requests:', docDeletionRequestsError)
      throw docDeletionRequestsError
    }

    // Delete user's report templates
    const { error: reportTemplatesError } = await supabaseClient
      .from('report_templates')
      .delete()
      .eq('user_id', userId)

    if (reportTemplatesError) {
      console.error('Error deleting report templates:', reportTemplatesError)
      throw reportTemplatesError
    }

    // Delete user's role
    const { error: userRolesError } = await supabaseClient
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    if (userRolesError) {
      console.error('Error deleting user roles:', userRolesError)
      throw userRolesError
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
