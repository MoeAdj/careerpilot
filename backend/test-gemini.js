require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('KEY EXISTS:', !!process.env.GEMINI_API_KEY);
console.log('KEY START:', process.env.GEMINI_API_KEY?.substring(0, 8));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash'
  });

  const result = await model.generateContent('Say hello');

  console.log(result.response.text());
}

test().catch(console.error);