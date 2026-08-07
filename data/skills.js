(() => {
  "use strict";

  window.PORTFOLIO_SKILLS = {
    introduction:
      "Nine skills organised around technology, systems and people",

    skills: [
      {
        id: "programming",
        code: "TEC-01",
        name: "Programming",
        category: "technology",
        symbol: "CD",
        strength: 66,
        strengthLabel: "Working Knowledge",
        shortDescription: "Logic, structure and application development.",
        summary:
          "Using programming basics to create simple solutions, process information and build functional systems.",
        tools: [
          { name: "C++", icon: "cplusplus", color: "00599C", short: "C++" },
          { name: "PHP", icon: "php", color: "777BB4", short: "PHP" }
        ],
        evidence:
  "Uses programming concepts such as variables, functions, conditions, loops and structured logic to develop simple programs and work through practical technical problems."
      },

      {
        id: "data-analytics",
        code: "SYS-02",
        name: "Data & Analytics",
        category: "systems",
        symbol: "DA",
        strength: 74,
        strengthLabel: "Developing",
        shortDescription: "Turning raw data into understandable findings.",
        summary:
          "Preparing, exploring and presenting data so information can support clearer decisions.",
        tools: [
          { name: "Tableau", icon: "tableau", color: "E97627", short: "TB" },
          { name: "RStudio", icon: "rstudioide", color: "75AADB", short: "R" },
          { name: "OpenRefine", icon: "openrefine", color: "148B8A", short: "OR" }
        ],
        evidence:
  "Uses data-cleaning, visualisation and analytical tools to explore information, identify useful patterns and present findings in a clear and understandable way."
      },

      {
        id: "web-development",
        code: "TEC-03",
        name: "Web Development",
        category: "technology",
        symbol: "WD",
        strength: 82,
        strengthLabel: "Proficient",
        shortDescription: "Responsive and interactive digital experiences.",
        summary:
          "Building responsive and interactive websites using structured front-end development practices.",
        tools: [
          { name: "HTML", icon: "html5", color: "E34F26", short: "H5" },
          { name: "CSS", icon: "css", color: "663399", short: "CSS" },
          { name: "JavaScript", icon: "javascript", color: "F7DF1E", short: "JS" },
          { name: "GitHub", icon: "github", color: "FFFFFF", short: "GH" }
        ],
        evidence:
  "Builds responsive web pages and interactive components while considering layout, usability and how the website works across desktop and mobile screen sizes."
      },

      {
        id: "design-uiux",
        code: "HUM-04",
        name: "Design & UI/UX",
        category: "human",
        symbol: "UX",
        strength: 85,
        strengthLabel: "Proficient",
        shortDescription: "Clear interfaces built around real user needs.",
        summary:
          "Creating clear and user-friendly interfaces with attention to layout, usability and visual presentation.",
        tools: [
          { name: "Figma", icon: "figma", color: "F24E1E", short: "FG" },
          { name: "Canva", icon: "canva", color: "00C4CC", short: "CV" },
          {
            name: "Coohom",
            logoUrl: "https://www.google.com/s2/favicons?domain=coohom.com&sz=128",
            short: "CH"
          }
        ],
        evidence:
          "Creates interface concepts, visual layouts and simple prototypes with attention to usability, visual hierarchy and making information easier for users to understand."
      },

      {
        id: "database-rdbms",
        code: "SYS-05",
        name: "Database & RDBMS",
        category: "systems",
        symbol: "DB",
        strength: 68,
        strengthLabel: "Working Knowledge",
        shortDescription: "Organised, reliable and retrievable information.",
        summary:
          "Structuring, maintaining and retrieving information through relational database systems.",
        tools: [
          { name: "MySQL", icon: "mysql", color: "4479A1", short: "MY" },
          { name: "phpMyAdmin", icon: "phpmyadmin", color: "6C78AF", short: "PM" }
        ],
        evidence:
  "Creates relational tables, manages records and uses database queries to organise, update and retrieve information in a structured and reliable way."
      },

      {
        id: "microsoft-tools",
        code: "SYS-06",
        name: "Microsoft Tools",
        category: "systems",
        symbol: "MS",
        strength: 74,
        strengthLabel: "Proficient",
        shortDescription: "Productivity, analysis and project organisation.",
        summary:
          "Using Microsoft productivity and project tools to organise information, analyse data and manage work.",
        tools: [
          { name: "Excel", icon: "microsoftexcel", color: "217346", short: "XL" },
          { name: "Access", icon: "microsoftaccess", color: "A4373A", short: "AC" },
          {
            name: "Microsoft Project",
            logoUrl: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
            short: "PJ"
          }
        ],
        evidence:
        "Uses spreadsheets, databases and project-planning tools to organise information, analyse data, manage tasks and prepare clear reports for academic and project work."
      },

      {
        id: "ai-productivity",
        code: "TEC-07",
        name: "AI Productivity",
        category: "technology",
        symbol: "AI",
        strength: 93,
        strengthLabel: "Proficient",
        shortDescription: "Research, ideation and faster problem-solving.",
        summary:
          "Using artificial-intelligence tools to support research, ideation, writing and problem-solving.",
        tools: [
          { name: "ChatGPT", icon: "openai", color: "10A37F", short: "AI" },
          { name: "Gemini", icon: "googlegemini", color: "8E75B2", short: "GM" },
          { name: "Grok", icon: "x", color: "FFFFFF", short: "GR" },
          { name: "Claude", icon: "claude", color: "D97757", short: "CL" },
          { name: "Perplexity", icon: "perplexity", color: "20B8CD", short: "PX" }
        ],
        evidence:
          "Uses different AI tools to research topics, explore ideas, improve writing and support problem-solving while checking and reviewing the generated information carefully."
      },

      {
        id: "soft-skills",
        code: "HUM-08",
        name: "Soft Skills",
        category: "human",
        symbol: "SS",
        strength: 77,
        strengthLabel: "Strong",
        shortDescription: "Teamwork, time ownership and practical thinking.",
        summary:
          "Working well with others while managing time, responsibilities and everyday challenges.",
        tools: [
          { name: "Teamwork", short: "TW" },
          { name: "Time Management", short: "TM" },
          { name: "Problem-Solving", short: "PS" }
        ],
        evidence:
         "Works with others during group tasks, manages responsibilities and deadlines, and approaches everyday challenges in a organised and cooperative way."

      },

      {
        id: "languages",
        code: "HUM-09",
        name: "Languages",
        category: "human",
        symbol: "Aa",
        strength: 76,
        strengthLabel: "Communicative",
        shortDescription: "Clear communication in Malay and English.",
        summary:
          "Sharing ideas and information in Malay and English for study, work and teamwork.",
        tools: [
          { name: "Malay — Native", short: "BM" },
          { name: "English — Intermediate", short: "EN" }
        ],
        evidence:
  "Communicates naturally in Malay and uses English for documentation, presentations, discussions and technical tasks in academic and collaborative environment."      }
    ]
  };
})();
