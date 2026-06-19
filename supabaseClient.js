const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ytqaybfgmhlczjhnarjn.supabase.co';

// Your fully complete and correct anon key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cWF5YmZnbWhsY3pqaG5hcmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NDc1MzIsImV4cCI6MjA5NzQyMzUzMn0.v3G65zs6-ROKdhBT_awUYbk4Yfx2NX0at4z34Kn7dZc';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
