import { NextResponse } from 'next/server';
import { pool } from '@/db/db';

//GET a single ticket
export async function GET(req, { params }) {
  const { ticketId } = params;
  try {
    const queryText = `
      SELECT * FROM public_feedback_tickets_view WHERE ticket_id = ?
    `;

    const result = await pool.query(queryText, [ticketId]);

    if (result[0].length === 0) {
      return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ data: result[0][0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json({ message: "Failed to fetch ticket", error: error.message }, { status: 500 });
  }
}