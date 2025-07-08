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
      throw new Error('Nessun file PDF fornito');
    }

    console.log(`📄 Processing PDF: ${pdfFile.name}, Size: ${pdfFile.size} bytes`);

    // Convert file to ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    console.log('✅ PDF file read successfully');

    // Use pdf2pic or another Deno-compatible approach
    // For now, let's use a simpler text extraction approach
    // Import pdfjs-dist which is more compatible with Deno
    const pdfjsLib = await import('https://esm.sh/pdfjs-dist@3.11.174/build/pdf.min.js');
    
    // Initialize PDF.js
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log(`📖 PDF loaded, ${pdf.numPages} pages found`);
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
      console.log(`✅ Page ${pageNum} processed`);
    }
    
    console.log(`🎉 Text extraction completed, ${fullText.length} characters extracted`);
    
    return new Response(
      JSON.stringify({ 
        text: fullText.trim(),
        pages: pdf.numPages,
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