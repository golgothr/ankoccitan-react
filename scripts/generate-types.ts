import { createClient } from '@supabase/supabase-js';
import { generateTypes } from 'supabase-typegen';

const generateSupabaseTypes = async () => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await generateTypes(supabase, {
    schema: 'public',
    outFile: 'src/types/supabase.ts',
  });

  process.stdout.write('Types Supabase générés avec succès\n');
};

generateSupabaseTypes();
