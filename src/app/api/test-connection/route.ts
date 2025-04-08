import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Try to connect to the database
    const connection = await pool.getConnection();
    
    // Test a simple query
    const [result] = await connection.query('SELECT 1 as test');
    
    // Release the connection back to the pool
    connection.release();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Connection successful',
      data: result
    });
  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error
      },
      { status: 500 }
    );
  }
} 