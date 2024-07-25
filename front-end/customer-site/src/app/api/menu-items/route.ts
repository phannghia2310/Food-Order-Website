import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = "https://app-food-order.azurewebsites.net";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  try {
    if (id === null) {
      const response = await axios.get(`${API_URL}/customer/MenuItem`);
      return NextResponse.json(response.data);
    } else {
      const response = await axios.get(`${API_URL}/customer/MenuItem/${id}`);
      return NextResponse.json(response.data);
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch menu items', details: error.message }, { status: 500 });
  }
}
