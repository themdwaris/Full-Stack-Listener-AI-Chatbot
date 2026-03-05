// import cloudinary from '@/config/cloudinary';
// import { InferenceClient } from '@huggingface/inference';
// import { NextResponse } from 'next/server';

// // Initialize Hugging Face client
// const hf = new InferenceClient(process.env.HUGGINGFACE_TOKEN);

// export async function POST(request) {
//   try {
//     const { prompt } = await request.json();

//     // Validation
//     if (!prompt) {
//       return NextResponse.json(
//         { error: 'Prompt is required' },
//         { status: 400 }
//       );
//     }

//     // Generate image using FLUX.1-schnell
//     const imageBlob = await hf.textToImage({
//       model: 'black-forest-labs/FLUX.1-schnell',
//       inputs: prompt,
//       parameters: {
//         width: 1024,
//         height: 1024,
//         num_inference_steps: 4  // Schnell is fast with 4 steps
//       }
//     });

//     // Convert blob to base64
//     const arrayBuffer = await imageBlob.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     // const base64Image = buffer.toString('base64');
//     const base64Image = `data:image/png;base64,${buffer.toString("base64")}`;

//     const uploaded = await cloudinary.uploader.upload(base64Image, {
//       folder: 'listner-ai/generated',
//     });

//     return NextResponse.json({
//       success: true,
//       imageUrl: uploaded.secure_url 
//     });

//   } catch (error) {
//     console.error('Image generation error:', error);
//     return NextResponse.json(
//       { error: 'Failed to generate image' },
//       { status: 500 }
//     );
//   }
// }


// Using Clipdrop api 
import cloudinary from '@/config/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = `data:image/png;base64,${Buffer.from(imageBuffer).toString("base64")}`;

    const uploaded = await cloudinary.uploader.upload(base64Image, {
      folder: 'listner-ai/generated',
    });

    return NextResponse.json({ success: true, imageUrl: uploaded.secure_url });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}