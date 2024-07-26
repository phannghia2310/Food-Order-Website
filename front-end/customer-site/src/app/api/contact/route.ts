import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = "https://app-food-order.azurewebsites.net";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const method = searchParams.get('method');

  console.log(`Received POST request at method: ${method}`);

  try {
    if (method === 'send') {
      const contactModel = await req.json().catch((err) => {
        throw new Error('Invalid JSON');
      });

      const response = await axios.post(
        `${API_URL}/customer/cuscontact/send-inquiry`,
        contactModel,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return NextResponse.json(response.data);

    } else {
      return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    }
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON', details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
