// app/api/admin/feedback/route.js  (For the app directory)
import { NextResponse } from 'next/server';
import { pool } from '@/db/db';

export async function GET(req) {
  try {
    const query = 'SELECT * FROM public_feedback_view WHERE user_response = "No"';
    const result = await pool.query(query);
    
    return NextResponse.json({data : result[0]}, { status: 200 });
  } catch (error) {
    console.error("Error fetching data from public_feedback_view:", error);
    return NextResponse.json({ message: "Failed to fetch feedback", error: error.message }, { status: 500 });
  }
}