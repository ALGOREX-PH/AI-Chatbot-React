import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY, {
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta'
});

export async function chat(message: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `
Please provide a detailed response to this message using proper markdown formatting:

${message}

Format your response with:
- Headings using #, ##, ### as appropriate
- Code blocks with \`\`\` for any code or technical content
- Lists with - or * for enumerated points
- **Bold** or *italic* text for emphasis
- > for any quotes or important notes
- Links when referencing external resources
- Tables when presenting structured data
`;
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chat:', error);
    throw error;
  }
}