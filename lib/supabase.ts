import { createClient } from '@supabase/supabase-js';

// Kita memanggil nama variabel yang ada di .env.local
// Tanda seru (!) di akhir sangat penting untuk memberitahu TypeScript bahwa nilainya "pasti ada" (bukan undefined)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);