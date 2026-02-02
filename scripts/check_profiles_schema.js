const { Client } = require('pg');

const connectionString = 'postgresql://postgres.sxnhywghloehbeiansht:itsyourSD@123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();

        console.log('--- PROFILES TABLE COLUMNS ---');
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'profiles';
        `);
        res.rows.forEach(r => console.log(r.column_name));

    } catch (err) {
        console.error('Audit failed:', err);
    } finally {
        await client.end();
    }
}

run();
