import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = "https://app-food-order.azurewebsites.net";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const method = searchParams.get('method');

  console.log(`Received POST request at method: ${method}`);

  try {
    if (method === 'upload') {
      const formData = await req.formData().catch((err) => {
        throw new Error('Invalid Form Data');
      });

      console.log("Received form data:", formData.get('file'));

      const response = await axios.post(`${API_URL}/customer/auth/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return NextResponse.json(response.data);

    } else {
      const data = await req.json().catch((err) => {
        throw new Error('Invalid JSON');
      });

      if (method === 'register') {
        const response = await axios.post(`${API_URL}/customer/auth/register`, data);
        return NextResponse.json(response.data);

      } else if (method === 'signin') {
        const response = await axios.post(`${API_URL}/customer/auth/signin`, data);
        return NextResponse.json(response.data);

      } else if (method === 'signin-google') {
        const { idToken } = data;
        const response = await axios.post(`${API_URL}/customer/auth/signin/google`, { idToken });
        return NextResponse.json(response.data);

      } else {
        return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
      }
    }
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON', details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const method = searchParams.get('method');

  console.log(`Received POST request at method: ${method}`);

  if (method === 'update') {
    try {
      const { id, data } = await req.json();
      const response = await axios.put(`${API_URL}/customer/auth/update/${id}`, data);
      return NextResponse.json(response.data);

    } catch (error: any) {
      return NextResponse.json({ error: 'Failed to update user', details: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}