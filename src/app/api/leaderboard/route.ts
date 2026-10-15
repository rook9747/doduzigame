import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json({ success: false, error: 'Google Script URL is not set.' }, { status: 400 });
  }

  try {
    const res = await fetch(`${scriptUrl}?action=getRankings`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      redirect: 'follow',
      cache: 'no-store',
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json({ success: false, error: 'Google Script URL is not set.' }, { status: 400 });
  }

  try {
    const body = await request.json();

    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(body),
      redirect: 'follow',
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
