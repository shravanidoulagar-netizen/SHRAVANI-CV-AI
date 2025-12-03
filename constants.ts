import { ResumeData } from './types';

export const RESUME_DATA: ResumeData = {
  name: "Shravani Doulagar",
  title: "Sales & Marketing Strategist",
  contact: {
    email: "doulagarshravani@gmail.com",
    phone: "+33 745506244",
    location: "Aubervilliers, France",
    linkedin: "linkedin.com/in/shravani-doulagar-97b844160"
  },
  summary: "Sales & Marketing strategist with 5+ years of progressive experience in FMCG, B2B, and luxury sectors, driving revenue growth through data-driven sales enablement, digital transformation, and performance optimization. Adept at leveraging advanced sales technologies such as CRM (Salesforce, Zoho), BI tools (Tableau, Power BI), Excel (Pivot Tables, Macros), SQL, and AI-enabled analytics platforms to turn complex data into actionable insights.",
  skills: [
    { category: "CRM", items: "Salesforce, Zoho CRM, HubSpot" },
    { category: "Analytics & BI", items: "Tableau, Power BI, Google Data Studio, Excel (Advanced), SQL" },
    { category: "Marketing Tech", items: "Google Analytics, Hootsuite, Meta Ads, Mailchimp" },
    { category: "Productivity", items: "Google Sheets (Apps Script), Microsoft PowerPoint, Outlook" },
    { category: "AI/Automation", items: "ChatGPT for sales emails, RPA basics, lead scoring models" }
  ],
  experience: [
    {
      role: "Sales Territory Manager",
      company: "Hafele (Luxury Division: Asko & Falmec)",
      period: "02/2024 – 02/2025",
      location: "Hyderabad, India",
      points: [
        "Conducted sales funnel diagnostics using CRM and advanced Excel to measure sales velocity.",
        "Created interactive dashboards in Tableau and Power BI to visualize pipeline health.",
        "Utilized SQL queries to extract and analyze sales operations data for real-time decision-making.",
        "Built quarterly sales target models and campaign ROI calculations using Google Sheets.",
        "Delivered cross-departmental briefings on performance and GTM strategies."
      ]
    },
    {
      role: "Sales Territory Officer",
      company: "Marico",
      period: "03/2023 – 10/2023",
      location: "Hyderabad, India",
      points: [
        "Deployed geo-analytics tools to assess route coverage and territory gaps.",
        "Developed channel performance scorecards using Excel PivotTables and macros.",
        "Designed KPI dashboards on Google Data Studio integrating sales trends.",
        "Enhanced trade promotion efficiency by applying insights from consumer purchase behavior."
      ]
    },
    {
      role: "Area Sales Representative",
      company: "Monster Energy",
      period: "03/2021 – 03/2023",
      location: "Hyderabad, India",
      points: [
        "Digitized field sales tracking using mobile-first CRM apps.",
        "Identified and segmented high-value outlets with RFM analysis.",
        "Integrated AI-enabled sales forecast models to manage monthly performance goals.",
        "Coordinated loyalty program rollout using data insights."
      ]
    },
    {
      role: "Accounting Manager",
      company: "OLX PVT LTD",
      period: "05/2019 – 07/2020",
      location: "Hyderabad, India",
      points: [
        "Led data-driven partner onboarding, managing CRM integrations Salesforce.",
        "Monitored builder/dealer KPIs using BI tools and A/B testing.",
        "Conducted sales productivity audits using Excel Solver.",
        "Created automation workflows using Google Apps Script."
      ]
    },
    {
      role: "Business Development Executive",
      company: "Cogoport",
      period: "11/2018 – 04/2019",
      location: "Hyderabad, India",
      points: [
        "Delivered data-centric solutions to import/export clients.",
        "Optimized lead-to-sale conversion through CRM tagging.",
        "Designed lead qualification models using Excel + SQL-based filtering."
      ]
    }
  ],
  education: [
    {
      degree: "MSc International Marketing",
      institution: "Omnes University",
      year: "02/2025",
      location: "Paris, France"
    },
    {
      degree: "MBA in Marketing & HR",
      institution: "Osmania University",
      year: "09/2015 – 04/2017",
      location: "Hyderabad, India"
    },
    {
      degree: "Bachelor of Commerce",
      institution: "Osmania University",
      year: "04/2012 – 05/2015",
      location: "Hyderabad, India"
    }
  ],
  languages: ["English", "French", "Hindi", "Telugu", "Marathi"],
  certificates: [
    "Google Data Analytics Professional Certificate",
    "Google Ads Search Certification",
    "LinkedIn Marketing Strategy Certificate"
  ]
};

export const SYSTEM_INSTRUCTION = `
You are Shravani Doulagar, a Sales & Marketing Strategist. 
You are currently talking to a recruiter or a professional contact visiting your profile.
Your goal is to showcase your expertise in data-driven sales, CRM, and digital transformation.
Speak in the first person ("I").
Use a professional, enthusiastic, and confident tone.

Here is your profile data to reference:

Summary: ${RESUME_DATA.summary}

Key Skills:
${RESUME_DATA.skills.map(s => `- ${s.category}: ${s.items}`).join('\n')}

Experience:
${RESUME_DATA.experience.map(e => `
- ${e.role} at ${e.company} (${e.period}, ${e.location})
  Key achievements: ${e.points.join('; ')}
`).join('\n')}

Education:
${RESUME_DATA.education.map(e => `- ${e.degree} from ${e.institution} (${e.year})`).join('\n')}

Languages: ${RESUME_DATA.languages.join(', ')}

Current Situation: You are currently pursuing an MSc in International Marketing in Paris at Omnes University. You are open to opportunities.
If asked about contact info, mention you can be reached at doulagarshravani@gmail.com.

When answering:
- Keep responses concise (under 30 seconds of speech) unless asked for details.
- Highlight specific tools (SQL, Tableau, Salesforce) when relevant.
- Emphasize your ability to combine technical data skills with sales strategy.
`;
