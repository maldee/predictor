import { neon } from '@neondatabase/serverless';

const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isTime = (value) => value === '' || /^\d{2}:\d{2}$/.test(value);
const isId = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const getDatabase = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.includes('user:password@host')) {
    const error = new Error('DATABASE_URL is not configured.');
    error.code = 'DATABASE_CONFIG';
    throw error;
  }
  return neon(databaseUrl);
};

const databaseErrorResponse = (error, action) => {
  console.error(`Life ${action} failed:`, error);
  const message = error.code === 'DATABASE_CONFIG'
    ? 'DATABASE_URL is not configured.'
    : 'Unable to connect to the life database. Make sure db/schema.sql has been run in Neon.';
  return Response.json({ error: message }, { status: 503 });
};

export async function GET() {
  try {
    const sql = getDatabase();
    const entries = await sql`
      SELECT id, title, date::text, time::text, comment AS comments
      FROM life
      ORDER BY date DESC, time DESC NULLS LAST, created_at DESC
    `;
    return Response.json(entries);
  } catch (error) {
    return databaseErrorResponse(error, 'load');
  }
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const date = typeof body.date === 'string' ? body.date : '';
  const time = typeof body.time === 'string' ? body.time : '';
  const comments = typeof body.comments === 'string' ? body.comments.trim() : '';

  if (!title || !isDate(date) || !isTime(time)) {
    return Response.json({ error: 'Title and a valid date are required.' }, { status: 400 });
  }

  try {
    const sql = getDatabase();
    const [entry] = await sql`
      INSERT INTO life (title, date, time, comment)
      VALUES (${title}, ${date}, ${time || null}, ${comments})
      RETURNING id, title, date::text, time::text, comment AS comments
    `;
    return Response.json(entry, { status: 201 });
  } catch (error) {
    return databaseErrorResponse(error, 'save');
  }
}

export async function DELETE(request) {
  const id = new URL(request.url).searchParams.get('id');

  if (!id || !isId(id)) {
    return Response.json({ error: 'A valid life entry id is required.' }, { status: 400 });
  }

  try {
    const sql = getDatabase();
    const deleted = await sql`
      DELETE FROM life
      WHERE id = ${id}::uuid
      RETURNING id
    `;

    if (deleted.length === 0) {
      return Response.json({ error: 'Life entry not found.' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return databaseErrorResponse(error, 'delete');
  }
}
