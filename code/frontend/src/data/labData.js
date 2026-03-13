export const RESEARCH_AREAS = [
  { icon: "👁️", title: "Computer Vision",      desc: "Object detection, segmentation, 3D reconstruction and scene understanding at scale." },
  { icon: "🧠", title: "Machine Learning",      desc: "Neural architectures, self-supervised learning and model optimisation research." },
  { icon: "🤖", title: "Robotics & Automation", desc: "Vision-guided robotics, manipulation, and human-robot interaction systems." },
  { icon: "🧬", title: "Medical Imaging",       desc: "AI-powered diagnostics, pathology analysis, and radiology assistance." },
  { icon: "🚁", title: "Autonomous Systems",    desc: "UAV navigation, SLAM, and real-time perception for drones and self-driving platforms." },
  { icon: "📹", title: "Video Analytics",       desc: "Action recognition, crowd analysis, anomaly detection, and intelligent surveillance." },
];

export const PROJECTS = [
  { id:1, status:"Active",    title:"DroneVision-X",  lead:"Dr. Anika Reyes", desc:"Real-time object tracking for autonomous UAV navigation in complex urban environments.", tags:["SLAM","UAV","PyTorch"],    year:"2024–25" },
  { id:2, status:"Active",    title:"MedScan AI",     lead:"Dr. Leon Falk",   desc:"Deep learning pipeline for early-stage tumour detection in CT and MRI imagery.",        tags:["Medical","CNN","DICOM"],   year:"2024–25" },
  { id:3, status:"Active",    title:"CrowdFlowNet",   lead:"Sarah Kim",       desc:"Real-time crowd density estimation and flow prediction via overhead camera feeds.",      tags:["Detection","CCTV","AI"],   year:"2024"    },
  { id:4, status:"Completed", title:"EdgeVision Kit",  lead:"Marcus Chen",    desc:"Lightweight CV models optimised for Raspberry Pi and Jetson Nano embedded platforms.",  tags:["Edge AI","TFLite","ONNX"], year:"2023"    },
  { id:5, status:"Completed", title:"HistoScan",       lead:"Dr. Leon Falk",  desc:"Automated histopathology slide analysis with explainable AI for clinical use.",         tags:["Pathology","XAI","WSI"],   year:"2023"    },
];

export const PUBLICATIONS = [
  { year:"2025", title:"Transformer-Based Real-Time Object Tracking for Aerial Platforms", venue:"CVPR 2025",      authors:"Reyes A., Kim S., Chen M.", award:"Best Paper" },
  { year:"2025", title:"Self-Supervised Pre-training for Medical Image Segmentation",       venue:"MICCAI 2025",    authors:"Falk L., Nair P." },
  { year:"2024", title:"Edge-Optimised YOLO Variants for Resource-Constrained Devices",    venue:"ICCV 2024",      authors:"Chen M., Reyes A." },
  { year:"2024", title:"Attention Mechanisms in Crowd Flow Prediction Networks",            venue:"IEEE TPAMI 2024", authors:"Kim S., Okafor J." },
  { year:"2023", title:"HistoScan: Weakly Supervised Whole Slide Image Analysis",          venue:"NeurIPS 2023",    authors:"Falk L., Nair P., Reyes A." },
];

export const PEOPLE = [
  { name:"Dr. Anika Reyes",  role:"Lab Director / Professor",        dept:"Computer Science",  research:"3D Vision & UAVs",     initials:"AR", type:"staff"   },
  { name:"Dr. Leon Falk",    role:"Senior Researcher / Sr. Lecturer", dept:"Biomedical Eng.",  research:"Medical Imaging",       initials:"LF", type:"staff"   },
  { name:"Priya Nair",       role:"Research Staff",                   dept:"Computer Science",  research:"Video Analytics",       initials:"PN", type:"staff"   },
  { name:"Sarah Kim",        role:"PhD Candidate",                    dept:"Computer Science",  research:"Autonomous Drones",     initials:"SK", type:"student" },
  { name:"Marcus Chen",      role:"PhD Candidate",                    dept:"Computer Science",  research:"Edge AI",               initials:"MC", type:"student" },
  { name:"James Okafor",     role:"Lab Engineer",                     dept:"IT Infrastructure", research:"GPU Infrastructure",    initials:"JO", type:"staff"   },
  { name:"Ravi Perera",      role:"MPhil Candidate",                  dept:"Electrical Eng.",   research:"Robotics Vision",       initials:"RP", type:"student" },
  { name:"Nadia Hassan",     role:"BSc Research Assistant",           dept:"Computer Science",  research:"Image Segmentation",    initials:"NH", type:"student" },
];

export const EQUIPMENT = [
  { name:"GPU Cluster (A100)",    spec:"8× NVIDIA A100 80GB",      icon:"⚡", cat:"Computing", avail:true,  fee:"LKR 500/hr"      },
  { name:"Drone Fleet",           spec:"DJI Matrice 300 RTK × 4",  icon:"🚁", cat:"Hardware",  avail:true,  fee:"LKR 800/session" },
  { name:"Camera Array",          spec:"4K Industrial × 12",        icon:"📷", cat:"Hardware",  avail:false, fee:"LKR 300/hr"      },
  { name:"Motion Capture Rig",    spec:"OptiTrack 16-camera",       icon:"🎯", cat:"Hardware",  avail:true,  fee:"LKR 600/hr"      },
  { name:"Depth Sensors",         spec:"Intel RealSense D455 × 6",  icon:"📡", cat:"Hardware",  avail:true,  fee:"LKR 200/hr"      },
  { name:"HPC Server",            spec:"256-core AMD EPYC",          icon:"🖥️", cat:"Computing", avail:false, fee:"LKR 400/hr"      },
];

