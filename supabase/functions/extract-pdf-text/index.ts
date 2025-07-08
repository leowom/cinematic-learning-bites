import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const pdfFile = formData.get('pdf') as File;
    
    if (!pdfFile) {
      throw new Error('Nessun file PDF fornito');
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Import pdf-parse dinamically for Deno
    const { default: pdfParse } = await import('https://esm.sh/pdf-parse@1.1.1');
    
    // Extract text from PDF
    const data = await pdfParse(uint8Array);
    
    return new Response(
      JSON.stringify({ 
        text: data.text,
        pages: data.numpages,
        info: data.info
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Impossibile estrarre il testo dal PDF',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});