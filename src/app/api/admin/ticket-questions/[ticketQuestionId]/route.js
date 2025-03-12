// app/api/admin/ticket-questions/[ticketQuestionId]/route.js
import { NextResponse } from "next/server";
import { pool } from "@/db/db";

export async function PUT(req, { params }) {
    const { ticketQuestionId } = params;
    const { status } = await req.json();

    const validStatuses = ['open', 'in-progress', 'resolved'];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
    }

    try {
        const queryText = `
            UPDATE tickets_question SET status = ? WHERE ticket_question_id = ?
        `;
        const values = [status, ticketQuestionId];

        const [result] = await pool.query(queryText, values);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "Ticket question not found or not updated" }, { status: 404 });
        }

        return NextResponse.json({ message: "Ticket question status updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error updating ticket question status:", error);
        return NextResponse.json({ message: "Failed to update ticket question status", error: error.message }, { status: 500 });
    }
}