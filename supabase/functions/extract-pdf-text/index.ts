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
    console.log('🔍 Starting PDF upload processing...');
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

    // For now, return an error explaining the limitation
    return new Response(
      JSON.stringify({ 
        error: 'Estrazione testo PDF non supportata',
        details: 'Al momento la funzionalità di estrazione automatica del testo dai PDF non è disponibile. Si prega di copiare manualmente il testo dal PDF e incollarlo nella richiesta.',
        ready: false
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error processing PDF:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Impossibile processare il PDF',
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
    
    if (arrayBuffer.byteLength === 0) {
      throw new Error('PDF file is empty');
    }
    
    if (arrayBuffer.byteLength > MAX_FILE_SIZE) {
      throw new Error(`PDF file too large: ${arrayBuffer.byteLength} bytes`);
    }
    
    // Convert ArrayBuffer to base64 using TextEncoder/TextDecoder for better handling
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert in chunks to avoid memory issues with very large files
    const chunkSize = 1024 * 1024; // 1MB chunks
    let base64String = '';
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      base64String += btoa(String.fromCharCode.apply(null, Array.from(chunk)));
    }
    
    console.log('✅ PDF converted to base64 successfully, length:', base64String.length);
    return base64String;
    
  } catch (error) {
    console.error('❌ Error converting PDF to base64:', error);
    throw new Error(`Impossibile convertire il PDF in base64: ${error.message}`);
  }
}
