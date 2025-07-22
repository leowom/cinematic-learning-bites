import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UserToImport {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
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

    const { users, sessionId, initiatedBy } = await req.json()

    if (!users || !Array.isArray(users) || users.length === 0) {
      throw new Error('Users array is required and must not be empty')
    }

    // Update session status to processing
    await supabaseClient
      .from('bulk_import_sessions')
      .update({ status: 'processing' })
      .eq('id', sessionId)

    let successCount = 0
    let failureCount = 0
    const errors: string[] = []

    for (const userData of users as UserToImport[]) {
      try {
        const { email, first_name, last_name, role = 'student' } = userData

        if (!email || !email.includes('@')) {
          throw new Error(`Invalid email: ${email}`)
        }

        // Check if user already exists
        const { data: existingUser } = await supabaseClient.auth.admin.getUserByEmail(email)
        
        if (existingUser.user) {
          errors.push(`User already exists: ${email}`)
          failureCount++
          continue
        }

        // Create user account
        const tempPassword = crypto.randomUUID()
        
        const { data: newUser, error: createError } = await supabaseClient.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            first_name,
            last_name,
            role,
            bulk_imported: true,
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
            first_name: first_name || email.split('@')[0],
            last_name: last_name || '',
            role: role
          }])

        if (profileError) {
          throw profileError
        }

        // Send password reset email
        await supabaseClient.auth.admin.generateLink({
          type: 'recovery',
          email,
        })

        successCount++

      } catch (error) {
        failureCount++
        errors.push(`Failed to import ${userData.email}: ${error.message}`)
      }
    }

    // Update session with results
    const { error: updateError } = await supabaseClient
      .from('bulk_import_sessions')
      .update({
        status: 'completed',
        successful_imports: successCount,
        failed_imports: failureCount,
        error_log: errors,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId)

    if (updateError) {
      console.error('Session update error:', updateError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        results: {
          total: users.length,
          successful: successCount,
          failed: failureCount,
          errors: errors
        },
        message: `Import completed: ${successCount} successful, ${failureCount} failed`
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