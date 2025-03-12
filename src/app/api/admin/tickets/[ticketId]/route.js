import { NextResponse } from 'next/server';
import { pool } from '@/db/db';

//GET a single ticket
export async function GET(req, { params }) {
  const { ticketId } = params;
  console.log(ticketId);
  
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


export async function PUT(req, { params }) { // Or PATCH
  const { ticketId } = params;
  const { status } = await req.json(); // Get the status from the request body

  // Validate the status (optional)
  const validStatuses = ['open', 'in-progress', 'resolved'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
  }

  try {
    const queryText = `
      UPDATE tickets SET status = ? WHERE ticket_id = ?
    `;
    const values = [status, ticketId];

    const [result] = await pool.query(queryText, values); // Use prepared statement

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "Ticket not found or not updated" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ticket status updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error updating ticket status:", error);
    return NextResponse.json({ message: "Failed to update ticket status", error: error.message }, { status: 500 });
  }
}