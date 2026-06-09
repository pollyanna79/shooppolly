import { createClient } from '@supabase/supabase-js';

// Cole sua Project URL aqui:
const supabaseUrl = 'https://wdvtuvohucyndqjnfpyh.supabase.co';

// Cole sua chave anon (a que você acabou de me enviar):
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdnR1dm9odWN5bmRxam5mcHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNDk3ODgsImV4cCI6MjA4NjgyNTc4OH0.0Ep0zGoh_OJhPqVKZPhWjxL7CG26uuAJx7tGB5eeODM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
