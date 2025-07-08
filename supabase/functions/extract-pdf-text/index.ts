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
    console.log('🔍 Starting PDF text extraction...');
    const formData = await req.formData();
    const pdfFile = formData.get('pdf') as File;
    
    if (!pdfFile) {
      console.error('❌ No PDF file provided');
      throw new Error('Nessun file PDF fornito');
    }

    console.log(`📄 Processing PDF: ${pdfFile.name}, Size: ${pdfFile.size} bytes`);

    // Convert file to ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    console.log('✅ PDF file read successfully');

    // Use OpenAI to extract text from PDF via OCR if needed
    // For now, let's try a simple approach with basic PDF text extraction
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Simple text extraction - look for text patterns in PDF
    const textDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: false });
    let extractedText = '';
    
    try {
      // Try to find readable text in the PDF
      const pdfString = textDecoder.decode(uint8Array);
      
      // Extract text between common PDF text markers
      const textMatches = pdfString.match(/\(([^)]+)\)/g);
      if (textMatches) {
        extractedText = textMatches
          .map(match => match.slice(1, -1))
          .filter(text => text.length > 2)
          .join(' ');
      }
      
      // Fallback: look for readable ASCII text
      if (!extractedText || extractedText.length < 50) {
        const asciiText = Array.from(uint8Array)
          .map(byte => byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ' ')
          .join('')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Extract words that look like real text
        const words = asciiText.match(/[a-zA-Z]{3,}/g);
        if (words && words.length > 10) {
          extractedText = words.join(' ');
        }
      }
      
    } catch (decodingError) {
      console.error('❌ Error decoding PDF:', decodingError);
    }
    
    // If we still don't have enough text, return a message
    if (!extractedText || extractedText.length < 20) {
      extractedText = `Documento PDF caricato: ${pdfFile.name}. Il PDF potrebbe contenere principalmente immagini o testo non standard. Prova a scrivere un prompt generico come "Analizza questo documento" e l'AI farà del suo meglio per aiutarti.`;
    }
    
    console.log(`🎉 Text extraction completed, ${extractedText.length} characters extracted`);
    
    return new Response(
      JSON.stringify({ 
        text: extractedText,
        pages: 1, // Placeholder since we can't reliably count pages
        info: { title: pdfFile.name }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error extracting PDF text:', error);
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