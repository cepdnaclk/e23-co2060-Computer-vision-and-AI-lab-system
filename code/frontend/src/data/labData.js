import {
  LuEye,
  LuBrain,
  LuBot,
  LuDna,
  LuPlaneTakeoff,
  LuVideo,
  LuCpu,
  LuWrench,
  LuMessageSquareMore,
  LuDatabase,
  LuBookOpen,
  LuGraduationCap,
  LuUsers,
  LuShieldCheck,
  LuCalendarClock,
  LuFlaskConical,
  LuAward,
  LuMapPin,
  LuMail,
  LuPhone,
  LuClock3,
  LuHouse,
  LuInfo,
  LuLayoutDashboard,
  LuLayers3,
  LuFileText,
  LuBadgeInfo,
  LuCalendarDays,
  LuBookMarked,
} from "react-icons/lu";

export const ICONS = {
  computerVision: LuEye,
  machineLearning: LuBrain,
  roboticsAutomation: LuBot,
  medicalImaging: LuDna,
  autonomousSystems: LuPlaneTakeoff,
  videoAnalytics: LuVideo,
  gpuComputing: LuCpu,
  equipmentAccess: LuWrench,
  aiConsultation: LuMessageSquareMore,
  datasetProcessing: LuDatabase,
  studentPortal: LuGraduationCap,
  staffPortal: LuUsers,
  adminPortal: LuShieldCheck,
  overview: LuLayoutDashboard,
  analytics: LuLayoutDashboard,
  reservations: LuCalendarClock,
  equipment: LuWrench,
  usersMgmt: LuUsers,
  peopleMgmt: LuUsers,
  newsMgmt: LuFileText,
  booking: LuCalendarClock,
  "booking-requests": LuCalendarClock,
  research: LuFlaskConical,
  achievement: LuAward,
  location: LuMapPin,
  email: LuMail,
  phone: LuPhone,
  hours: LuClock3,
  home: LuHouse,
  about: LuInfo,
  projects: LuLayers3,
  publications: LuBookOpen,
  people: LuUsers,
  facilities: LuWrench,
  news: LuFileText,
  services: LuBadgeInfo,
  contact: LuMail,
  consultation: LuMessageSquareMore,
  calendar: LuCalendarDays,
  labAccess: LuBookMarked,
  bookings: LuBookMarked,
};

export const RESEARCH_AREAS = [
  { iconKey: "computerVision", title: "Computer Vision", desc: "Object detection, segmentation, 3D reconstruction and scene understanding at scale." },
  { iconKey: "machineLearning", title: "Machine Learning", desc: "Neural architectures, self-supervised learning and model optimisation research." },
  { iconKey: "roboticsAutomation", title: "Robotics & Automation", desc: "Vision-guided robotics, manipulation, and human-robot interaction systems." },
  { iconKey: "medicalImaging", title: "Medical Imaging", desc: "AI-powered diagnostics, pathology analysis, and radiology assistance." },
  { iconKey: "autonomousSystems", title: "Autonomous Systems", desc: "UAV navigation, SLAM, and real-time perception for drones and self-driving platforms." },
  { iconKey: "videoAnalytics", title: "Video Analytics", desc: "Action recognition, crowd analysis, anomaly detection, and intelligent surveillance." },
];

export const PROJECTS = [
  { id: 1, status: "Active", title: "DroneVision-X", lead: "Dr. Anika Reyes", desc: "Real-time object tracking for autonomous UAV navigation in complex urban environments.", tags: ["SLAM", "UAV", "PyTorch"], year: "2024–25" },
  { id: 2, status: "Active", title: "MedScan AI", lead: "Dr. Leon Falk", desc: "Deep learning pipeline for early-stage tumour detection in CT and MRI imagery.", tags: ["Medical", "CNN", "DICOM"], year: "2024–25" },
  { id: 3, status: "Active", title: "CrowdFlowNet", lead: "Sarah Kim", desc: "Real-time crowd density estimation and flow prediction via overhead camera feeds.", tags: ["Detection", "CCTV", "AI"], year: "2024" },
  { id: 4, status: "Completed", title: "EdgeVision Kit", lead: "Marcus Chen", desc: "Lightweight CV models optimised for Raspberry Pi and Jetson Nano embedded platforms.", tags: ["Edge AI", "TFLite", "ONNX"], year: "2023" },
  { id: 5, status: "Completed", title: "HistoScan", lead: "Dr. Leon Falk", desc: "Automated histopathology slide analysis with explainable AI for clinical use.", tags: ["Pathology", "XAI", "WSI"], year: "2023" },
];

