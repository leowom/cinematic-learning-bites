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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, role = 'student', invitedBy } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    // Generate unique invite token
    const inviteToken = crypto.randomUUID()

    // Check if user already exists
    const { data: existingUser } = await supabaseClient.auth.admin.getUserByEmail(email)
    
    if (existingUser.user) {
      throw new Error('User already exists with this email')
    }

    // Create invitation record
    const { error: inviteError } = await supabaseClient
      .from('user_invitations')
      .insert([{
        email,
        role,
        invited_by: invitedBy,
        invite_token: inviteToken,
      }])

    if (inviteError) {
      throw inviteError
    }

    // Create user account with temporary password
    const tempPassword = crypto.randomUUID()
    
    const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        role,
        invited: true,
        temp_password: true
      }
    })

    if (createError) {
      throw createError
    }

    // Create profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert([{
        id: newUser.user!.id,
        first_name: email.split('@')[0],
        last_name: '',
        role: role
      }])

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }

    // Mark invitation as used
    const { error: updateInviteError } = await supabaseClient
      .from('user_invitations')
      .update({ used_at: new Date().toISOString() })
      .eq('invite_token', inviteToken)

    if (updateInviteError) {
      console.error('Invite update error:', updateInviteError)
    }

    // Send password reset email for first login
    const { error: resetError } = await supabaseClient.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    if (resetError) {
      console.error('Reset email error:', resetError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: newUser.user!.id,
          email: newUser.user!.email,
          role,
        },
        message: 'User invited successfully. They will receive a password reset email.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})