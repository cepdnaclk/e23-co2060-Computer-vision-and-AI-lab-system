/**
 * seedEquipment.js
 * Seeds the inventory table with all 49 real items from the PEFAA equipment list.
 * Run once: node seedEquipment.js
 */

require('dotenv').config();
const pool = require('./config/db');

const ITEMS = [
  // Computing & Processing
  { name: "High Performance Server", category: "Computing", description: "Graphic and computationally efficient high-performance computing server for deep learning training and inference workloads.", status: "available" },
  { name: "NVIDIA Jetson Orin Nano Developer Kit", category: "Computing", description: "Edge computing applications for robotics and automation. Real-time application on low-power hardware for embedded AI research.", status: "available" },
  { name: "Apple iMac 24\" (M1 — 8-Core CPU / 8-Core GPU)", category: "Computing", description: "Apple workstation (already available). General-purpose design and development workstation.", status: "available" },
  { name: "Workstations", category: "Computing", description: "Common PCs for general use by research assistants and students.", status: "available" },

  // LiDAR & Depth Sensors
  { name: "LiDAR Mid 40", category: "Sensor", description: "Indoor/outdoor 3D mapping, obstacle detection for robotics and autonomous navigation, terrain and elevation surveying.", status: "available" },
  { name: "LiDAR Mid 70", category: "Sensor", description: "Medium-range LiDAR for 3D environment mapping and point-cloud capture.", status: "available" },
  { name: "LiDAR MID 360", category: "Sensor", description: "360° LiDAR for full surround mapping, robotics, and autonomous systems research.", status: "available" },
  { name: "Intel RealSense Depth Camera D435i", category: "Sensor", description: "Obstacle/object detection for robotics, human gait detection and pose estimation, 3D scene understanding.", status: "available" },
  { name: "PROPHESEE Evaluation Kit 3 — GenX320", category: "Sensor", description: "Event-based vision for compute-efficient applications. Neuromorphic hardware interfacing for real-time SNN processing.", status: "available" },
  { name: "Husky AI Camera", category: "Sensor", description: "Mountable AI cameras for robots. 7 preconfigured settings for object/edge/face detection. For multi-robot SLAM and collaborative tasks.", status: "available" },
  { name: "DIY Ultrasound / Acoustic Camera", category: "Sensor", description: "Works in different materials (concrete, metals, biological tissues). High/low frequency options for biomedical imaging and civil structure inspection.", status: "available" },

  // Cameras & Optics
  { name: "Thermal Imaging Camera", category: "Camera", description: "Healthcare applications (infectious screening, sports science, non-contact temperature), surveillance/search and rescue, wall insulation monitoring.", status: "available" },
  { name: "DJI RTK 300 Thermal (Aerial)", category: "Camera", description: "Aerial image capture for high-accuracy geospatial mapping, environment change detection, agriculture and water mapping.", status: "available" },
  { name: "Canon XA60b Professional Camcorder", category: "Camera", description: "High-speed motion analysis for sports biomechanics and precision image/data collection.", status: "available" },
  { name: "GoPro Hero 12 Black (All-in-One Pack)", category: "Camera", description: "High-speed motion capture. Multi-environment applications including underwater and outdoor recording.", status: "available" },
  { name: "CCTV System", category: "Camera", description: "Camera setup for general lab security with DVR recording.", status: "available" },

  // Robotics
  { name: "Turtlebot 3 Burger", category: "Robotics", description: "Multi-agent systems research (navigation, mapping, SLAM). Modular design allows sensors/actuators to be added or removed. HCI gesture and voice control research.", status: "available" },

  // VR / AR
  { name: "Meta Quest 3 128GB + Carrying Case", category: "VR/AR", description: "Training simulations for surgeries and industrial tasks. HCI for commanding through gestures and video grounding. Digital Twin and interactive virtual space applications.", status: "available" },

  // Calibration & Accessories
  { name: "Color Calibrator", category: "Accessory", description: "Calibrate monitors for precision color. Enables simultaneous calibration of multiple monitors.", status: "available" },
  { name: "Camera Calibration Chart", category: "Accessory", description: "Camera calibration for 3D vision accuracy, color correction for consistent image processing, and lens distortion measurement.", status: "available" },
  { name: "Lens Cleaning Kit", category: "Accessory", description: "Optical maintenance for clarity and accuracy. Prevents dust interference in image processing. Preserves lens coatings for long-term use.", status: "available" },
  { name: "Tripod Set", category: "Accessory", description: "Stable positioning of cameras and sensors. Consistent image capture for machine vision and long-exposure imaging.", status: "available" },
  { name: "Sealing Mounts for Sensors and Cameras", category: "Accessory", description: "Secure mounting solutions for sensors and cameras in lab and field environments.", status: "available" },

  // Displays
  { name: "GIGABYTE AORUS CO49DQ EK QD-OLED Curved Gaming Monitor", category: "Display", description: "High-resolution QD-OLED curved display for the server and VR headsets.", status: "available" },
  { name: "85-inch Smart Board", category: "Display", description: "Smart interactive screen for presentations and collaborative discussions.", status: "available" },
  { name: "White Board", category: "Display", description: "Standard whiteboard for brainstorming and teaching sessions.", status: "available" },

  // Lighting
  { name: "3-Side Chroma Keying Setup", category: "Lighting", description: "Green screen setup for background-removal and controlled recording environments.", status: "available" },
  { name: "Light Tent", category: "Lighting", description: "Portable light tent for controlled product and object photography.", status: "available" },
  { name: "Ring Light", category: "Lighting", description: "Portable ring lighting for recording and streaming setups.", status: "available" },
  { name: "Flash", category: "Lighting", description: "For lighting with different contrasts in photography and research recordings.", status: "available" },
  { name: "Lighting Kit", category: "Lighting", description: "Full lighting setup for special recordings and controlled vision experiments.", status: "available" },

  // Audio
  { name: "Microphone Set (Rode Wireless ×2 + Shotgun ×1)", category: "Audio", description: "Rode Wireless (×2) and Mount Shotgun Microphone (×1) for high-quality audio capture.", status: "available" },

  // Infrastructure & Power
  { name: "Humidity Control Cabinet", category: "Infrastructure", description: "Protect items from dust, dirt, and humidity to preserve sensitive equipment.", status: "available" },
  { name: "UPS (Uninterruptible Power Supply)", category: "Infrastructure", description: "Can support the server and workstations in case of power outage.", status: "available" },
  { name: "AC Units (VRF) — Semi-Centralized", category: "Infrastructure", description: "Centralized cassette-type AC system for full lab climate control.", status: "available" },
  { name: "Network Accessories + Access Point", category: "Infrastructure", description: "Full network configuration including Wi-Fi access points and cabling accessories.", status: "available" },
  { name: "Electrical Work", category: "Infrastructure", description: "General electrical work and special ceiling-mounted camera electrical installations.", status: "available" },

  // Furniture & Fixtures
  { name: "Flooring Carpet", category: "Furniture", description: "Fire-resistant carpet suitable for heavy circuitry work. 495/sqft × 860 sqft.", status: "available" },
  { name: "Fire Extinguishers", category: "Furniture", description: "Mandatory fire extinguishers for lab safety compliance.", status: "available" },
  { name: "RA Desk (Research Assistant Workstation)", category: "Furniture", description: "Research assistant workstation to accommodate 8 researchers.", status: "available" },
  { name: "Testing Station", category: "Furniture", description: "Two testing stations to support circuitry work and equipment storage.", status: "available" },
  { name: "Equipment Cabinet", category: "Furniture", description: "Cabinets to store and organise all types of lab equipment.", status: "available" },
  { name: "Bean Bags", category: "Furniture", description: "Bean bags to accommodate casual discussions and informal collaboration sessions.", status: "available" },
  { name: "Office Chairs", category: "Furniture", description: "Ergonomic chairs to support research assistant desks.", status: "available" },
  { name: "Curtains / Office Blinds", category: "Furniture", description: "Office blinds to obstruct lighting for controlled vision capture experiments.", status: "available" },
  { name: "Smart Lock", category: "Furniture", description: "Smart lock with fingerprint and combination access for lab security.", status: "available" },
  { name: "Entrance Name Board", category: "Furniture", description: '"Computer Vision and Artificial Intelligence Lab, Sponsored by PEFAA" — 5×2 sq ft nameplate.', status: "available" },
  { name: "Glass Sandblasting", category: "Furniture", description: "Decorative and privacy glass sandblasting for lab partitions.", status: "available" },
  { name: "Sliding Door", category: "Furniture", description: "Space-saving sliding door for lab entry.", status: "available" },
];

const seed = async () => {
  console.log(`\n🌱  Seeding ${ITEMS.length} equipment items into the inventory table...\n`);
  let inserted = 0;
  let skipped  = 0;

  for (const item of ITEMS) {
    try {
      // Use ON CONFLICT DO NOTHING so re-running is safe
      await pool.query(
        `INSERT INTO inventory (name, category, description, status)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [item.name, item.category, item.description, item.status]
      );
      console.log(`  ✅  ${item.name}  [${item.category}]`);
      inserted++;
    } catch (err) {
      console.warn(`  ⚠️  Skipped "${item.name}": ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n✅  Done — ${inserted} inserted, ${skipped} skipped.\n`);
  await pool.end();
};

seed().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