export const PUBLICATIONS = [
  { year: "2025", title: "Transformer-Based Real-Time Object Tracking for Aerial Platforms", venue: "CVPR 2025", authors: "Reyes A., Kim S., Chen M.", award: "Best Paper" },
  { year: "2025", title: "Self-Supervised Pre-training for Medical Image Segmentation", venue: "MICCAI 2025", authors: "Falk L., Nair P." },
  { year: "2024", title: "Edge-Optimised YOLO Variants for Resource-Constrained Devices", venue: "ICCV 2024", authors: "Chen M., Reyes A." },
  { year: "2024", title: "Attention Mechanisms in Crowd Flow Prediction Networks", venue: "IEEE TPAMI 2024", authors: "Kim S., Okafor J." },
  { year: "2023", title: "HistoScan: Weakly Supervised Whole Slide Image Analysis", venue: "NeurIPS 2023", authors: "Falk L., Nair P., Reyes A." },
];

export const PEOPLE = [
  { name: "Dr. Anika Reyes", role: "Lab Director / Professor", dept: "Computer Science", research: "3D Vision & UAVs", initials: "AR", type: "staff" },
  { name: "Dr. Leon Falk", role: "Senior Researcher / Sr. Lecturer", dept: "Biomedical Eng.", research: "Medical Imaging", initials: "LF", type: "staff" },
  { name: "Priya Nair", role: "Research Staff", dept: "Computer Science", research: "Video Analytics", initials: "PN", type: "staff" },
  { name: "Sarah Kim", role: "PhD Candidate", dept: "Computer Science", research: "Autonomous Drones", initials: "SK", type: "student" },
  { name: "Marcus Chen", role: "PhD Candidate", dept: "Computer Science", research: "Edge AI", initials: "MC", type: "student" },
  { name: "James Okafor", role: "Lab Engineer", dept: "IT Infrastructure", research: "GPU Infrastructure", initials: "JO", type: "staff" },
  { name: "Ravi Perera", role: "MPhil Candidate", dept: "Electrical Eng.", research: "Robotics Vision", initials: "RP", type: "student" },
  { name: "Nadia Hassan", role: "BSc Research Assistant", dept: "Computer Science", research: "Image Segmentation", initials: "NH", type: "student" },
];

