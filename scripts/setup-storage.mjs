/**
 * Creates the Supabase Storage bucket used for uploaded images, plus the RLS
 * policies the app needs (public read, authenticated write).
 *
 * Supabase stores buckets and policies in Postgres, so this does the same thing
 * as clicking through Dashboard → Storage → New bucket → Policies.
 *
 * Safe to re-run: the bucket is upserted and policies are dropped first.
 *
 *   npm run setup:storage
 */
import pg from "pg";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "media";
const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error("✖ DIRECT_URL (or DATABASE_URL) is not set — check your .env");
  process.exit(1);
}

const POLICIES = [
  {
    name: `public_read_${BUCKET}`,
    sql: `create policy "public_read_${BUCKET}" on storage.objects
            for select to public using (bucket_id = '${BUCKET}')`,
  },
  {
    name: `authenticated_insert_${BUCKET}`,
    sql: `create policy "authenticated_insert_${BUCKET}" on storage.objects
            for insert to authenticated with check (bucket_id = '${BUCKET}')`,
  },
  {
    name: `authenticated_update_${BUCKET}`,
    sql: `create policy "authenticated_update_${BUCKET}" on storage.objects
            for update to authenticated using (bucket_id = '${BUCKET}')`,
  },
  {
    name: `authenticated_delete_${BUCKET}`,
    sql: `create policy "authenticated_delete_${BUCKET}" on storage.objects
            for delete to authenticated using (bucket_id = '${BUCKET}')`,
  },
];

const client = new pg.Client({ connectionString });
await client.connect();

try {
  // Public bucket: images and the resume PDF are referenced directly by URL
  // (<img src>, the RESUME button's href), so they must be readable without a
  // signed URL.
  await client.query(
    `insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
     values ($1, $1, true, 10485760,
             array['image/png','image/jpeg','image/jpg','image/gif','image/webp','image/svg+xml','application/pdf'])
     on conflict (id) do update
       set public = true,
           file_size_limit = excluded.file_size_limit,
           allowed_mime_types = excluded.allowed_mime_types`,
    [BUCKET]
  );
  console.log(`✔ bucket "${BUCKET}" ready (public, 10MB limit, images + PDF)`);

  for (const policy of POLICIES) {
    await client.query(`drop policy if exists "${policy.name}" on storage.objects`);
    await client.query(policy.sql);
    console.log(`✔ policy "${policy.name}"`);
  }

  const { rows } = await client.query(
    `select id, public, file_size_limit from storage.buckets where id = $1`,
    [BUCKET]
  );
  console.log("\nDone:", rows[0]);
} finally {
  await client.end();
}
