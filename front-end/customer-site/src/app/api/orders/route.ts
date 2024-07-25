import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = "https://app-food-order.azurewebsites.net";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const detail = searchParams.get('detail');

  try {
    if (id && detail === 'list') {
      const response = await axios.get(`${API_URL}/customer/cart/list/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return NextResponse.json(response.data);
    }
    if (id && detail === 'details') {
      const response = await axios.get(`${API_URL}/customer/cart/details/${id}`);
      return NextResponse.json(response.data);
    }
    return NextResponse.json({ error: 'Invalid GET request' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const detail = searchParams.get('detail');

  try {
    if (id && detail === 'change-status') {
      const response = await axios.put(`${API_URL}/customer/cart/change-status/${id}`);
      return NextResponse.json(response.data);
    }
    return NextResponse.json({ error: 'Invalid PUT request' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  }
}