export const EQUIPMENT = [
  // ── Computing & Processing ────────────────────────────
  {
    ref: "01", name: "High Performance Server", cat: "Computing", iconKey: "gpuComputing", avail: true,
    desc: "Graphic and computationally efficient high-performance computing server for deep learning training and inference workloads.",
  },
  {
    ref: "14", name: "NVIDIA Jetson Orin Nano Developer Kit", cat: "Computing", iconKey: "gpuComputing", avail: true,
    desc: "Edge computing applications for robotics and automation. Real-time application on low-power hardware for embedded AI research.",
  },
  {
    ref: "43", name: "Apple iMac 24\" (M1 — 8-Core CPU / 8-Core GPU)", cat: "Computing", iconKey: "gpuComputing", avail: true,
    desc: "Apple workstation (already available). General-purpose design and development workstation.",
  },
  {
    ref: "44", name: "Workstations", cat: "Computing", iconKey: "gpuComputing", avail: true,
    desc: "Common PCs for general use by research assistants and students.",
  },

  // ── LiDAR & Depth Sensors ─────────────────────────────
  {
    ref: "02", name: "LiDAR Mid 40", cat: "Sensor", iconKey: "computerVision", avail: true,
    desc: "Indoor/outdoor 3D mapping, obstacle detection for robotics and autonomous navigation, terrain and elevation surveying.",
  },
  {
    ref: "03", name: "LiDAR Mid 70", cat: "Sensor", iconKey: "computerVision", avail: true,
    desc: "Medium-range LiDAR for 3D environment mapping and point-cloud capture.",
  },
  {
    ref: "04", name: "LiDAR MID 360", cat: "Sensor", iconKey: "computerVision", avail: true,
    desc: "360° LiDAR for full surround mapping, robotics, and autonomous systems research.",
  },
  {
    ref: "06", name: "Intel RealSense Depth Camera D435i", cat: "Sensor", iconKey: "computerVision", avail: true,
    desc: "Obstacle/object detection for robotics, human gait detection and pose estimation, 3D scene understanding.",
  },
  {
    ref: "21", name: "PROPHESEE Evaluation Kit 3 — GenX320", cat: "Sensor", iconKey: "computerVision", avail: true,
    desc: "Event-based vision for compute-efficient applications. Neuromorphic hardware interfacing for real-time SNN processing.",
  },
  {
    ref: "24", name: "Husky AI Camera", cat: "Sensor", iconKey: "computerVision", avail: true,
    desc: "Mountable AI cameras for robots. 7 preconfigured settings for object/edge/face detection. For multi-robot SLAM and collaborative tasks.",
  },
  {
    ref: "08", name: "DIY Ultrasound / Acoustic Camera", cat: "Sensor", iconKey: "computerVision", avail: true,
    desc: "Works in different materials (concrete, metals, biological tissues). High/low frequency options for biomedical imaging and civil structure inspection.",
  },

  // ── Cameras & Optics ──────────────────────────────────
  {
    ref: "07", name: "Thermal Imaging Camera", cat: "Camera", iconKey: "videoAnalytics", avail: true,
    desc: "Healthcare applications (infectious screening, sports science, non-contact temperature), surveillance/search and rescue, wall insulation monitoring.",
  },
  {
    ref: "12", name: "DJI RTK 300 Thermal (Aerial)", cat: "Camera", iconKey: "autonomousSystems", avail: true,
    desc: "Aerial image capture for high-accuracy geospatial mapping, environment change detection, agriculture and water mapping.",
  },
  {
    ref: "15", name: "Canon XA60b Professional Camcorder", cat: "Camera", iconKey: "videoAnalytics", avail: true,
    desc: "High-speed motion analysis for sports biomechanics and precision image/data collection.",
  },
  {
    ref: "16", name: "GoPro Hero 12 Black (All-in-One Pack)", cat: "Camera", iconKey: "videoAnalytics", avail: true,
    desc: "High-speed motion capture. Multi-environment applications including underwater and outdoor recording.",
  },
  {
    ref: "19", name: "CCTV System", cat: "Camera", iconKey: "videoAnalytics", avail: true,
    desc: "Camera setup for general lab security with DVR recording.",
  },

  // ── Drones & Robotics ─────────────────────────────────
  {
    ref: "05", name: "Turtlebot 3 Burger", cat: "Robotics", iconKey: "roboticsAutomation", avail: true,
    desc: "Multi-agent systems research (navigation, mapping, SLAM). Modular design allows sensors/actuators to be added or removed. HCI gesture and voice control research.",
  },

  // ── VR / AR ───────────────────────────────────────────
  {
    ref: "13", name: "Meta Quest 3 128GB + Carrying Case", cat: "VR/AR", iconKey: "research", avail: true,
    desc: "Training simulations for surgeries and industrial tasks. HCI for commanding through gestures and video grounding. Digital Twin and interactive virtual space applications.",
  },

  // ── Calibration & Accessories ─────────────────────────
  {
    ref: "17", name: "Color Calibrator", cat: "Accessory", iconKey: "equipmentAccess", avail: true,
    desc: "Calibrate monitors for precision color. Enables simultaneous calibration of multiple monitors.",
  },
  {
    ref: "18", name: "Camera Calibration Chart", cat: "Accessory", iconKey: "equipmentAccess", avail: true,
    desc: "Camera calibration for 3D vision accuracy, color correction for consistent image processing, and lens distortion measurement.",
  },
  {
    ref: "19b", name: "Lens Cleaning Kit", cat: "Accessory", iconKey: "equipmentAccess", avail: true,
    desc: "Optical maintenance for clarity and accuracy. Prevents dust interference in image processing. Preserves lens coatings for long-term use.",
  },
  {
    ref: "20", name: "Tripod Set", cat: "Accessory", iconKey: "equipmentAccess", avail: true,
    desc: "Stable positioning of cameras and sensors. Consistent image capture for machine vision and long-exposure imaging.",
  },
  {
    ref: "46", name: "Sealing Mounts for Sensors and Cameras", cat: "Accessory", iconKey: "equipmentAccess", avail: true,
    desc: "Secure mounting solutions for sensors and cameras in lab and field environments.",
  },

  // ── Displays ─────────────────────────────────────────
  {
    ref: "23", name: "GIGABYTE AORUS CO49DQ EK QD-OLED Curved Gaming Monitor", cat: "Display", iconKey: "gpuComputing", avail: true,
    desc: "High-resolution curved display for the server and VR headsets.",
  },
  {
    ref: "27", name: "85-inch Smart Board", cat: "Display", iconKey: "gpuComputing", avail: true,
    desc: "Smart interactive screen for presentations and collaborative discussions.",
  },
  {
    ref: "47", name: "White Board", cat: "Display", iconKey: "equipmentAccess", avail: true,
    desc: "Standard whiteboard for brainstorming and teaching sessions.",
  },

  // ── Lighting ──────────────────────────────────────────
  {
    ref: "25", name: "3-Side Chroma Keying Setup", cat: "Lighting", iconKey: "videoAnalytics", avail: true,
    desc: "Green screen setup for background-removal and controlled recording environments.",
  },
  {
    ref: "39", name: "Light Tent", cat: "Lighting", iconKey: "videoAnalytics", avail: true,
    desc: "Portable light tent for controlled product and object photography.",
  },
  {
    ref: "40", name: "Ring Light", cat: "Lighting", iconKey: "videoAnalytics", avail: true,
    desc: "Portable ring lighting for recording and streaming setups.",
  },
  {
    ref: "41", name: "Flash", cat: "Lighting", iconKey: "videoAnalytics", avail: true,
    desc: "For lighting with different contrasts in photography and research recordings.",
  },
  {
    ref: "42", name: "Lighting Kit", cat: "Lighting", iconKey: "videoAnalytics", avail: true,
    desc: "Full lighting setup for special recordings and controlled vision experiments.",
  },

  // ── Audio ─────────────────────────────────────────────
  {
    ref: "46b", name: "Microphone Set", cat: "Audio", iconKey: "aiConsultation", avail: true,
    desc: "Rode Wireless (×2) and Mount Shotgun Microphone (×1) for high-quality audio capture.",
  },

  // ── Infrastructure & Power ────────────────────────────
  {
    ref: "22", name: "Humidity Control Cabinet", cat: "Infrastructure", iconKey: "equipmentAccess", avail: true,
    desc: "Protect items from dust, dirt, and humidity to preserve sensitive equipment.",
  },
  {
    ref: "28", name: "UPS (Uninterruptible Power Supply)", cat: "Infrastructure", iconKey: "gpuComputing", avail: true,
    desc: "Can support the server and workstations in case of power outage.",
  },
  {
    ref: "45", name: "AC Units (VRF) — Semi-Centralized", cat: "Infrastructure", iconKey: "equipmentAccess", avail: true,
    desc: "Centralized cassette-type AC system for full lab climate control.",
  },
  {
    ref: "48", name: "Network Accessories + Access Point", cat: "Infrastructure", iconKey: "gpuComputing", avail: true,
    desc: "Full network configuration including Wi-Fi access points and cabling accessories.",
  },
  {
    ref: "49", name: "Electrical Work", cat: "Infrastructure", iconKey: "gpuComputing", avail: true,
    desc: "General electrical work and special ceiling-mounted camera electrical installations.",
  },

  // ── Furniture & Fixtures ──────────────────────────────
  {
    ref: "29", name: "Flooring Carpet", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "Fire-resistant carpet suitable for heavy circuitry work. 495/sqft × 860 sqft.",
  },
  {
    ref: "30", name: "Fire Extinguishers", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "Mandatory fire extinguishers for lab safety compliance.",
  },
  {
    ref: "31", name: "RA Desk (Research Assistant Workstation)", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "Research assistant workstation to accommodate 8 researchers.",
  },
  {
    ref: "32", name: "Testing Station", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "Two testing stations to support circuitry work and equipment storage.",
  },
  {
    ref: "33", name: "Equipment Cabinet", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "Cabinets to store and organise all types of lab equipment.",
  },
  {
    ref: "34", name: "Bean Bags", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "Bean bags to accommodate casual discussions and informal collaboration sessions.",
  },
  {
    ref: "35", name: "Office Chairs", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "Ergonomic chairs to support research assistant desks.",
  },
  {
    ref: "36", name: "Curtains / Office Blinds", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "Office blinds to obstruct lighting for controlled vision capture experiments.",
  },
  {
    ref: "37", name: "Smart Lock", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "Smart lock with fingerprint and combination access for lab security.",
  },
  {
    ref: "38", name: "Entrance Name Board", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "\"Computer Vision and Artificial Intelligence Lab, Sponsored by PEFAA\" — 5×2 sq ft nameplate.",
  },
  {
    ref: "48b", name: "Glass Sandblasting", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "Decorative and privacy glass sandblasting for lab partitions.",
  },
  {
    ref: "50", name: "Sliding Door", cat: "Furniture", iconKey: "equipmentAccess", avail: true,
    desc: "Space-saving sliding door for lab entry.",
  },
];

