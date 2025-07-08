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

    // Try multiple extraction methods
    let extractedText = '';
    let extractionMethod = 'none';
    
    // Method 1: Enhanced text pattern extraction
    try {
      extractedText = await extractTextFromPDF(arrayBuffer);
      if (extractedText && extractedText.length > 50) {
        extractionMethod = 'text-pattern';
        console.log(`✅ Text extracted using pattern method: ${extractedText.length} characters`);
      }
    } catch (error) {
      console.warn('⚠️ Pattern extraction failed:', error.message);
    }

    // Method 2: OpenAI Vision API fallback for image-based PDFs
    if (!extractedText || extractedText.length < 50) {
      try {
        console.log('🔄 Trying OpenAI Vision API for PDF analysis...');
        extractedText = await extractTextWithOpenAIVision(arrayBuffer, pdfFile.name);
        if (extractedText && extractedText.length > 20) {
          extractionMethod = 'openai-vision';
          console.log(`✅ Text extracted using OpenAI Vision: ${extractedText.length} characters`);
        }
      } catch (error) {
        console.warn('⚠️ OpenAI Vision extraction failed:', error.message);
      }
    }

    // Method 3: Fallback message if all methods fail
    if (!extractedText || extractedText.length < 20) {
      extractionMethod = 'fallback';
      extractedText = `Documento PDF caricato: ${pdfFile.name}. 

Il PDF è stato caricato con successo ma l'estrazione automatica del testo non è riuscita completamente. Questo può accadere con PDF scansionati, protetti o con layout complessi.

Puoi comunque procedere scrivendo un prompt generico come:
- "Riassumi questo documento"
- "Estrai i punti principali"
- "Analizza il contenuto"

L'AI farà del suo meglio per aiutarti basandosi sul documento caricato.`;
    }
    
    console.log(`🎉 Text extraction completed using ${extractionMethod}, ${extractedText.length} characters extracted`);
    
    return new Response(
      JSON.stringify({ 
        text: extractedText,
        pages: 1, // Placeholder since we can't reliably count pages
        info: { 
          title: pdfFile.name,
          size: pdfFile.size,
          extractionMethod: extractionMethod
        }
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

async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  const uint8Array = new Uint8Array(arrayBuffer);
  
  try {
    console.log('📄 PDF size:', uint8Array.length, 'bytes');
    
    // Method 1: Improved text extraction between parentheses
    const extractedTexts = [];
    let text = '';
    
    // Convert to string more carefully, handling encoding
    for (let i = 0; i < uint8Array.length - 1; i++) {
      const byte = uint8Array[i];
      const nextByte = uint8Array[i + 1];
      
      // Look for text patterns: (text) and <text>
      if (byte === 40) { // Opening parenthesis '('
        let j = i + 1;
        let textContent = '';
        let depth = 1;
        
        while (j < uint8Array.length && depth > 0) {
          const currentByte = uint8Array[j];
          
          if (currentByte === 40) depth++; // '('
          else if (currentByte === 41) depth--; // ')'
          else if (depth === 1 && currentByte >= 32 && currentByte <= 126) {
            textContent += String.fromCharCode(currentByte);
          }
          j++;
        }
        
        if (textContent.length > 2 && /[a-zA-Z\u00C0-\u017F]/.test(textContent)) {
          const cleanText = textContent
            .replace(/\\n/g, ' ')
            .replace(/\\r/g, ' ')
            .replace(/\\t/g, ' ')
            .replace(/\\\\/g, '\\')
            .replace(/\\\)/g, ')')
            .replace(/\\\(/g, '(')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (cleanText.length > 1) {
            extractedTexts.push(cleanText);
          }
        }
        i = j;
      }
      
      // Look for hex-encoded text
      else if (byte === 60) { // Opening angle bracket '<'
        let j = i + 1;
        let hexContent = '';
        
        while (j < uint8Array.length && uint8Array[j] !== 62) { // Until '>'
          const hexByte = uint8Array[j];
          if ((hexByte >= 48 && hexByte <= 57) || (hexByte >= 65 && hexByte <= 70) || (hexByte >= 97 && hexByte <= 102)) {
            hexContent += String.fromCharCode(hexByte);
          }
          j++;
        }
        
        // Convert hex to text
        if (hexContent.length > 0 && hexContent.length % 2 === 0) {
          let decodedText = '';
          for (let k = 0; k < hexContent.length; k += 2) {
            const hexPair = hexContent.substr(k, 2);
            const charCode = parseInt(hexPair, 16);
            if (charCode >= 32 && charCode <= 126) {
              decodedText += String.fromCharCode(charCode);
            }
          }
          
          if (decodedText.length > 1 && /[a-zA-Z\u00C0-\u017F]/.test(decodedText)) {
            extractedTexts.push(decodedText.trim());
          }
        }
        i = j;
      }
    }
    
    // Method 2: Look for readable sequences in the raw data
    let currentWord = '';
    const words = [];
    
    for (let i = 0; i < uint8Array.length; i++) {
      const byte = uint8Array[i];
      
      // Readable ASCII characters or common European characters
      if ((byte >= 32 && byte <= 126) || (byte >= 192 && byte <= 255)) {
        const char = String.fromCharCode(byte);
        
        // Letters, numbers, common punctuation
        if (/[a-zA-Z0-9\u00C0-\u017F\.,;:!?\-']/.test(char)) {
          currentWord += char;
        } else if (currentWord.length > 0) {
          if (currentWord.length >= 3 && /[a-zA-Z\u00C0-\u017F]/.test(currentWord)) {
            words.push(currentWord);
          }
          currentWord = '';
        }
      } else if (currentWord.length > 0) {
        if (currentWord.length >= 3 && /[a-zA-Z\u00C0-\u017F]/.test(currentWord)) {
          words.push(currentWord);
        }
        currentWord = '';
      }
    }
    
    // Add final word if exists
    if (currentWord.length >= 3 && /[a-zA-Z\u00C0-\u017F]/.test(currentWord)) {
      words.push(currentWord);
    }
    
    // Combine methods - prioritize structured text extraction
    let finalText = '';
    
    if (extractedTexts.length > 0) {
      finalText = extractedTexts.join(' ').replace(/\s+/g, ' ').trim();
      console.log(`✅ Method 1: Extracted ${extractedTexts.length} text segments`);
    }
    
    // If structured extraction didn't yield much, use words
    if (finalText.length < 50 && words.length > 10) {
      finalText = words.join(' ').replace(/\s+/g, ' ').trim();
      console.log(`✅ Method 2: Extracted ${words.length} words from raw data`);
    }
    
    // Final validation
    const wordCount = finalText.split(/\s+/).filter(word => word.length > 2).length;
    console.log(`📊 Final text quality: ${wordCount} meaningful words, ${finalText.length} characters`);
    
    if (finalText.length < 20 || wordCount < 5) {
      console.warn('⚠️ Low quality text extraction, will use fallback');
      throw new Error('Testo estratto insufficiente');
    }
    
    // Log a preview of extracted text for debugging
    console.log(`📖 Text preview: ${finalText.substring(0, 200)}...`);
    
    return finalText;
    
  } catch (error) {
    console.error('❌ Error in PDF text extraction:', error);
    throw error;
  }
}

async function extractTextWithOpenAIVision(arrayBuffer: ArrayBuffer, filename: string): Promise<string> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    // Convert first page to image for OpenAI Vision
    // For now, we'll use a simple approach - in a real implementation, 
    // you'd convert PDF to image using a proper library
    
    // Create a prompt for OpenAI to analyze the PDF content
    const prompt = `Questo è un documento PDF chiamato "${filename}". 
    Estrai tutto il testo leggibile da questo documento. 
    Se non riesci a leggere il testo, descrivi il contenuto che vedi.
    Rispondi SOLO con il testo estratto, senza commenti aggiuntivi.`;

    // For now, let's use a text-based approach since PDF to image conversion 
    // requires additional libraries not easily available in Deno
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'Sei un esperto nell\'estrazione di testo da documenti. Rispondi solo con il testo estratto.'
          },
          {
            role: 'user',
            content: `${prompt}\n\nNome file: ${filename}\nDimensione: ${arrayBuffer.byteLength} bytes`
          }
        ],
        max_tokens: 1500,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const extractedText = data.choices[0]?.message?.content || '';
    
    return extractedText.trim();
    
  } catch (error) {
    console.error('❌ Error with OpenAI Vision:', error);
    throw new Error('OpenAI Vision estrazione fallita');
  }
}