(() => {
  "use strict";

  const projectAsset = file => `assets/projects/${file}`;

  window.PORTFOLIO_PROJECTS = {
    featuredId: "pawhaven",

    introduction:
      "A visual collection of information systems, interactive websites, prototypes, analytics and infrastructure concepts.",

    categories: [
      { id: "all", label: "All projects" },
      { id: "systems", label: "Systems" },
      { id: "web", label: "Web & interactive" },
      { id: "prototype", label: "UI/UX prototypes" },
      { id: "data", label: "Data & infrastructure" }
    ],

    projects: [
      {
        id: "pawhaven",
        number: "01",
        code: "SYS-01",
        title: "PAWHAVEN",
        subtitle: "Pet Daycare Management System",
        category: "systems",
        status: "Completed",
        accent: "#4fe0bc",
        accent2: "#8b5cf6",
        summary:
          "A web-based pet daycare system that connects customer, pet, booking, payment and care records in one database.",
        contribution:
          "Interface design, database structure, role-based workflow and system development.",
        outcome:
          "A complete multi-role workflow with QR payment, care records and PDF reporting.",
        features: [
          "Customer · Staff · Admin",
          "Booking and payment",
          "Care records and reports"
        ],
        tools: [
          { name: "HTML", icon: "html5", color: "E34F26", short: "H5" },
          { name: "CSS", icon: "css", color: "663399", short: "CSS" },
          { name: "JavaScript", icon: "javascript", color: "F7DF1E", short: "JS" },
          { name: "PHP", icon: "php", color: "777BB4", short: "PHP" },
          { name: "MySQL", icon: "mysql", color: "4479A1", short: "MY" }
        ],
        images: [
          projectAsset("pawhaven1.png"),
          projectAsset("pawhaven2.png"),
          projectAsset("pawhaven3.png"),
          projectAsset("pawhaven4.png"),
          projectAsset("pawhaven5.png"),
          projectAsset("pawhaven6.png"),
          projectAsset("pawhaven7.png"),
          projectAsset("pawhaven8.png"),
          projectAsset("pawhaven9.png"),
          projectAsset("pawhaven10.png"),
          projectAsset("pawhaven11.png"),
          projectAsset("pawhaven12.png"),
          projectAsset("pawhaven13.png"),
          projectAsset("pawhaven14.png"),
          projectAsset("pawhaven15.png")
        ],
        thumbnail: projectAsset("pawhaven-thumb.png")
      },

      {
        id: "farme",
        number: "02",
        code: "SYS-02",
        title: "FARMÉ",
        subtitle: "Grocery Market Management System",
        category: "systems",
        status: "Completed",
        accent: "#42dc78",
        accent2: "#c7f464",
        summary:
          "A web grocery platform with customer and admin workflows for products, inventory, orders and purchases.",
        contribution:
          "Interface design, database integration, shopping flow and administrative dashboard.",
        outcome:
          "End-to-end product discovery, order placement, stock control and downloadable receipt generation.",
        features: [
          "Products and inventory",
          "Search and categories",
          "Orders and receipts"
        ],
        tools: [
          { name: "HTML", icon: "html5", color: "E34F26", short: "H5" },
          { name: "CSS", icon: "css", color: "663399", short: "CSS" },
          { name: "JavaScript", icon: "javascript", color: "F7DF1E", short: "JS" },
          { name: "PHP", icon: "php", color: "777BB4", short: "PHP" },
          { name: "phpMyAdmin", icon: "phpmyadmin", color: "6C78AF", short: "PM" }
        ],
        images: [
          projectAsset("farme1.png"),
          projectAsset("farme2.png"),
          projectAsset("farme3.png"),
          projectAsset("farme4.png"),
          projectAsset("farme5.png"),
          projectAsset("farme6.png"),
          projectAsset("farme7.png"),
          projectAsset("farme8.png")
        ],
        thumbnail: projectAsset("farme-thumb.png")
      },

      {
        id: "flowsity",
        number: "03",
        code: "UX-03",
        title: "FLOWSITY",
        subtitle: "Campus Navigation Mobile App Prototype",
        category: "prototype",
        status: "Prototype",
        accent: "#16d3dd",
        accent2: "#2f7cff",
        summary:
          "A mobile navigation concept that helps students and staff locate campus facilities more efficiently.",
        contribution:
          "UX planning, interface design, wayfinding flows and gamification concepts.",
        outcome:
          "A high-fidelity campus wayfinding experience designed for accessibility and engagement.",
        features: [
          "Campus navigation",
          "Friend finder and locator",
          "Gamified student experience"
        ],
        tools: [
          { name: "Figma", icon: "figma", color: "F24E1E", short: "FG" },
          { name: "Canva", icon: "canva", color: "00C4CC", short: "CV" },
          { name: "UI/UX Design", short: "UX" }
        ],
        images: [
          projectAsset("flowsity1.png"),
          projectAsset("flowsity2.png"),
          projectAsset("flowsity3.png"),
          projectAsset("flowsity4.png"),
          projectAsset("flowsity5.png"),
          projectAsset("flowsity6.png"),
          projectAsset("flowsity7.png"),
          projectAsset("flowsity8.png"),
          projectAsset("flowsity9.png"),
          projectAsset("flowsity10.png"),
          projectAsset("flowsity11.png"),
          projectAsset("flowsity12.png"),
          projectAsset("flowsity13.png"),
          projectAsset("flowsity14.png"),
          projectAsset("flowsity15.png"),
          projectAsset("flowsity16.png")
        ],
        thumbnail: projectAsset("flowsity-thumb.png")
      },

      {
        id: "sprouts",
        number: "04",
        code: "UX-04",
        title: "SPROUTS",
        subtitle: "Food Supply Chain Solution Prototype",
        category: "prototype",
        status: "Prototype",
        accent: "#58db72",
        accent2: "#9fdd54",
        summary:
          "A research-led mobile concept addressing food supply-chain visibility and distribution challenges in Indonesia.",
        contribution:
          "Problem framing, UX design, high-fidelity prototyping and AI/IoT concept integration.",
        outcome:
          "A connected farmer-to-distribution concept with tracking, alerts and demand insights.",
        features: [
          "Shipment tracking",
          "Demand and price insights",
          "Cold-chain monitoring"
        ],
        tools: [
          { name: "Figma", icon: "figma", color: "F24E1E", short: "FG" },
          { name: "Canva", icon: "canva", color: "00C4CC", short: "CV" },
          { name: "AI Concept", short: "AI" },
          { name: "IoT Concept", short: "IoT" }
        ],
        images: [
          projectAsset("sprouts1.png"),
          projectAsset("sprouts2.png"),
          projectAsset("sprouts3.png"),
          projectAsset("sprouts4.png"),
          projectAsset("sprouts5.png"),
          projectAsset("sprouts6.png"),
          projectAsset("sprouts7.png"),
          projectAsset("sprouts8.png"),
          projectAsset("sprouts9.png"),
          projectAsset("sprouts10.png"),
          projectAsset("sprouts11.png"),
          projectAsset("sprouts12.png"),
          projectAsset("sprouts13.png"),
          projectAsset("sprouts14.png"),
          projectAsset("sprouts15.png"),
          projectAsset("sprouts16.png"),
          projectAsset("sprouts17.png")
        ],
        thumbnail: projectAsset("sprouts-thumb.png")
      },

      {
        id: "axn",
        number: "05",
        code: "WEB-05",
        title: "AXN",
        subtitle: "Educational Solar System Website",
        category: "web",
        status: "Completed",
        accent: "#3b83ff",
        accent2: "#ffc968",
        summary:
          "An interactive educational website for exploring planets, constellations and space-related information.",
        contribution:
          "Responsive interface, data visualisation, theme modes and JavaScript interactions.",
        outcome:
          "A responsive learning experience that presents space information through visual exploration.",
        features: [
          "Planet exploration",
          "Interactive data visuals",
          "Dark and light modes"
        ],
        tools: [
          { name: "HTML", icon: "html5", color: "E34F26", short: "H5" },
          { name: "CSS", icon: "css", color: "663399", short: "CSS" },
          { name: "JavaScript", icon: "javascript", color: "F7DF1E", short: "JS" },
          { name: "Chart.js", icon: "chartdotjs", color: "FF6384", short: "CH" }
        ],
        images: [
          projectAsset("axn1.png"),
          projectAsset("axn2.png"),
          projectAsset("axn3.png"),
          projectAsset("axn4.png"),
          projectAsset("axn5.png"),
          projectAsset("axn6.png"),
          projectAsset("axn7.png"),
          projectAsset("axn8.png"),
          projectAsset("axn9.png")
        ],
        thumbnail: projectAsset("axn-thumb.png")
      },

      {
        id: "infinity",
        number: "06",
        code: "INF-06",
        title: "INFINITY",
        subtitle: "Enterprise Data Center Design",
        category: "data",
        status: "Concept Design",
        accent: "#3987ff",
        accent2: "#99c7ff",
        summary:
          "A conceptual enterprise data center integrating technical facilities, operational zones and supporting infrastructure.",
        contribution:
          "Campus planning, 3D modelling, facility layout and technical visualisation.",
        outcome:
          "A complete 2D and 3D environment communicating the scale and logic of a modern data center.",
        features: [
          "Enterprise facility planning",
          "Robotics and IoT concepts",
          "Complete 2D and 3D model"
        ],
        tools: [
          {
            name: "Coohom",
            logoUrl: "https://www.google.com/s2/favicons?domain=coohom.com&sz=128",
            short: "CH"
          },
          { name: "Canva", icon: "canva", color: "00C4CC", short: "CV" },
          { name: "3D Visualisation", short: "3D" }
        ],
        images: [
          projectAsset("infinity1.png"),
          projectAsset("infinity2.png"),
          projectAsset("infinity3.png"),
          projectAsset("infinity4.png"),
          projectAsset("infinity5.png"),
          projectAsset("infinity6.png"),
          projectAsset("infinity7.png"),
          projectAsset("infinity8.png"),
          projectAsset("infinity9.png"),
          projectAsset("infinity10.png"),
          projectAsset("infinity11.png"),
          projectAsset("infinity12.png"),
          projectAsset("infinity13.png"),
          projectAsset("infinity14.png"),
          projectAsset("infinity15.png")
          ],
        thumbnail: projectAsset("infinity-thumb.png")
      },

      {
        id: "ecerts",
        number: "07",
        code: "SYS-07",
        title: "E-CERTS",
        subtitle: "Certificate Generator System",
        category: "systems",
        status: "Completed",
        accent: "#22d3ee",
        accent2: "#5b48ff",
        summary:
          "A web certificate generation system with participant records, event information and downloadable PDF certificates.",
        contribution:
          "Dark admin interface, database workflow, participant management and PDF generation.",
        outcome:
          "Centralised registration and certificate issuance through one protected system.",
        features: [
          "Secure account access",
          "Participant records",
          "Downloadable PDF output"
        ],
        tools: [
          { name: "HTML", icon: "html5", color: "E34F26", short: "H5" },
          { name: "CSS", icon: "css", color: "663399", short: "CSS" },
          { name: "JavaScript", icon: "javascript", color: "F7DF1E", short: "JS" },
          { name: "PHP", icon: "php", color: "777BB4", short: "PHP" },
          { name: "MySQL", icon: "mysql", color: "4479A1", short: "MY" }
        ],
        images: [
          projectAsset("ecerts1.png"),
          projectAsset("ecerts2.png"),
          projectAsset("ecerts3.png"),
          projectAsset("ecerts4.png"),
          projectAsset("ecerts5.png"),
          projectAsset("ecerts6.png"),
          projectAsset("ecerts7.png")
        ],
        thumbnail: projectAsset("ecerts-thumb.png")
      },

      {
        id: "kundasang",
        number: "08",
        code: "WEB-08",
        title: "PEKAN KUNDASANG",
        subtitle: "Community Website Design",
        category: "web",
        status: "Completed",
        accent: "#27d179",
        accent2: "#13b8d0",
        summary:
          "An informational tourism website highlighting local attractions, culture, facilities and heritage in Pekan Kundasang.",
        contribution:
          "Responsive web design, interactive content, image sliders and JavaScript animation.",
        outcome:
          "A visual community platform that makes local tourism information easy to discover.",
        features: [
          "Tourism information",
          "Interactive image sliders",
          "Responsive navigation"
        ],
        tools: [
          { name: "HTML", icon: "html5", color: "E34F26", short: "H5" },
          { name: "CSS", icon: "css", color: "663399", short: "CSS" },
          { name: "JavaScript", icon: "javascript", color: "F7DF1E", short: "JS" }
        ],
        images: [
          projectAsset("kundasang1.png"),
          projectAsset("kundasang2.png"),
          projectAsset("kundasang3.png"),
          projectAsset("kundasang4.png"),
          projectAsset("kundasang5.png"),
          projectAsset("kundasang6.png"),
          projectAsset("kundasang7.png"),
          projectAsset("kundasang8.png")
        ],
        thumbnail: projectAsset("kundasang-thumb.png")
      },

      {
        id: "purrs",
        number: "09",
        code: "UX-09",
        title: "PURRS OF HOPE",
        subtitle: "Puzzle Game Prototype",
        category: "prototype",
        status: "Prototype",
        accent: "#50d8a6",
        accent2: "#8b5cf6",
        summary:
          "A story-driven puzzle game concept combining match gameplay, progression and a cat-rescue narrative.",
        contribution:
          "Game interface design, visual direction, interaction flow and prototype animation.",
        outcome:
          "A cohesive playable concept with progression, rewards and character-driven storytelling.",
        features: [
          "Story-based gameplay",
          "Puzzle progression",
          "Interactive game interface"
        ],
        tools: [
          { name: "Figma", icon: "figma", color: "F24E1E", short: "FG" },
          { name: "Canva", icon: "canva", color: "00C4CC", short: "CV" },
          { name: "Game UI Design", short: "GUI" }
        ],
        images: [
          projectAsset("purrs1.png"),
          projectAsset("purrs2.png"),
          projectAsset("purrs3.png"),
          projectAsset("purrs4.png"),
          projectAsset("purrs5.png"),
          projectAsset("purrs6.png"),
          projectAsset("purrs7.png"),
          projectAsset("purrs8.png"),
          projectAsset("purrs9.png"),
          projectAsset("purrs10.png")
        ],
        thumbnail: projectAsset("purrs-thumb.png")
      },

      {
        id: "travel",
        number: "10",
        code: "DAT-10",
        title: "TRAVEL DATA",
        subtitle: "Visualisation & Analysis",
        category: "data",
        status: "Completed",
        accent: "#22c8d9",
        accent2: "#ff827a",
        summary:
          "An RStudio analysis of travel data created to reveal distributions, patterns and decision-ready insights.",
        contribution:
          "Data cleaning, exploratory analysis, visualisation and interpretation.",
        outcome:
          "A visual analytical report supporting clearer understanding of traveller behaviour.",
        features: [
          "Data preparation",
          "Statistical visualisation",
          "Pattern identification"
        ],
        tools: [
          { name: "R", icon: "r", color: "276DC3", short: "R" },
          { name: "RStudio", icon: "rstudioide", color: "75AADB", short: "RS" },
          { name: "ggplot2", short: "GG" }
        ],
        images: [
          projectAsset("travel1.png"),
          projectAsset("travel2.png"),
          projectAsset("travel3.png"),
          projectAsset("travel4.png"),
          projectAsset("travel5.png"),
          projectAsset("travel6.png")
        ],
        thumbnail: projectAsset("travel-thumb.png")
      },

      {
        id: "hospital",
        number: "11",
        code: "SYS-11",
        title: "HOSPITAL PATIENT",
        subtitle: "Information System",
        category: "systems",
        status: "Completed",
        accent: "#56c9c3",
        accent2: "#2f70ff",
        summary:
          "A relational Microsoft Access system for managing patients, doctors, appointments and medical records.",
        contribution:
          "Table relationships, forms, queries and user workflow design.",
        outcome:
          "A desktop database prototype connecting core hospital records through one interface.",
        features: [
          "Relational database",
          "Patient and doctor records",
          "Appointment forms"
        ],
        tools: [
          { name: "Microsoft Access", icon: "microsoftaccess", color: "A4373A", short: "AC" },
          { name: "Relational Database", short: "DB" }
        ],
        images: [
          projectAsset("hospital1.png"),
          projectAsset("hospital2.png"),
          projectAsset("hospital3.png"),
          projectAsset("hospital4.png"),
          projectAsset("hospital5.png"),
          projectAsset("hospital6.png"),
          projectAsset("hospital7.png"),
          projectAsset("hospital8.png")


        ],
        thumbnail: projectAsset("hospital-thumb.png")
      },

        {
      id: "tableau",
      number: "12",
      code: "DAT-12",
      title: "TABLEAU ANALYSIS DASHBOARD",
      subtitle: "Visualization",
      category: "data",
      status: "Completed",
      accent: "#1f77b4",
      accent2: "#56c9c3",
      summary:
      "Interactive Tableau dashboards developed using a dataset of 2,000 cancer patients to present nutritional insights and cancer risk analysis.",
      contribution:
      "Dashboard design, data visualization, chart development and transformation of complex patient data into clear visual insights.",
      outcome:
      "An interactive dashboard that presents nutritional patterns and cancer risk factors in a clear, meaningful and easy-to-understand format.",
      features: [
      "Interactive Tableau dashboard",
      "Nutrition and cancer risk analysis",
      "Visual analysis of 2,000 patient records"
    ],
    tools: [
    {
      name: "Tableau",
      icon: "tableau",
      color: "E97627",
      short: "TB"
    }
    ],
    images: [
    projectAsset("data1.png"),
    projectAsset("data2.png"),
    projectAsset("data3.png"),
    projectAsset("data4.png")
    ],
    thumbnail: projectAsset("data-thumb.png")
      },

      {
        id: "summit",
        number: "13",
        code: "DEV-13",
        title: "SUMMIT AIRWAYS",
        subtitle: "Flight Booking System",
        category: "systems",
        status: "Completed",
        accent: "#5da3ff",
        accent2: "#ffc857",
        summary:
          "A console-based flight booking system for search, seat selection, add-ons, payment and booking documents.",
        contribution:
          "Object-oriented logic, validation, booking workflow and console interface.",
        outcome:
          "An end-to-end booking simulation demonstrating structured C++ development.",
        features: [
          "Flight search",
          "Seat and add-on selection",
          "Booking document output"
        ],
        tools: [
          { name: "C++", icon: "cplusplus", color: "00599C", short: "C++" },
          { name: "Visual Studio", icon: "visualstudio", color: "5C2D91", short: "VS" }
        ],
        images: [
          projectAsset("summit1.png"),
          projectAsset("summit2.png"),
          projectAsset("summit3.png"),
          projectAsset("summit4.png"),
          projectAsset("summit5.png"),
          projectAsset("summit6.png"),
          projectAsset("summit7.png"),
          projectAsset("summit8.png"),
          projectAsset("summit9.png")
    
        ],
        thumbnail: projectAsset("summit-thumb.png")
      },

      {
        id: "healthfirst",
        number: "14",
        code: "DEV-14",
        title: "HEALTHFIRST",
        subtitle: "Clinic Management System",
        category: "systems",
        status: "Completed",
        accent: "#29d08a",
        accent2: "#3b82f6",
        summary:
          "A C++ clinic system for patient registration, medication records, reminders and medicine stock control.",
        contribution:
          "Program logic, menu flow, data structures and input validation.",
        outcome:
          "A functional clinic workflow demonstrating structured programming and practical record management.",
        features: [
          "Patient registration",
          "Medication records",
          "Stock and reminder control"
        ],
        tools: [
          { name: "C++", icon: "cplusplus", color: "00599C", short: "C++" },
          { name: "Console Application", short: "CLI" }
        ],
        images: [
          projectAsset("healthfirst1.png"),
          projectAsset("healthfirst2.png"),
          projectAsset("healthfirst3.png"),
          projectAsset("healthfirst4.png"),
          projectAsset("healthfirst5.png"),
          projectAsset("healthfirst6.png")

        ],
        thumbnail: projectAsset("healthfirst-thumb.png")
      }
    ]
  };
})();
