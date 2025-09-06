import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get('symbol'); // Default to ETH_USDC if no symbol provided

        const response = await fetch(`https://api.backpack.exchange/api/v1/depth?symbol=${symbol}`, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json(
            { error: error },
            { status: 500 }
        );
    }
}