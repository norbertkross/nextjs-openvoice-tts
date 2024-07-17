
import { NextRequest, NextResponse } from 'next/server';

  
  interface RequestBody {
    text: string;
    voice: string;
    outputFormat: string;
    speed: number;

  }


export async function POST(req: NextRequest) {

 
  const pythonEndpoint = 'http://localhost:8000/generate';
  // const pythonEndpoint = "http://ec2-16-170-254-118.eu-north-1.compute.amazonaws.com/generate";
  // "/api/get-audio-stream" 
  // Fetch request body
  const body = await req.json();
  
  // Send a POST request to the Python server
  const pythonResponse = await fetch(pythonEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  // Check if the response is OK
  if (!pythonResponse.ok) {
    return new NextResponse('Python server error', { status: pythonResponse.status });
  }

  // Stream the response to the client
  const readableStream = pythonResponse.body;

  return new NextResponse(readableStream, {
    headers: {
      'Content-Type': pythonResponse.headers.get('Content-Type') || 'application/octet-stream',
    //   'Content-Disposition': pythonResponse.headers.get('Content-Disposition') || 'attachment',
    },
  });
}





  
// export const POST = async (req: NextRequest, res: NextResponse) => {
  
//   const body = await req.json();
//   const {text} = body as RequestBody
//   log(`Body: ${text}`)

//   let _url : string = 'http://localhost:8000/generate'

//   const requestData : any  =  {
//       "text":"The sun was setting over the ocean, casting a warm golden light over the waves. Seagulls cried out as they soared overhead, their shadows dancing on the sand. The smell of saltwater and coconut sunscreen filled the air, creating a sense of tranquility and peace. It was a moment of pure serenity.",
//       "voice":"default_male",
//       "outputFormat":"wav",
//       "speed":1.0
//      };

//   const config : AxiosRequestConfig<{}>  = {
//       responseType: 'formdata',
//       headers:{
//           'Content-Type': 'application/json'
//       }
//   };

//   try {  
//       const response = await axios.post(_url,requestData,config);
//       return NextResponse.json(response.data)

//     } catch (error) {
//       console.error(error);
//       return NextResponse.json({ message: 'Failed to generate speech' }, { status: 500 });

//     }
// };