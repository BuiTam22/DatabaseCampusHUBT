import * as pdfjs from 'pdfjs-dist';

export const extractPDFContent = async (pdfPath) => {
  try {
    const pdf = await pdfjs.getDocument(pdfPath).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    throw error;
  }
};

export const calculateSimilarity = (text1, text2) => {
  // Tiền xử lý văn bản
  const processText = (text) => {
    return text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/);
  };

  const words1 = processText(text1);
  const words2 = processText(text2);

  // Tạo từ điển tần suất
  const freqMap1 = new Map();
  const freqMap2 = new Map();

  words1.forEach(word => {
    freqMap1.set(word, (freqMap1.get(word) || 0) + 1);
  });

  words2.forEach(word => {
    freqMap2.set(word, (freqMap2.get(word) || 0) + 1);
  });

  // Tính độ tương đồng cosine
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (const [word, freq1] of freqMap1) {
    const freq2 = freqMap2.get(word) || 0;
    dotProduct += freq1 * freq2;
    norm1 += freq1 * freq1;
  }

  for (const [_, freq2] of freqMap2) {
    norm2 += freq2 * freq2;
  }

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}; 