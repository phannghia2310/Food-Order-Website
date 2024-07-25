import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = "https://app-food-order.azurewebsites.net";

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get(`${API_URL}/customer/MenuCategory`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch menu items', details: error.message }, { status: 500 });
  }
}