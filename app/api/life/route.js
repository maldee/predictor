import { neon } from '@neondatabase/serverless';

const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isTime = (value) => value === '' || /^\d{2}:\d{2}$/.test(value);
const getDatabase = () => {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured.');
  return neon(process.env.DATABASE_URL);
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
  } catch {
    return Response.json({ error: 'Unable to load life entries.' }, { status: 500 });
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
  } catch {
    return Response.json({ error: 'Unable to save life entry.' }, { status: 500 });
  }
}
