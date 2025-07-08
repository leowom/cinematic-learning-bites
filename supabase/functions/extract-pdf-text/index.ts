import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 Starting enhanced PDF text extraction...');
    const formData = await req.formData();
    const pdfFile = formData.get('pdf') as File;
    
    if (!pdfFile) {
      console.error('❌ No PDF file provided');
      throw new Error('Nessun file PDF fornito');
    }

    // Validate file size
    if (pdfFile.size > MAX_FILE_SIZE) {
      throw new Error(`File troppo grande. Dimensione massima: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Validate file type
    if (pdfFile.type !== 'application/pdf') {
      throw new Error('Formato file non valido. Sono supportati solo file PDF.');
    }

    console.log(`📄 Processing PDF: ${pdfFile.name}, Size: ${pdfFile.size} bytes`);

    // Convert file to ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    console.log('✅ PDF file read successfully');

    // Convert PDF to base64 for OpenAI processing
    const base64Content = await convertPDFToBase64(arrayBuffer);
    
    console.log(`🎉 PDF successfully converted to base64 for OpenAI processing`);
    
    return new Response(
      JSON.stringify({ 
        base64Content: base64Content,
        fileName: pdfFile.name,
        fileSize: pdfFile.size,
        ready: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error extracting PDF text:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Impossibile estrarre il testo dal PDF',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function convertPDFToBase64(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    console.log('📄 Converting PDF to base64, size:', arrayBuffer.byteLength, 'bytes');
    
    // Convert ArrayBuffer to base64
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64String = btoa(String.fromCharCode(...uint8Array));
    
    console.log('✅ PDF converted to base64 successfully');
    return base64String;
    
  } catch (error) {
    console.error('❌ Error converting PDF to base64:', error);
    throw new Error('Impossibile convertire il PDF in base64');
  }
}