export const NEWS_ITEMS = [
  { date:"Mar 10, 2025", type:"Achievement", title:"Lab Wins Best Paper Award at CVPR 2025",    desc:"DroneVision-X research recognised internationally at the premier CV conference."    },
  { date:"Feb 24, 2025", type:"Funding",     title:"NSF Grant Awarded for UAV Vision Research", desc:"$450,000 grant to fund a 3-year autonomous urban navigation study."                },
  { date:"Feb 15, 2025", type:"Event",       title:"AI & Vision Workshop — April 2025",          desc:"Open registration now available. Limited seats. Workshops by leading researchers." },
  { date:"Jan 20, 2025", type:"Media",       title:"DroneVision-X Featured in Tech Digest",     desc:"National media coverage of our live UAV tracking demonstration."                   },
];

export const SERVICES = [
  { icon:"⚡", title:"GPU Computing",      desc:"High-performance A100 GPU clusters for deep learning training and inference."  },
  { icon:"🔬", title:"Equipment Access",   desc:"Book cameras, drones, depth sensors, and motion capture rigs for research."    },
  { icon:"💬", title:"AI Consultation",    desc:"One-on-one sessions with researchers for CV methodology and implementation."    },
  { icon:"🗄️", title:"Dataset Processing", desc:"Assistance with data labelling, augmentation, preprocessing and storage."      },
];

export const ALL_RESERVATIONS = [
  { id:"R-001", user:"Sarah Kim",    role:"Student", resource:"GPU Cluster",   date:"2025-03-12", time:"10:00–12:00", status:"Approved", fee:"LKR 1,000" },
  { id:"R-002", user:"Marcus Chen",  role:"Student", resource:"Drone Fleet",   date:"2025-03-12", time:"14:00–16:00", status:"Pending",  fee:"LKR 800"   },
  { id:"R-003", user:"Priya Nair",   role:"Staff",   resource:"Camera Array",  date:"2025-03-13", time:"09:00–11:00", status:"Approved", fee:"LKR 600"   },
  { id:"R-004", user:"Ravi Perera",  role:"Student", resource:"HPC Server",    date:"2025-03-14", time:"13:00–15:00", status:"Rejected", fee:"LKR 800"   },
  { id:"R-005", user:"Nadia Hassan", role:"Student", resource:"Depth Sensors", date:"2025-03-15", time:"10:00–12:00", status:"Pending",  fee:"LKR 400"   },
];

export const HERO_SLIDES = [
  { bg:`linear-gradient(135deg,#1a2744 0%,#1e3a6e 60%,#264a8a 100%)`, tag:"Research Excellence",       title:"Advancing Visual Intelligence",               sub:"Cutting-edge research in Computer Vision, Deep Learning and Autonomous Systems."           },
  { bg:`linear-gradient(135deg,#163a16 0%,#1e5228 60%,#256b33 100%)`, tag:"World-Class Infrastructure", title:"GPU Clusters · Drone Fleets · Motion Capture", sub:"State-of-the-art hardware supporting medical imaging, robotics and autonomous navigation." },
  { bg:`linear-gradient(135deg,#3a1a1a 0%,#6b2222 60%,#8b2e2e 100%)`, tag:"Join Our Lab",               title:"Open to Students, Staff & Collaborators",      sub:"Apply for PhD positions, book equipment, request consultations and collaborate."           },
];

export const TICKER_ITEMS = [
  "🏆 Best Paper Award at CVPR 2025 — DroneVision-X",
  "💰 NSF Grant Awarded — $450,000 for UAV Vision Research",
  "📅 AI & Vision Workshop April 2025 — Registration Open",
  "🎓 PhD Applications Open for 2025/2026 Academic Year",
];

export const PORTAL_MENUS = {
  student: [
    { id:"dashboard",    icon:"📊", label:"Dashboard"              },
    { id:"reservation",  icon:"🏛️", label:"Lab Space Reservation"  },
    { id:"equipment",    icon:"📷", label:"Equipment Booking"       },
    { id:"gpu",          icon:"⚡", label:"GPU Processing Requests" },
    { id:"consultation", icon:"💬", label:"Consultation Requests"   },
    { id:"projects",     icon:"🔬", label:"Project Participation"   },
    { id:"history",      icon:"📋", label:"Usage History"           },
    { id:"profile",      icon:"👤", label:"Profile"                 },
  ],
  staff: [
    { id:"dashboard",    icon:"📊", label:"Dashboard"              },
    { id:"consults",     icon:"💬", label:"Consultation Requests"   },
    { id:"projects",     icon:"🔬", label:"Research Projects"       },
    { id:"gpu-monitor",  icon:"⚡", label:"GPU Usage Monitor"       },
    { id:"reservations", icon:"📅", label:"Equipment Reservations"  },
    { id:"profile",      icon:"👤", label:"Profile"                 },
  ],
  admin: [
    { id:"dashboard",    icon:"📊", label:"Dashboard"              },
    { id:"users",        icon:"👥", label:"User Management"         },
    { id:"equip-mgmt",   icon:"🛠️", label:"Equipment Management"   },
    { id:"reservations", icon:"📅", label:"Reservation Approval"    },
    { id:"gpu-mgmt",     icon:"⚡", label:"GPU Workload"            },
    { id:"usage",        icon:"📈", label:"Usage Tracking"          },
    { id:"fees",         icon:"💳", label:"Fee & Payments"          },
    { id:"proj-mgmt",    icon:"🔬", label:"Project Management"      },
    { id:"news-mgmt",    icon:"📰", label:"News & Events"           },
  ],
};
