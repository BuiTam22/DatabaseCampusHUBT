import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCnCDs7Sgwt4SbEJbfsiegjayfVGfNVf0o"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

export const chat = async (message) => {
    try {
        // Thay đổi model name thành "gemini-pro" vì "gemini-2.0-flash-exp" không tồn tại
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Thêm xử lý lỗi cụ thể
        if (!message) {
            throw new Error("Message is required");
        }

        const result = await model.generateContent(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error calling Gemini API:', error.message);
        throw new Error('Failed to get AI response: ' + error.message);
    }
};
