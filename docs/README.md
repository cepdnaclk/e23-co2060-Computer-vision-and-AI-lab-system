---
layout: home
permalink: index.html

repository-name: e23-co2060-Computer-vision-and-AI-lab-system
title: Computer Vision & AI Lab System
---

# Computer Vision & AI Lab System

---

## Team

- E/23/282, M.R.A Rahman, [e23282@eng.pdn.ac.lk](mailto:e23282@eng.pdn.ac.lk)
- E/23/273, A Piraveen, [e23273@eng.pdn.ac.lk](mailto:e23273@eng.pdn.ac.lk)
- E/23/289, A Rajeeth, [e23289@eng.pdn.ac.lk](mailto:e23289@eng.pdn.ac.lk)
- E/23/396, M Tharsika, [e23396@eng.pdn.ac.lk](mailto:e23396@eng.pdn.ac.lk)

---

#### Table of Contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture)
3. [Software Designs](#software-designs)
4. [Testing](#testing)
5. [Conclusion](#conclusion)
6. [Links](#links)

---

## Introduction

This project implements a comprehensive web platform for the **Computer Vision and AI Lab** at the University of Peradeniya, designed to streamline both public outreach and internal operations.

The system serves two distinct purposes:

1. **External Visibility:** A dynamic public portal showcasing the lab's latest research, publications, and team achievements to the academic community and industry collaborators.
2. **Internal Operations:** A secure, role-based management dashboard that digitizes daily workflows — replacing manual logbooks with automated systems for equipment tracking and GPU resource allocation.

### Key Features

**Public Portal**
- Home page with lab highlights and announcements
- Research showcase of ongoing and completed projects
- Publications listing of research papers and journals
- People profiles of staff, researchers, and student members
- Facilities overview with equipment booking access
- News & Events for workshop announcements and lab updates
- Services page for consultation and collaborative offerings
- Contact form and lab location information

**Internal Management Portal**
- **Student Portal** — View booking history, request equipment, book consultations
- **Officer Portal** — Review and approve/reject student booking requests
- **Staff Portal** — Manage personal profile and lab-related resources
- **Admin Portal** — Full system control: users, inventory, analytics, news

**Core System Capabilities**
- Resource Booking Engine for high-value assets (Drones, Cameras, Sensors)
- GPU Scheduling for shared computing resources (e.g., NVIDIA A100/H100 clusters)
- Role-Based Access Control (RBAC) with four roles: `student`, `officer`, `staff`, `admin`
- JWT-based authentication with Google OAuth integration
- Email OTP verification for secure account creation via Nodemailer
- Analytics Dashboard for usage and booking metrics

---

## Solution Architecture

The system follows a decoupled **three-tier client-server architecture**:

```
┌────────────────────────────────────────────────────────────┐
│                    FRONTEND  (React + Vite)                │
│                                                            │
│  ┌──────────────────┐        ┌──────────────────────────┐  │
│  │   Public Portal  │        │    Internal Portals      │  │
│  │ Home / Research  │        │  Student / Officer /     │  │
│  │ People / News …  │        │  Staff / Admin           │  │
│  └────────┬─────────┘        └───────────┬──────────────┘  │
└───────────┼──────────────────────────────┼─────────────────┘
            │         REST API (Axios)      │
            ▼                              ▼
┌──────────────────────────────────────────────────────────┐
│                BACKEND  (Node.js + Express)              │
│                                                          │
│  /api/auth    /api/items    /api/bookings                │
│  /api/users   /api/people   /api/news    /api/analytics  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  JWT + OAuth │  │  Nodemailer  │  │  File Uploads  │  │
│  └──────────────┘  └──────────────┘  └────────────────┘  │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│              DATABASE  (PostgreSQL via Neon)              │
│     Users · Inventory · Bookings · News · People         │
└──────────────────────────────────────────────────────────┘
```

**Deployment Architecture**

| Layer | Platform | Purpose |
|:---|:---|:---|
| Database | Neon | Serverless PostgreSQL — always-on, auto-scaling |
| Backend | Northflank | Node.js API server containerized deployment |
| Frontend | Vercel | React + Vite static site with global CDN |

---

## Software Designs

### Technology Stack

| Component | Technology | Purpose |
|:---|:---|:---|
| Frontend | React 19 + Vite | Interactive SPA for all portals and public pages |
| Routing | React Router DOM v7 | Client-side navigation between sections |
| Backend | Node.js + Express v5 | REST API server, authentication, business logic |
| Database | PostgreSQL (via `pg`) | Relational storage for users, bookings, inventory |
| Auth | JWT + Google OAuth | Secure session management and single sign-on |
| Email | Nodemailer | OTP delivery and notification emails |
| Styling | Vanilla CSS + CSS Variables | Theming and component-level styles |
| HTTP Client | Axios | Frontend-to-backend API communication |
| File Handling | XLSX | Spreadsheet export for data and reports |

### Project Structure

```
e23-co2060-Computer-vision-and-AI-lab-system/
├── code/
│   ├── backend/
│   │   ├── config/           # Database connection (pg pool)
│   │   ├── controllers/      # Route handler logic
│   │   ├── middleware/       # JWT authentication middleware
│   │   ├── routes/           # Express route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── inventoryRoutes.js
│   │   │   ├── usersRoutes.js
│   │   │   ├── peopleRoutes.js
│   │   │   ├── newsRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   ├── services/         # Business logic & email service
│   │   ├── sql/              # SQL schema files
│   │   └── index.js          # Express app entry point (port 5000)
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/   # Shared UI components (Layout, Modals)
│       │   ├── pages/        # Public portal pages
│       │   ├── portal/       # Role-based internal portal views
│       │   │   ├── AdminPortal.jsx
│       │   │   ├── OfficerPortal.jsx
│       │   │   ├── StaffPortal.jsx
│       │   │   └── StudentPortal.jsx
│       │   ├── services/     # Axios API service wrappers
│       │   ├── styles/       # CSS theme & global styles
│       │   └── App.jsx       # Root component & router
│       └── index.html
│
└── docs/                     # Department project documentation site
```

### API Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/auth/login` | User login — returns JWT token |
| `POST` | `/api/auth/register` | New user registration with OTP |
| `GET` | `/api/items` | List all inventory/equipment items |
| `POST` | `/api/items` | Add new inventory item (admin only) |
| `GET` | `/api/bookings` | View bookings (filtered by role) |
| `POST` | `/api/bookings` | Create a new booking request |
| `GET` | `/api/users` | User management (admin only) |
| `GET` | `/api/people` | Retrieve lab people/profiles |
| `POST` | `/api/people` | Add/update a person profile |
| `GET` | `/api/news` | Retrieve news and events |
| `POST` | `/api/news` | Publish a news item (admin only) |
| `GET` | `/api/analytics` | Usage and booking analytics (admin only) |

### User Roles & Access Control

| Role | Access Level |
|:---|:---|
| **Student** | Book equipment, view booking history, request consultations |
| **Officer** | Review and approve/reject student booking requests |
| **Staff** | Manage personal profile and lab-related tasks |
| **Admin** | Full access — user management, inventory, analytics, news |

---

## Testing

### Backend API Testing

The backend REST API was tested using manual HTTP requests via `test_api.js` to verify all core endpoints, including:

- **Authentication:** Login, registration, OTP verification, Google OAuth sign-in
- **Booking Engine:** Creating booking requests, officer approval/rejection flows, conflict checking
- **Inventory Management:** CRUD operations for equipment and inventory items
- **User Management:** Admin-level user listing, role updates, and profile management
- **Email Notifications:** OTP delivery and booking status notification emails via Nodemailer

### Frontend Testing

- Role-based routing was tested for all four user types (Student, Officer, Staff, Admin)
- Protected routes verified to redirect unauthenticated users to the login page
- Booking forms validated for date conflicts and availability checks
- Google OAuth login flow tested end-to-end with the configured Client ID
- Responsive layouts tested across desktop and mobile viewports

### Database Testing

- Schema correctness verified by running `runSchema.js` against the Neon PostgreSQL instance
- Seed scripts (`seedUsers.js`, `seedInventory.js`, `seedEquipment.js`) tested to populate initial data without conflicts
- SSL connection to Neon verified with `sslmode=require` and `channel_binding=require`

---

## Conclusion

### What Was Achieved

This project successfully delivers a dual-purpose web platform for the Computer Vision and AI Lab:

- A fully functional **public portal** with research, publications, people, news, and contact sections
- A secure **internal management system** with role-based access for students, officers, staff, and administrators
- A working **equipment booking engine** that handles requests, approvals, and notifications end-to-end
- **JWT authentication** with Google OAuth integration for seamless and secure login
- **Cloud deployment** across Neon (database), Northflank (backend), and Vercel (frontend)

### Future Developments

- Real-time booking availability calendar with visual time-slot selection
- GPU cluster job queue management with estimated wait times
- Mobile application for on-the-go equipment requests
- Integration with the university's central student identity system (LDAP/SSO)
- Automated reporting and analytics export to PDF/Excel for lab administrators
- Notification system via WhatsApp or SMS in addition to email

### Commercialization Potential

The platform's architecture is generic enough to be adapted for any university lab or shared-resource facility. With minor customization, it can serve other departments within the Faculty of Engineering or be packaged as a multi-tenant SaaS product for research institutions.

---

## Links

- [Project Repository](https://github.com/cepdnaclk/e23-co2060-Computer-vision-and-AI-lab-system.git)
- [Project Page](https://cepdnaclk.github.io/e23-co2060-Computer-vision-and-AI-lab-system/)
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)

[//]: # (Please refer this to learn more about Markdown syntax)
[//]: # (https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
