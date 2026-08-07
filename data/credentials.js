(() => {
  "use strict";

  const credentialAsset = file => `assets/credentials/${file}`;

  window.PORTFOLIO_CREDENTIALS = {
    featuredId: "fortinet-fundamentals",

    introduction:
      "Certificates and professional learning across cybersecurity, AI, technology, achievement and participation.",

    categories: [
      { id: "all", label: "All certificates" },
      { id: "cybersecurity", label: "Cybersecurity" },
      { id: "ai", label: "AI & technology" },
      { id: "achievement", label: "Achievements" },
      { id: "participation", label: "Participation" }
    ],

    certificates: [
      {
        id: "fortinet-fundamentals",
        title: "Fortinet Certified Fundamentals in Cybersecurity",
        issuer: "Fortinet Training Institute",
        category: "cybersecurity",
        status: "Completed",
        image: credentialAsset("certificate-07.png")
      },
      {
        id: "fortinet-associate",
        title: "Fortinet Certified Associate in Cybersecurity",
        issuer: "Fortinet Training Institute",
        category: "cybersecurity",
        status: "Completed",
        image: credentialAsset("certificate-08.png")
      },
      {
        id: "anti-scam-challenge",
        title: "AI Anti-Scam Challenge 2026",
        issuer: "Kolaxus",
        category: "ai",
        status: "Participant",
        image: credentialAsset("certificate-05.png")
      },
      {
        id: "ai-ready-malaysia",
        title: "AI Ready Malaysia — Student Edition",
        issuer: "AVPN · Pepper Labs",
        category: "ai",
        status: "Completed",
        image: credentialAsset("certificate-06.png")
      },
      {
        id: "hrd-completion",
        title: "Explore AI Basic",
        issuer: "HRD Corp e-LATiH",
        category: "ai",
        status: "Completed",
        image: credentialAsset("certificate-04.png")
      },
      {
        id: "best-design-achievement",
        title: "Best Design Award (Silver)",
        issuer: "Digital Frontier · UiTM ",
        category: "achievement",
        status: "Awarded",
        image: credentialAsset("certificate-01.png")
      },
      {
        id: "sijil-penghargaan",
        title: "Program Bengkel PHP",
        issuer: "UiTM",
        category: "participation",
        status: "Awarded",
        image: credentialAsset("certificate-02.png")
      },
      {
        id: "certificate-participation",
        title: "International Student Forum",
        issuer: "Programme Organiser",
        category: "participation",
        status: "Participant",
        image: credentialAsset("certificate-03.png")
      },
      {
        id: "malaysia-asean-growth",
        title: "From Malaysia to ASEAN: A Journey of Personal and Professional Growth",
        issuer: "UiTM",
        category: "participation",
        status: "Appreciation",
        image: credentialAsset("certificate-09.png")
      },
      {
        id: "top-ten-finalist",
        title: "Top 10 Finalist Proto-A-Thon International Design Competition",
        issuer: "BINUS University · IDFOOD",
        category: "achievement",
        status: "Finalist",
        image: credentialAsset("certificate-10.png")
      },
      {
        id: "AI-for-my-future",
        title: "AI For MY Future",
        issuer: "Microsoft · Pepper Labs",
        category: "ai",
        status: "Completed",
        image: credentialAsset("certificate-11.png")
      },
      {
        id: "data-analysis",
        title: "Powerful Data Analysis",
        issuer: "HRD Corp e-LATiH",
        category: "participation",
        status: "Completed",
        image: credentialAsset("certificate-12.png")
      },
      {
        id: "mendeley-citation",
        title: "Mendeley: Effective Citation",
        issuer: "UiTM",
        category: "participation",
        status: "Completed",
        image: credentialAsset("certificate-13.png")
      },
      {
        id: "symposium-of-is",
        title: "Top 10 Finalist Recognition",
        issuer: "UiTM · Sukhotai Thammathirat Open University",
        category: "participation",
        status: "Completed",
        image: credentialAsset("certificate-14.png")
         },
      {
        id: "intro-data-science",
        title: "Introduction to Data Science",
        issuer: "Cisco Networking Academy",
        category: "completion",
        status: "Completed",
        image: credentialAsset("certificate-15.png")
         },
      {
        id: "intro-modern-ai",
        title: "Introduction to Modern AI",
        issuer: "Cisco Networking Academy",
        category: "ai",
        status: "Completed",
        image: credentialAsset("certificate-16.png")
         },
      {
        id: "bicara-ilmu",
        title: "Bicara Ilmu - The Higher Education Dilemma: Balancing AI Advancements with Ethical Concerns in Teaching, Learning, and Assessments",
        issuer: "UiTM",
        category: "participation",
        status: "Participant",
        image: credentialAsset("certificate-17.png")
         },
      {
        id: "jelajah-HIV",
        title: "Program Jelajah Sihat HIV dan Derma Darah 2025 ",
        issuer: "UiTM",
        category: "Completion",
        status: "Participant",
        image: credentialAsset("certificate-18.png")
         },
      {
        id: "meet-and-greet",
        title: "Program Meet & Greet Bersama Penulis Buku Muda Sempena Festival of Idea Putrajaya (PUTRAJAYA FOI) 2025",
        issuer: "UiTM",
        category: "Completion",
        status: "Participant",
        image: credentialAsset("certificate-19.png")
      }
    ]
  };
})();
