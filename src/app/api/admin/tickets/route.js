import { NextResponse } from 'next/server';
import { pool } from '@/db/db';

export async function GET(req) {
  try {
    const queryText = `
      SELECT * FROM public_feedback_tickets_view
    `;
    const result = await pool.query(queryText);
    console.log(result);

    return NextResponse.json({ data: result[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ message: "Failed to fetch tickets", error: error.message }, { status: 500 });
  }
}