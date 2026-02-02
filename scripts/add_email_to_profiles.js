const { Client } = require('pg');

const connectionString = 'postgresql://postgres.sxnhywghloehbeiansht:itsyourSD@123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();

        // 1. Add email column
        console.log('Adding email column...');
        await client.query(`
            ALTER TABLE profiles 
            ADD COLUMN IF NOT EXISTS email TEXT;
        `);

        // 2. Update Trigger Function
        console.log('Updating handle_new_user trigger...');
        await client.query(`
            CREATE OR REPLACE FUNCTION public.handle_new_user()
            RETURNS trigger AS $$
            BEGIN
              INSERT INTO public.profiles (id, full_name, avatar_url, email)
              VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
              RETURN new;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
        `);

        // 3. Backfill Data (Needs explicit security definer function or direct SQL if user has access)
        // Since we are connected as postgres/admin, we can access auth.users directly via a DO block or function
        console.log('Backfilling emails...');
        await client.query(`
            DO $$
            BEGIN
                UPDATE public.profiles p
                SET email = u.email
                FROM auth.users u
                WHERE p.id = u.id AND p.email IS NULL;
            END $$;
        `);

        console.log('Migration successful.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

run();
