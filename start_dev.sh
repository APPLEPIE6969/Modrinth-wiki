export NEXT_PUBLIC_SUPABASE_URL="http://localhost:54321"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="test_key"
bun run dev > next_output.log 2>&1 &
echo $! > next_pid.txt
