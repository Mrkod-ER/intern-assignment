import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
    try {
        const { company, enrichedData, thesis } = await request.json();

        if (!company || !thesis?.description) {
            return NextResponse.json({ error: 'company and thesis are required' }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const companyContext = enrichedData
            ? `
Name: ${company.name}
Industry: ${company.industry}
Stage: ${company.stage}
Founded: ${company.founded}
HQ: ${company.hq}
Description: ${company.description}
AI Summary: ${enrichedData.summary || ''}
What They Do: ${(enrichedData.whatTheyDo || []).join('; ')}
Keywords: ${(enrichedData.keywords || []).join(', ')}
Derived Signals: ${(enrichedData.derivedSignals || []).join('; ')}
`
            : `
Name: ${company.name}
Industry: ${company.industry}
Stage: ${company.stage}
Founded: ${company.founded}
HQ: ${company.hq}
Description: ${company.description}
`;

        const thesisContext = `
Fund Thesis: ${thesis.description}
Preferred Stages: ${thesis.stages?.join(', ') || 'Any'}
Target Industries: ${thesis.industries?.join(', ') || 'Any'}
Geography Focus: ${thesis.geography || 'Any'}
Check Size: ${thesis.checkSizeMin || '?'} – ${thesis.checkSizeMax || '?'}
`;

        const prompt = `
You are a VC analyst scoring how well a company fits a fund's investment thesis.

FUND THESIS:
${thesisContext}

COMPANY:
${companyContext}

Evaluate the company against the thesis on a 0–100 scale (100 = perfect fit, 0 = complete mismatch).
Be rigorous and honest. Penalize for stage mismatch, industry mismatch, or geography issues.

Return ONLY a JSON object with this exact schema:
{
  "score": <number 0-100>,
  "verdict": "<one of: Strong Fit | Good Fit | Partial Fit | Weak Fit | Not a Fit>",
  "reasons": ["reason 1 why it fits", "reason 2 ..."],
  "redFlags": ["concern 1", "concern 2 ..."]
}

Provide 2–4 reasons and 0–3 red flags. Be concise and specific. Return only valid JSON, no markdown.
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonStr = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return NextResponse.json(data);

    } catch (error) {
        console.error('Score API Error:', error);
        return NextResponse.json({ error: 'Failed to compute thesis-fit score' }, { status: 500 });
    }
}