export const NEWS_ITEMS = [
  { date: "Mar 10, 2025", type: "Achievement", title: "Lab Wins Best Paper Award at CVPR 2025", desc: "DroneVision-X research recognised internationally at the premier CV conference." },
  { date: "Feb 24, 2025", type: "Funding", title: "NSF Grant Awarded for UAV Vision Research", desc: "$450,000 grant to fund a 3-year autonomous urban navigation study." },
  { date: "Feb 15, 2025", type: "Event", title: "AI & Vision Workshop — April 2025", desc: "Open registration now available. Limited seats. Workshops by leading researchers." },
  { date: "Jan 20, 2025", type: "Media", title: "DroneVision-X Featured in Tech Digest", desc: "National media coverage of our live UAV tracking demonstration." },
];

export const SERVICES = [
  { iconKey: "gpuComputing", title: "GPU Computing", desc: "High-performance A100 GPU clusters for deep learning training and inference." },
  { iconKey: "equipmentAccess", title: "Equipment Access", desc: "Book cameras, drones, depth sensors, and motion capture rigs for research." },
  { iconKey: "aiConsultation", title: "AI Consultation", desc: "One-on-one sessions with researchers for CV methodology and implementation." },
  { iconKey: "datasetProcessing", title: "Dataset Processing", desc: "Assistance with data labelling, augmentation, preprocessing and storage." },
];

