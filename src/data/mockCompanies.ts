export interface Company {
    id: string;
    name: string;
    website: string;
    description: string;
    industry: string;
    stage: string;
    founded: string;
    hq: string;
    status: 'new' | 'viewed' | 'contacted';
}

export const mockCompanies: Company[] = [
    {
        id: "1",
        name: "Vercel",
        website: "https://vercel.com",
        description: "Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
        industry: "Developer Tools",
        stage: "Series D",
        founded: "2015",
        hq: "San Francisco, CA",
        status: 'new'
    },
    {
        id: "2",
        name: "Linear",
        website: "https://linear.app",
        description: "Linear is a purpose-built tool for planning and building products.",
        industry: "Productivity",
        stage: "Series B",
        founded: "2019",
        hq: "San Francisco, CA",
        status: 'viewed'
    },
    {
        id: "3",
        name: "Stripe",
        website: "https://stripe.com",
        description: "Stripe is a suite of payment APIs that powers commerce for online businesses of all sizes.",
        industry: "Fintech",
        stage: "Public",
        founded: "2010",
        hq: "San Francisco, CA",
        status: 'contacted'
    },
    {
        id: "4",
        name: "Supabase",
        website: "https://supabase.com",
        description: "The open source Firebase alternative.",
        industry: "Developer Tools",
        stage: "Series B",
        founded: "2020",
        hq: "Singapore",
        status: 'new'
    },
    {
        id: "5",
        name: "Anthropic",
        website: "https://anthropic.com",
        description: "Anthropic is an AI safety and research company that's working to build reliable, interpretable, and steerable AI systems.",
        industry: "AI",
        stage: "Series C",
        founded: "2021",
        hq: "San Francisco, CA",
        status: 'new'
    }
];
