import { NextResponse } from "next/server";
import { pool } from "@/db/db"; // Adjust path if needed

async function fetchFeedbackAndCheckForNegative(feedbackId) {
    try {
        // Query to check for "no" responses in public_feedback_data for the given feedback_id
        const checkNegativeQuery = `
                SELECT *
                FROM public_feedback_data
                WHERE feedback_id = ? AND feedback LIKE '%no%'
        `;

        const [negativeResult] = await pool.query(checkNegativeQuery, [feedbackId]);
        const hasNegative = negativeResult?.length > 0 ? true : false;

        if (!hasNegative) {
            console.log(`No negative feedback found for feedback_id: ${feedbackId}`);
            return { hasNegative: false, feedbackData: null };
        }

        // If there's a "no" response, fetch the public_feedback data
        const feedbackQuery = `
            SELECT * FROM public_feedback WHERE feedback_id = ?
        `;

        const [feedbackRows] = await pool.query(feedbackQuery, [feedbackId]);

        if (feedbackRows.length === 0) {
            console.warn(`Feedback data not found for ID: ${feedbackId}`);
            return null;
        }

        return { hasNegative: true, feedbackData: feedbackRows[0] };

    } catch (error) {
        console.error("Error fetching and checking feedback data:", error);
        throw new Error(`Failed to fetch and check feedback data: ${error.message}`);
    }
}

async function createTicket(feedbackData) {
    try {
        const { feedback_id, name, mobile, rating, asset_id, feedback_responses, questions } = feedbackData;

        // Construct a more detailed description
        const description = `User: ${name}, Mobile: ${mobile}, Rating: ${rating}, Asset ID: ${asset_id}.
                           Questions: ${questions || 'N/A'}.
                           Responses: ${feedback_responses || 'N/A'}`;


        // Insert into the tickets table
        const queryText = `
            INSERT INTO tickets (feedback_id, title, description, status, created_at, apq_id, cmq_id)
            VALUES (?, ?, ?, ?, NOW(), ?, ?);
        `;

        const values = [
            feedback_id,
            "Feedback Issue with 'No' Response",
            description,
            "open",
            feedbackData.apq_id || null,
            feedbackData.cmq_id || null
        ];

        const [result] = await pool.query(queryText, values);
        const ticketId = result.insertId;

        console.log(`Created ticket with ID: ${ticketId}`);
        return ticketId.toString();
    } catch (error) {
        console.error("Error creating ticket:", error);
        throw new Error(`Failed to create ticket: ${error.message}`);
    }
}

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const feedbackId = url.searchParams.get('id');

        console.log("Received Webhook for ID:", feedbackId);

        if (!feedbackId || isNaN(Number(feedbackId))) {
            return NextResponse.json(
                { message: "Invalid or missing ID parameter" },
                { status: 400 }
            );
        }

        const feedbackIdNumber = Number(feedbackId);

        // 1. Fetch Feedback Data and Check for Negative Responses
        const feedbackResult = await fetchFeedbackAndCheckForNegative(feedbackIdNumber);

        if (!feedbackResult) {
            return NextResponse.json(
                { message: "Feedback data not found" },
                { status: 404 }
            );
        }

        const { hasNegative, feedbackData } = feedbackResult;

        if (hasNegative) {
            // 2. Create Ticket
            try {
                const ticketId = await createTicket(feedbackData);
                return NextResponse.json({ message: "Ticket created", ticketId }, { status: 201 });
            } catch (createTicketError) {
                console.error("Error creating ticket:", createTicketError);
                return NextResponse.json(
                    { message: "Failed to create ticket", error: createTicketError.message },
                    { status: 500 }
                );
            }
        } else {
            return NextResponse.json({ message: "No ticket needed" }, { status: 200 });
        }

    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { message: "Failed to process webhook", error: error.message },
            { status: 500 }
        );
    }
}