import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, name, role } = await req.json()

    // Check if user exists in auth.users
    const { data: existingAuthUser } = await supabase.auth.admin.listUsers({
      filter: { email }
    })

    const existingUser = existingAuthUser?.users?.[0]

    // Check profiles table
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser || existingProfile) {
      if (existingProfile && !existingProfile.is_active) {
        // Reactivate user
        if (existingUser?.id) {
          await supabase.auth.admin.updateUserById(existingUser.id, {
            password,
            email_confirm: true
          })
        } else {
          // Create new auth user if it doesn't exist
          const { data: newAuthUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
          })
          if (createError) throw createError
        }

        // Update profile
        await supabase
          .from('profiles')
          .update({ 
            is_active: true,
            name,
            email 
          })
          .eq('email', email)

        // Update or create role
        if (existingProfile.id) {
          await supabase
            .from('user_roles')
            .upsert({
              user_id: existingProfile.id,
              role
            })
        }

        return new Response(
          JSON.stringify({ success: true, reactivated: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      throw new Error('User already exists and is active')
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createError) throw createError

    // Profile and role will be created by triggers
    return new Response(
      JSON.stringify({ success: true, userId: newUser.user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})