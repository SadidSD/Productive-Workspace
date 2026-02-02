const { Client } = require('pg');

const connectionString = 'postgresql://postgres.sxnhywghloehbeiansht:itsyourSD@123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();

        console.log('--- VERIFYING PROFILES DATA ---');
        const res = await client.query(`
            SELECT id, full_name, email 
            FROM profiles 
            LIMIT 5;
        `);
        console.table(res.rows);

    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        await client.end();
    }
}

run();
