import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabaseUrl = 'https://hklzyngsvflxvcxflqhe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrbHp5bmdzdmZseHZjeGZscWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzNTE1NjEsImV4cCI6MjEwODkyNzU2MX0.oed8Uk-8Rxg6QEHBhoPoxD6F_oIIBZY7hvdPK0ULKso'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase