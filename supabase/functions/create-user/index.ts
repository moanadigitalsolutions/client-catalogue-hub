import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Create user function called')
    
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

    const { email, name, role } = await req.json()
    console.log('Creating user with details:', { email, name, role })

    if (!email || !name || !role) {
      throw new Error('email, name and role are required')
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8)

    // Create the user with admin API
    const { data: userData, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { name }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      throw createError
    }

    if (!userData.user) {
      throw new Error('No user data returned')
    }

    console.log('User created successfully:', userData.user.id)

    // Check if role already exists for user
    const { data: existingRole } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', userData.user.id)
      .single()

    if (!existingRole) {
      // Only assign role if one doesn't exist
      const { error: roleError } = await supabaseClient
        .from('user_roles')
        .insert({
          user_id: userData.user.id,
          role
        })

      if (roleError) {
        console.error('Error assigning role:', roleError)
        throw roleError
      }

      console.log('Role assigned successfully')
    } else {
      console.log('User already has a role assigned')
    }

    // Generate password reset link
    const { data: resetData, error: resetError } = await supabaseClient.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    if (resetError) {
      console.error('Error generating reset link:', resetError)
      throw resetError
    }

    console.log('Password reset link generated successfully')

    return new Response(
      JSON.stringify({ 
        message: 'User created successfully',
        userId: userData.user.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in create-user function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})