export const portfolio = {
  name: "Saeid Kabak",
  role: "Software Engineer",
  location: "Leipzig · Germany",
  email: "saeedkabak@gmail.com",
  github: "https://github.com/S3eedkabak",
  linkedin: "https://www.linkedin.com/in/saeed-saeed-5311a3309",
  bio: "I build useful software around real constraints: robust applications, asynchronous systems, and AI workflows that have to survive contact with reality.",
  education: "BSc (Hons) Software Engineering · Lancaster University Leipzig · Expected October 2026",
  skills: [
    { label: "Languages", value: "Java · Python · JavaScript · HTML/CSS · SQL" },
    { label: "Backend", value: "Node.js · Express · REST APIs · RabbitMQ" },
    { label: "Architecture", value: "Layered systems · Event-driven architecture · Sync/async workflows" },
    { label: "AI & Data", value: "RAG pipelines · Vector search · Embeddings · Algorithms" },
    { label: "DevOps", value: "Docker · Docker Compose · Jenkins · Git · Linux/Unix" },
  ],
  projects: [
    {
      number: "01",
      title: "GreenPoint",
      category: "PRODUCTION MOBILE",
      description: "A production mobile application for forest scientists to gather forestry data in remote environments without cellular or Wi-Fi connectivity.",
      stack: ["JavaScript", "Node.js", "Express", "Docker", "Jenkins"],
      url: "https://github.com/S3eedkabak/GreenPoint-TreeD",
    },
    {
      number: "02",
      title: "MARP Guide RAG",
      category: "AI INFRASTRUCTURE",
      description: "A collaborative RAG chatbot built around asynchronous processing, retrieval, and conversational AI.",
      stack: ["Java", "React", "RabbitMQ", "RAG", "Docker"],
      url: "https://github.com/DominykasPivo/MARP-Guide-RAG-Chatbot",
    },
  ],
  experience: {
    period: "JAN — MAR 2026",
    title: "Software Engineer · Technical Lead",
    company: "Helmholtz Centre for Environmental Research (UFZ)",
    description: "Led the production delivery of GreenPoint, guiding technical decisions from production readiness through delivery for a mobile field-research application.",
  },
};

export const themes = [
  { id: "sky", label: "Sky" },
  { id: "paper", label: "Paper" },
  { id: "ink", label: "Ink" },
];