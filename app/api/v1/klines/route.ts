import { NextResponse } from 'next/server';
import axios from 'axios';


const BASE_URL = 'https://api.backpack.exchange/api/v1';



export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');
    const interval = searchParams.get('interval');
    const startTime = searchParams.get('startTime');
   

    if (!symbol || !interval || !startTime ) {
        return NextResponse.json({ error: 'Missing required query parameters' }, { status: 400 });
    }

    try {
const response = await axios.get(
  `${BASE_URL}/klines`,
  {
    params: {
      symbol,
      interval,
      startTime
    }
  }
);
        console.log(response.request)

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Failed to fetch klines:', error);
        return NextResponse.json({ error: 'Failed to fetch klines' }, { status: 500 });
    }
}