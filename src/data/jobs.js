// ============================================================
// jobs.js — Mock Job Data
// Replace this array with an API call (e.g., fetch/axios) when
// connecting to a backend. See comments below for integration hints.
// ============================================================

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova Solutions",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹8 – 12 LPA",
    shortDescription:
      "Build responsive, modern web interfaces with React and Tailwind CSS.",
    description:
      "We are looking for a talented Frontend Developer to join our growing product team at TechNova Solutions. You will be responsible for building high-quality user interfaces, collaborating closely with designers and backend engineers, and ensuring the best possible user experience across all devices.",
    requirements: [
      "3+ years of experience with React.js",
      "Strong knowledge of HTML5, CSS3, and JavaScript (ES6+)",
      "Experience with Bootstrap or Tailwind CSS",
      "Familiarity with RESTful APIs and Axios",
      "Version control using Git",
    ],
    posted: "2026-03-15",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CloudEdge Pvt Ltd",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹10 – 15 LPA",
    shortDescription:
      "Design and maintain scalable REST APIs using Node.js and MongoDB.",
    description:
      "CloudEdge is seeking an experienced Backend Developer with a passion for building scalable, reliable services. You will design and implement microservices, manage databases, and collaborate with frontend teams to deliver seamless product experiences.",
    requirements: [
      "3+ years with Node.js and Express.js",
      "Experience with MongoDB and SQL databases",
      "Knowledge of REST API design and JWT authentication",
      "Understanding of Docker and CI/CD pipelines",
      "Strong debugging and problem-solving skills",
    ],
    posted: "2026-03-14",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "PixelCraft Studios",
    location: "Mumbai",
    type: "Full-time",
    salary: "₹7 – 10 LPA",
    shortDescription:
      "Create stunning wireframes, prototypes, and final designs for mobile and web.",
    description:
      "PixelCraft Studios is looking for a creative UI/UX Designer who can transform ideas into exceptional user experiences. You will lead the design process from research and wireframing to high-fidelity prototypes and hand-off.",
    requirements: [
      "3+ years of UI/UX design experience",
      "Proficiency in Figma or Adobe XD",
      "Strong portfolio demonstrating design thinking",
      "Understanding of accessibility standards (WCAG)",
      "Ability to collaborate with cross-functional teams",
    ],
    posted: "2026-03-13",
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "Infinium Analytics",
    location: "Pune",
    type: "Full-time",
    salary: "₹12 – 18 LPA",
    shortDescription:
      "Leverage ML models and big data tools to drive business insights.",
    description:
      "Infinium Analytics is hiring a Data Scientist to analyze large datasets, build predictive models, and present insights to leadership. You will work with cutting-edge tools like Python, TensorFlow, and Spark.",
    requirements: [
      "3+ years in data science or ML engineering",
      "Proficiency in Python, Pandas, NumPy, Scikit-learn",
      "Experience with TensorFlow or PyTorch",
      "Knowledge of SQL and NoSQL databases",
      "Strong statistical and mathematical foundations",
    ],
    posted: "2026-03-12",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "SkyLink Systems",
    location: "Chennai",
    type: "Full-time",
    salary: "₹10 – 16 LPA",
    shortDescription:
      "Manage CI/CD pipelines, cloud infrastructure, and deployment automation.",
    description:
      "SkyLink Systems is looking for a skilled DevOps Engineer to manage and scale cloud infrastructure across AWS and GCP. You will be responsible for automating deployment pipelines, monitoring services, and ensuring high availability.",
    requirements: [
      "3+ years in DevOps or SRE roles",
      "Hands-on with AWS / GCP / Azure",
      "Experience with Docker, Kubernetes, and Terraform",
      "CI/CD pipelines with Jenkins or GitHub Actions",
      "Strong scripting skills (Bash, Python)",
    ],
    posted: "2026-03-11",
  },
  {
    id: 6,
    title: "Mobile App Developer (React Native)",
    company: "AppVerse Technologies",
    location: "Delhi",
    type: "Full-time",
    salary: "₹9 – 14 LPA",
    shortDescription:
      "Develop cross-platform mobile apps using React Native for iOS and Android.",
    description:
      "AppVerse Technologies is seeking a React Native Developer who can build and maintain cross-platform mobile applications. You will collaborate with the design and backend teams to deliver a seamless mobile experience to millions of users.",
    requirements: [
      "2+ years with React Native",
      "Strong JavaScript and TypeScript skills",
      "Experience with REST APIs and Redux",
      "Knowledge of iOS and Android deployment processes",
      "Familiarity with Expo and native modules",
    ],
    posted: "2026-03-10",
  },
  {
    id: 7,
    title: "Full Stack Developer",
    company: "NexGen Labs",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹11 – 17 LPA",
    shortDescription:
      "Own the full stack from React frontend to Node.js backend and PostgreSQL.",
    description:
      "NexGen Labs is looking for a Full Stack Developer comfortable working across the entire application stack. You will design APIs, build frontend UIs, and ensure code quality through reviews and testing.",
    requirements: [
      "4+ years of full stack development",
      "React.js / Next.js on the frontend",
      "Node.js / Express on the backend",
      "PostgreSQL or MySQL database experience",
      "Strong Git and code review skills",
    ],
    posted: "2026-03-09",
  },
  {
    id: 8,
    title: "Cybersecurity Analyst",
    company: "SecureNet Corp",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹10 – 15 LPA",
    shortDescription:
      "Protect company assets by identifying vulnerabilities and responding to incidents.",
    description:
      "SecureNet Corp is seeking a Cybersecurity Analyst to monitor, detect, and respond to security threats. You will perform vulnerability assessments, conduct penetration testing, and help shape security policies.",
    requirements: [
      "3+ years in cybersecurity",
      "Knowledge of SIEM tools (Splunk, ELK)",
      "Experience with penetration testing tools (Metasploit, Burp Suite)",
      "CEH or CISSP certification preferred",
      "Understanding of network security and firewalls",
    ],
    posted: "2026-03-08",
  },
  {
    id: 9,
    title: "Product Manager",
    company: "LaunchPad Inc",
    location: "Mumbai",
    type: "Full-time",
    salary: "₹14 – 20 LPA",
    shortDescription:
      "Define product strategy, manage roadmap, and lead cross-functional teams.",
    description:
      "LaunchPad Inc is hiring an experienced Product Manager to drive product vision and strategy. You will work closely with engineering, design, and business stakeholders to deliver exceptional products.",
    requirements: [
      "4+ years of product management experience",
      "Strong analytical and data-driven decision making",
      "Experience with Agile / Scrum methodologies",
      "Excellent communication and leadership skills",
      "Familiarity with tools like JIRA, Confluence, Figma",
    ],
    posted: "2026-03-07",
  },
  {
    id: 10,
    title: "QA Engineer",
    company: "TestRight Technologies",
    location: "Pune",
    type: "Full-time",
    salary: "₹6 – 10 LPA",
    shortDescription:
      "Ensure product quality through manual and automated testing frameworks.",
    description:
      "TestRight Technologies is looking for a detail-oriented QA Engineer to plan and execute testing strategies. You will automate test cases, identify bugs, and ensure software meets the highest quality standards.",
    requirements: [
      "2+ years in QA / SDET roles",
      "Experience with Selenium or Cypress",
      "Knowledge of API testing with Postman",
      "JIRA and test management tools experience",
      "Understanding of Agile development processes",
    ],
    posted: "2026-03-06",
  },
  {
    id: 11,
    title: "Cloud Architect",
    company: "AeroCloud Systems",
    location: "Delhi",
    type: "Full-time",
    salary: "₹20 – 30 LPA",
    shortDescription:
      "Design enterprise-grade cloud architectures on AWS and Azure.",
    description:
      "AeroCloud Systems is seeking a Cloud Architect to design, build, and scale enterprise cloud solutions. You will lead cloud strategy, establish best practices, and mentor the engineering team on cloud-native patterns.",
    requirements: [
      "7+ years in cloud infrastructure",
      "AWS Solutions Architect or Azure Expert certification",
      "Deep knowledge of networking, IAM, and security",
      "Experience with multi-cloud and hybrid cloud strategies",
      "Strong communication and stakeholder management",
    ],
    posted: "2026-03-05",
  },
  {
    id: 12,
    title: "AI/ML Engineer",
    company: "Brainwave AI",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹15 – 22 LPA",
    shortDescription:
      "Build and deploy production ML models using Python, TensorFlow, and MLOps.",
    description:
      "Brainwave AI is hiring a passionate AI/ML Engineer to develop and deploy machine learning models at scale. You will work closely with data scientists and product teams to bring AI features to life.",
    requirements: [
      "4+ years in ML engineering",
      "Strong Python and TensorFlow / PyTorch",
      "MLOps tools: MLflow, Kubeflow, or SageMaker",
      "Experience with model serving and monitoring",
      "Solid understanding of LLMs and NLP pipelines",
    ],
    posted: "2026-03-04",
  },
  {
    id: 13,
    title: "Database Administrator",
    company: "DataVault Corp",
    location: "Chennai",
    type: "Full-time",
    salary: "₹8 – 13 LPA",
    shortDescription:
      "Manage, optimize, and secure enterprise databases (MySQL, PostgreSQL, Oracle).",
    description:
      "DataVault Corp is looking for a Database Administrator to maintain, optimize, and secure our enterprise databases. You will handle backups, performance tuning, replication, and disaster recovery strategies.",
    requirements: [
      "4+ years as a DBA",
      "Expertise in MySQL, PostgreSQL, or Oracle",
      "Experience with replication, clustering, and backups",
      "Knowledge of query optimization and indexing",
      "Scripting skills in SQL and Bash",
    ],
    posted: "2026-03-03",
  },
  {
    id: 14,
    title: "Scrum Master",
    company: "AgileWorks India",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹9 – 14 LPA",
    shortDescription:
      "Facilitate Agile ceremonies, remove blockers, and coach teams on Scrum.",
    description:
      "AgileWorks India is hiring a certified Scrum Master to guide multiple engineering teams in Agile best practices. You will facilitate sprints, retrospectives, and planning sessions while working to continuously improve team performance.",
    requirements: [
      "3+ years as a Scrum Master",
      "CSM or PSM certification required",
      "Experience with JIRA and Confluence",
      "Strong facilitation and conflict resolution skills",
      "Understanding of Kanban and SAFe frameworks",
    ],
    posted: "2026-03-02",
  },
  {
    id: 15,
    title: "Technical Content Writer",
    company: "DevWrite Studio",
    location: "Remote",
    type: "Part-time",
    salary: "₹4 – 6 LPA",
    shortDescription:
      "Write developer-focused blogs, tutorials, and API documentation.",
    description:
      "DevWrite Studio is looking for a Technical Content Writer who can produce clear, accurate, and engaging technical documentation. You will create blogs, tutorials, API docs, and case studies targeted at software developers.",
    requirements: [
      "2+ years of technical writing experience",
      "Solid understanding of web development concepts",
      "Experience documenting APIs (OpenAPI / Swagger)",
      "Excellent English writing and editing skills",
      "Familiarity with Markdown and CMS platforms",
    ],
    posted: "2026-03-01",
  },
  {
    id: 16,
    title: "Embedded Systems Engineer",
    company: "KovaiTech Robotics",
    location: "Coimbatore",
    type: "Full-time",
    salary: "₹7 – 11 LPA",
    shortDescription:
      "Design and program embedded firmware for industrial automation and IoT devices.",
    description:
      "KovaiTech Robotics is a leading embedded systems company based in Coimbatore, building next-generation industrial automation products. We are looking for a skilled Embedded Systems Engineer to develop and test firmware for microcontrollers, PLCs, and IoT devices used across manufacturing units.",
    requirements: [
      "3+ years in embedded C/C++ programming",
      "Hands-on with STM32, Arduino, or Raspberry Pi",
      "Experience with RTOS (FreeRTOS or similar)",
      "Knowledge of communication protocols: I2C, SPI, UART, CAN",
      "Familiarity with PCB design is a plus",
    ],
    posted: "2026-03-20",
  },
  {
    id: 17,
    title: "Software Developer – ERP Systems",
    company: "Coimbatore Textile Mills",
    location: "Coimbatore",
    type: "Full-time",
    salary: "₹6 – 9 LPA",
    shortDescription:
      "Develop and maintain ERP modules for textile manufacturing and supply chain operations.",
    description:
      "Coimbatore Textile Mills is one of the largest textile manufacturers in Tamil Nadu. We are hiring a Software Developer to build and maintain our in-house ERP system covering production planning, inventory, and logistics. You will work closely with operations and finance teams to digitize workflows.",
    requirements: [
      "2+ years of ERP development experience (SAP, Odoo, or custom ERP)",
      "Strong Python or Java skills",
      "Experience with MySQL or PostgreSQL",
      "Understanding of manufacturing workflows and supply chain",
      "Good communication skills in Tamil and English",
    ],
    posted: "2026-03-19",
  },
  {
    id: 18,
    title: "React.js Developer",
    company: "PixelMinds Technologies",
    location: "Coimbatore",
    type: "Full-time",
    salary: "₹5 – 8 LPA",
    shortDescription:
      "Build modern web applications using React.js and REST APIs for mid-size clients.",
    description:
      "PixelMinds Technologies is a fast-growing digital agency in Coimbatore delivering web solutions for clients across e-commerce, healthcare, and education. We are looking for a React.js Developer who can build clean, performant UIs and integrate them with backend APIs.",
    requirements: [
      "1+ years of React.js development",
      "Good knowledge of JavaScript (ES6+), HTML, and CSS",
      "Experience with REST API integration using Axios or Fetch",
      "Familiarity with Git and version control workflows",
      "Ability to work independently and meet deadlines",
    ],
    posted: "2026-03-18",
  },
  {
    id: 19,
    title: "Manual & Automation QA Tester",
    company: "SoftSphere Solutions",
    location: "Coimbatore",
    type: "Full-time",
    salary: "₹4 – 7 LPA",
    shortDescription:
      "Test web and mobile applications using both manual and Selenium-based automation.",
    description:
      "SoftSphere Solutions provides software testing services to clients in the USA and Europe. We are looking for a QA Tester who is comfortable with both manual test case execution and writing automated test scripts using Selenium or Cypress. You will ensure product releases are bug-free and meet quality standards.",
    requirements: [
      "1+ years in manual or automation testing",
      "Experience with Selenium WebDriver or Cypress",
      "Familiarity with Postman for API testing",
      "Bug tracking using JIRA or Bugzilla",
      "ISTQB certification is a plus",
    ],
    posted: "2026-03-17",
  },
];

export default jobs;

// ---- BACKEND INTEGRATION HINT ----
// When you have a backend API ready, replace the above array with:
//
// import axios from 'axios';
//
// export const fetchJobs = async () => {
//   const response = await axios.get('https://your-api.com/api/jobs');
//   return response.data;
// };
//
// export const fetchJobById = async (id) => {
//   const response = await axios.get(`https://your-api.com/api/jobs/${id}`);
//   return response.data;
// };