export const ALL_RESERVATIONS = [
  { id: "R-001", user: "Sarah Kim", role: "Student", resource: "GPU Cluster", date: "2025-03-12", time: "10:00–12:00", status: "Approved", fee: "LKR 1,000" },
  { id: "R-002", user: "Marcus Chen", role: "Student", resource: "Drone Fleet", date: "2025-03-12", time: "14:00–16:00", status: "Pending", fee: "LKR 800" },
  { id: "R-003", user: "Priya Nair", role: "Staff", resource: "Camera Array", date: "2025-03-13", time: "09:00–11:00", status: "Approved", fee: "LKR 600" },
  { id: "R-004", user: "Ravi Perera", role: "Student", resource: "HPC Server", date: "2025-03-14", time: "13:00–15:00", status: "Rejected", fee: "LKR 800" },
  { id: "R-005", user: "Nadia Hassan", role: "Student", resource: "Depth Sensors", date: "2025-03-15", time: "10:00–12:00", status: "Pending", fee: "LKR 400" },
];

export const HERO_SLIDES = [
  { bg: `linear-gradient(135deg,#1a2744 0%,#1e3a6e 55%,#2f4f8e 100%)`, tag: "Research Excellence", title: "Advancing Visual Intelligence", sub: "Cutting-edge research in Computer Vision, Deep Learning and Autonomous Systems." },
  { bg: `linear-gradient(135deg,#14203a 0%,#1e3a6e 58%,#28467f 100%)`, tag: "World-Class Infrastructure", title: "GPU Clusters · Drone Fleets · Motion Capture", sub: "State-of-the-art hardware supporting medical imaging, robotics and autonomous navigation." },
  { bg: `linear-gradient(135deg,#2d2344 0%,#1e3a6e 58%,#19445d 100%)`, tag: "Join Our Lab", title: "Open to Students, Staff & Collaborators", sub: "Apply for PhD positions, book equipment, request consultations and collaborate." },
];

export const TICKER_ITEMS = [
  "Best Paper Award at CVPR 2025 — DroneVision-X",
  "NSF Grant Awarded — $450,000 for UAV Vision Research",
  "AI & Vision Workshop April 2025 — Registration Open",
  "PhD Applications Open for 2025/2026 Academic Year",
];

export const PORTAL_MENUS = {
  student: [
    { id: "history", iconKey: "bookings", label: "My Bookings" },
    { id: "booking", iconKey: "booking", label: "Book Resource" },
  ],
  officer: [
    { id: "booking-requests", iconKey: "booking-requests", label: "Booking Requests" },
    { id: "equipment", iconKey: "equipment", label: "Equipment" },
  ],
  staff: [
    { id: "dashboard", iconKey: "about", label: "Dashboard" },
    { id: "consults", iconKey: "consultation", label: "Consultations" },
    { id: "reservations", iconKey: "calendar", label: "Reservations" },
  ],
  admin: [
    { id: "overview", iconKey: "overview", label: "Overview" },
    { id: "reservations", iconKey: "reservations", label: "Reservations" },
    { id: "equipment", iconKey: "equipment", label: "Equipment" },
    { id: "users", iconKey: "usersMgmt", label: "Users" },
    { id: "people", iconKey: "peopleMgmt", label: "Staff & People" },
    { id: "news", iconKey: "newsMgmt", label: "News" },
  ],
};
