import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Validate the email
    // 2. Store it in your database
    // 3. Send a confirmation email
    // For now, we'll just return a success response
    
    // TODO: Add your database logic here
    // Example: await db.waitlist.create({ data: { email } });

    return NextResponse.json(
      { message: 'Successfully joined the waitlist' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}
