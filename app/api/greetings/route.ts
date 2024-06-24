// pages/api/hello.ts
import { log } from 'console';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse,NextRequest } from "next/server";

type Data = {
  message: string;
};

interface RequestBody {
  name: string;
}


export const GET = async (req: NextRequest, res: NextResponse<Data>) => {
  // res.status(200).json({ message: 'Hello, World!' });
  return NextResponse.json({ message: 'Hello, World!' }, { status: 400 });
};

export const POST = async (req: NextRequest, res: NextResponse<Data>) => {

  const body = await req.json();
  const {name} = body as RequestBody
  log(`Body: ${name}`)
  return NextResponse.json({ message: `Hello, ${name}!` }, { status: 200 });
};

