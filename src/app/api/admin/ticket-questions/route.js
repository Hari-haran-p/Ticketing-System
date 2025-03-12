// app/api/admin/ticket-questions/route.js
import { NextResponse } from "next/server";
import { pool } from "@/db/db";

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const ticketId = url.searchParams.get('ticketId');

        if (!ticketId || isNaN(Number(ticketId))) {
            return NextResponse.json(
                { message: "Invalid or missing ticketId parameter" },
                { status: 400 }
            );
        }

        const ticketIdNumber = Number(ticketId);

        const queryText = `
            SELECT ticket_question_id, question, response, status
            FROM tickets_question
            WHERE ticket_id = ?
        `;

        const [rows] = await pool.query(queryText, [ticketIdNumber]);

        return NextResponse.json({ questions: rows }, { status: 200 });

    } catch (error) {
        console.error("Error fetching ticket questions:", error);
        return NextResponse.json(
            { message: "Failed to fetch ticket questions", error: error.message },
            { status: 500 }
        );
    }
}