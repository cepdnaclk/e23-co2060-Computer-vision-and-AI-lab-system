# Computer Vision & AI Lab Management System

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange?style=flat-square)
![Team](https://img.shields.io/badge/Team-Bug%20Slayer-red?style=flat-square)

> A unified web platform designed for the Computer Vision & AI Lab, integrating a public research portfolio with a robust internal management system for streamlining equipment bookings and GPU resource scheduling.

---

## 📖 About the Project

This project implements a comprehensive web platform for the **Computer Vision and AI Lab**, designed to streamline both public outreach and internal operations.

The system serves two distinct purposes:
1.  **External Visibility:** A dynamic public portfolio showcasing the lab's latest research, publications, and team achievements to the academic community and industry collaborators.
2.  **Internal Operations:** A secure management dashboard to digitize daily workflows, replacing manual logbooks with role-based automation for equipment tracking and resource allocation.

## ✨ Key Features

### 🌍 Public Portal (Informational)
* **Research Showcase:** Dynamic gallery of ongoing and completed projects.
* **Publications:** Auto-updated list of research papers and journals.
* **News & Events:** Announcements regarding workshops and lab activities.
* **Team Profiles:** Dedicated pages for staff and student researchers.

### 🔒 Internal System (Operational)
* **Resource Booking Engine:** Real-time availability checks and reservation system for high-value assets (Drones, Cameras, Sensors).
* **GPU Scheduling:** Job slot management system for shared computing resources (e.g., NVIDIA A100/H100 clusters).
* **User Management:** Role-based access control (RBAC) for Students, Staff, and Admins.
* **Consultation Requests:** Appointment scheduling system for students to meet supervisors.

---

## 🛠️ Tech Stack

This project utilizes a modern, decoupled architecture to ensure scalability and ease of integration with AI workflows.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) | Interactive UI for calendars and dashboards. |
| **Backend** | ![Django](https://img.shields.io/badge/Django-092E20?style=flat-square&logo=django&logoColor=white) | Robust API handling, Auth, and Admin interface. |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) | Relational database for complex booking logic. |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Rapid UI development. |
| **API** | REST / DRF | Django REST Framework for client-server communication. |

---

## 🏗️ Architecture

The system follows a modular design where the Backend (Django) serves as the API provider for the Frontend (React).



*(Placeholder: Architecture diagram will be added here)*

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js & npm
* PostgreSQL

### 1. Clone the Repository
```bash
git clone [https://github.com/abdul-rizvi/cv-lab-system.git](https://github.com/abdul-rizvi/cv-lab-system.git)
cd cv-lab-system
