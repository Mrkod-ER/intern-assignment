import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Attempt to scrape markdown from jina.ai (no API key needed for basic usage)
        const jinaUrl = `https://r.jina.ai/${url}`;
        const response = await fetch(jinaUrl);

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch content from URL' }, { status: 500 });
        }

        const markdownContent = await response.text();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
        }

        // Call Gemini API to extract intelligence
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
    Analyze the following website content for a company and extract the requested fields. 
    Content:
    """
    ${markdownContent.substring(0, 30000) /* Limit content size slightly to be safe */}
    """

    Return the response ONLY as a JSON object with the exact following schema and keys:
    {
      "summary": "1-2 sentences summarizing the company",
      "whatTheyDo": ["bullet 1", "bullet 2", "bullet 3"],
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "derivedSignals": ["signal 1 (e.g., careers page exists)", "signal 2"]
    }
    Extract 3-6 bullets for 'whatTheyDo', 5-10 keywords, and 2-4 derived signals based on the provided text.
    Ensure it is valid JSON.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Strip out markdown formatting if returned
        const jsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json({
            ...data,
            sources: [{ url: jinaUrl, timestamp: new Date().toISOString() }]
        });

    } catch (error) {
        console.error('Enrichment API Error:', error);
        return NextResponse.json({ error: 'Failed to process enrichment' }, { status: 500 });
    }
}
