import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://erqoflrvbrryrkxbaxzq.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVycW9mbHJ2YnJyeXJreGJheHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODY0NzIsImV4cCI6MjA5MjE2MjQ3Mn0.ScDVuLWVyUsX5Q6WWRyjaOcrlK4s9oa5fMGKQ_n7Of0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
