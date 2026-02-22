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
    tags?: string[];
}

export const mockCompanies: Company[] = [
    {
        id: "1",
        name: "Vercel",
        website: "https://vercel.com",
        description: "Vercel is the platform for frontend developers, providing speed and reliability for modern web apps.",
        industry: "Developer Tools",
        stage: "Series D",
        founded: "2015",
        hq: "San Francisco, CA",
        status: 'new',
        tags: ['frontend', 'deployment', 'edge']
    },
    {
        id: "2",
        name: "Linear",
        website: "https://linear.app",
        description: "Linear is a purpose-built tool for planning and building products. Streamlined issue tracking for modern teams.",
        industry: "Productivity",
        stage: "Series B",
        founded: "2019",
        hq: "San Francisco, CA",
        status: 'viewed',
        tags: ['project-management', 'b2b', 'saas']
    },
    {
        id: "3",
        name: "Stripe",
        website: "https://stripe.com",
        description: "Stripe is a suite of payment APIs powering global commerce for businesses of all sizes.",
        industry: "Fintech",
        stage: "Public",
        founded: "2010",
        hq: "San Francisco, CA",
        status: 'contacted',
        tags: ['payments', 'api', 'infra']
    },
    {
        id: "4",
        name: "Supabase",
        website: "https://supabase.com",
        description: "The open source Firebase alternative. Build in a weekend, scale to millions.",
        industry: "Developer Tools",
        stage: "Series B",
        founded: "2020",
        hq: "Singapore",
        status: 'new',
        tags: ['database', 'open-source', 'backend']
    },
    {
        id: "5",
        name: "Anthropic",
        website: "https://anthropic.com",
        description: "Anthropic is an AI safety and research company building reliable, interpretable, and steerable AI systems.",
        industry: "AI",
        stage: "Series C",
        founded: "2021",
        hq: "San Francisco, CA",
        status: 'new',
        tags: ['llm', 'safety', 'research']
    },
    {
        id: "6",
        name: "Retool",
        website: "https://retool.com",
        description: "Retool lets you build internal tools fast. Connect to any API or database and build UIs in minutes.",
        industry: "Developer Tools",
        stage: "Series C",
        founded: "2017",
        hq: "San Francisco, CA",
        status: 'new',
        tags: ['low-code', 'internal-tools', 'b2b']
    },
    {
        id: "7",
        name: "Descript",
        website: "https://descript.com",
        description: "Descript is an all-in-one video and podcast editing platform built for modern creators.",
        industry: "AI",
        stage: "Series C",
        founded: "2017",
        hq: "San Francisco, CA",
        status: 'new',
        tags: ['ai-video', 'creator-tools', 'media']
    },
    {
        id: "8",
        name: "Watershed",
        website: "https://watershed.com",
        description: "Watershed is an enterprise climate platform helping companies measure, reduce, and report carbon emissions.",
        industry: "Climate",
        stage: "Series B",
        founded: "2019",
        hq: "San Francisco, CA",
        status: 'new',
        tags: ['climate', 'esg', 'enterprise']
    },
    {
        id: "9",
        name: "Resend",
        website: "https://resend.com",
        description: "Resend is the email API for developers. Send transactional emails at scale with a modern developer-first approach.",
        industry: "Developer Tools",
        stage: "Seed",
        founded: "2022",
        hq: "San Francisco, CA",
        status: 'new',
        tags: ['email', 'api', 'developer-first']
    },
    {
        id: "10",
        name: "Midjourney",
        website: "https://midjourney.com",
        description: "Midjourney is an AI research lab producing proprietary image-generation models from text prompts.",
        industry: "AI",
        stage: "Series A",
        founded: "2021",
        hq: "San Francisco, CA",
        status: 'new',
        tags: ['generative-ai', 'image', 'creative']
    },
    {
        id: "11",
        name: "Clerk",
        website: "https://clerk.com",
        description: "Clerk is the most comprehensive user management platform for authentication, user profiles, and sessions.",
        industry: "Developer Tools",
        stage: "Series B",
        founded: "2020",
        hq: "New York, NY",
        status: 'new',
        tags: ['auth', 'identity', 'saas']
    },
    {
        id: "12",
        name: "Ramp",
        website: "https://ramp.com",
        description: "Ramp is the corporate card and spend management platform designed to save businesses money.",
        industry: "Fintech",
        stage: "Series D",
        founded: "2019",
        hq: "New York, NY",
        status: 'new',
        tags: ['finance', 'cards', 'spend-management']
    },
    {
        id: "13",
        name: "Osquery",
        website: "https://osquery.io",
        description: "Osquery exposes an OS as a high-performance relational database for introspection and monitoring.",
        industry: "Security",
        stage: "Seed",
        founded: "2021",
        hq: "Remote",
        status: 'new',
        tags: ['security', 'open-source', 'osquery']
    },
    {
        id: "14",
        name: "Rime",
        website: "https://rime.ai",
        description: "Rime builds realistic AI voice models for enterprise-grade text-to-speech applications.",
        industry: "AI",
        stage: "Series A",
        founded: "2022",
        hq: "New York, NY",
        status: 'new',
        tags: ['voice', 'speech', 'enterprise-ai']
    },
    {
        id: "15",
        name: "Dagster",
        website: "https://dagster.io",
        description: "Dagster is an orchestration platform for machine learning, analytics, and ETL pipelines.",
        industry: "Data & Analytics",
        stage: "Series C",
        founded: "2018",
        hq: "San Francisco, CA",
        status: 'new',
        tags: ['data-orchestration', 'mlops', 'etl']
    },
    {
        id: "16",
        name: "Metabase",
        website: "https://metabase.com",
        description: "Metabase is the simplest, fastest business intelligence tool, helping teams explore data and surface insights.",
        industry: "Data & Analytics",
        stage: "Series B",
        founded: "2014",
        hq: "San Francisco, CA",
        status: 'new',
        tags: ['bi', 'analytics', 'open-source']
    },
    {
        id: "17",
        name: "Luma",
        website: "https://lu.ma",
        description: "Luma is a modern event management and ticketing platform built for communities and creators.",
        industry: "SaaS",
        stage: "Series A",
        founded: "2020",
        hq: "San Francisco, CA",
        status: 'new',
        tags: ['events', 'community', 'creator']
    },
    {
        id: "18",
        name: "Posthog",
        website: "https://posthog.com",
        description: "PostHog is the open-source product analytics, session replay, feature flags, and A/B testing platform.",
        industry: "Developer Tools",
        stage: "Series B",
        founded: "2020",
        hq: "San Francisco, CA",
        status: 'new',
        tags: ['analytics', 'open-source', 'product']
    },
    {
        id: "19",
        name: "ElevenLabs",
        website: "https://elevenlabs.io",
        description: "ElevenLabs creates the most realistic AI voice technology, enabling anyone to generate high-quality speech.",
        industry: "AI",
        stage: "Series B",
        founded: "2022",
        hq: "New York, NY",
        status: 'new',
        tags: ['voice-ai', 'speech', 'creative']
    },
    {
        id: "20",
        name: "Turso",
        website: "https://turso.tech",
        description: "Turso is a distributed SQLite database built for the edge, with sub-millisecond latency worldwide.",
        industry: "Infrastructure",
        stage: "Series A",
        founded: "2022",
        hq: "Remote",
        status: 'new',
        tags: ['database', 'edge', 'sqlite']
    },
    {
        id: "21",
        name: "Runway",
        website: "https://runwayml.com",
        description: "Runway is an applied AI research company building the next generation of creative tools for video and media.",
        industry: "AI",
        stage: "Series C",
        founded: "2018",
        hq: "New York, NY",
        status: 'new',
        tags: ['generative-ai', 'video', 'creative']
    },
    {
        id: "22",
        name: "Glean",
        website: "https://glean.com",
        description: "Glean is a work AI platform that searches across all company apps to surface the most relevant information instantly.",
        industry: "AI",
        stage: "Series D",
        founded: "2019",
        hq: "Palo Alto, CA",
        status: 'new',
        tags: ['enterprise-search', 'ai', 'knowledge']
    },
    {
        id: "23",
        name: "Cohere",
        website: "https://cohere.com",
        description: "Cohere provides enterprise AI models for language understanding, generation, and semantic search.",
        industry: "AI",
        stage: "Series C",
        founded: "2019",
        hq: "Toronto, Canada",
        status: 'new',
        tags: ['llm', 'enterprise-ai', 'nlp']
    },
    {
        id: "24",
        name: "Warp",
        website: "https://warp.dev",
        description: "Warp is the AI-powered terminal for developers, reimagining the command-line experience with collaboration and intelligence.",
        industry: "Developer Tools",
        stage: "Series B",
        founded: "2020",
        hq: "New York, NY",
        status: 'new',
        tags: ['terminal', 'developer-tools', 'ai']
    },
    {
        id: "25",
        name: "Neon",
        website: "https://neon.tech",
        description: "Neon is a serverless Postgres database with branching, instant provisioning, and scale-to-zero.",
        industry: "Infrastructure",
        stage: "Series B",
        founded: "2021",
        hq: "Remote",
        status: 'new',
        tags: ['database', 'serverless', 'postgres']
    },
];
