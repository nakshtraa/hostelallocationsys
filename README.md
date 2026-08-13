Hostel Allocator — GEHU BHIMTAL

DAA Enterprise Suite for policy-aware hostel allocation, candidate prioritization, inventory management, analytics, and administrative support.

A modern browser-based hostel allocation management system designed for Graphic Era Hill University (GEHU), Bhimtal. The application combines an administrative dashboard with a deterministic greedy allocation engine to prioritize candidates and allocate hostel inventory according to academic seniority, merit, payment priority, room preferences, capacity, and year-group restrictions.

✨ Overview

The Hostel Allocator provides a unified interface for hostel administrators to:

Authenticate into an administrative workspace

Register and manage hostel candidates

Maintain hostel-room inventory

Capture room-type preferences

Apply year-specific allocation policies

Execute a greedy allocation protocol

Monitor successful allocations and overflow candidates

Inspect allocation metrics and complexity

Persist application data in browser storage

Export an allocation report

Generate synthetic data for simulation

Contact administrative support through WhatsApp

Switch between light and dark UI themes

The interface is built as a responsive single-page web application with a glassmorphism-inspired administrative dashboard.

🚀 Key Features

🔐 Administrative Access

The application starts behind an administrative authentication screen.

Warden ID and passphrase validation

Authentication feedback for invalid credentials

Session initialization before application access

Administrative dashboard loaded after successful authentication

Security note: The current implementation performs authentication entirely in client-side JavaScript. This is suitable for demonstration/prototype environments, but it is not secure for a real production deployment. See Production Hardening.

👨‍🎓 Candidate Registry

Administrators can register candidates with:

Internal student ID

Full name

Academic year

CGPA for senior students

Fee payment date for first-year students

Preferred room types

Duplicate-ID protection

Candidate deletion

Real-time registry count

🏢 Hostel Inventory Management

Administrators can create and manage hostel inventory using:

Room serial number

Room classification

Year-group restriction

Capacity

Current occupancy

Resident list

Occupancy visualization

Room deletion

Supported room classifications:

Single AC

Single Non-AC

Double AC

Double Non-AC

Supported year groups:

Freshman

Senior

🧠 Greedy Allocation Engine

The core allocation workflow uses a greedy strategy.

Candidates are prioritized according to:

First-year candidates

Priority is based on the earliest fee payment date.

Second-to-fourth-year candidates

A weighted priority score is calculated using:

Final Score = 0.6 × (CGPA / 10) + 0.4 × (Year / 4)

The allocation engine then attempts to assign each candidate to the first available room matching:

Candidate preference

Candidate year-group eligibility

Remaining room capacity

Candidates who cannot be assigned are placed into the Waiting / Overflow Queue.

📊 Dashboard & Analytics

The dashboard exposes operational metrics including:

Total registered candidates

Total rooms

Available capacity

Allocation success rate

Recent activity logs

Allocation complexity

Auxiliary-space estimate

🧪 Simulation Mode

The dashboard includes a synthetic traffic simulator capable of generating:

20 synthetic candidates

10 synthetic rooms

Randomized academic years

Randomized CGPAs

Randomized payment dates

Randomized room preferences

Randomized room capacities

This makes it easier to demonstrate the allocation engine without manually entering a complete dataset.

📄 Report Export

Allocation results can be exported as a plain-text allocation manifest containing:

Room ID

Room classification

Year group

Assigned residents

Waiting-list candidates

💬 WhatsApp Support

The Support Desk allows an administrator to compose a support message and open WhatsApp with the message pre-filled.

The destination number is configured through:

const PHONE_NUMBER = "...";

For a real deployment, this value should be moved to a secure configuration mechanism rather than committed directly to the repository.

🌗 Theme Support

The UI supports:

Light mode

Dark mode

Animated transitions

Responsive navigation

Glass-style interface components

🧮 Algorithmic Design

The allocation engine follows a greedy methodology.

Candidate ordering

Candidates are sorted before allocation:

1. Higher academic year first
2. For first-year candidates:
      Earlier payment date first
3. For senior candidates:
      Higher weighted priority score first

Allocation constraints

For every candidate, the engine checks:

Room Type matches preference
        AND
Year Group is permitted
        AND
Room has remaining capacity

If a valid room is found:

allocate candidate
update occupancy
record resident

Otherwise:

place candidate in waiting queue

Complexity

The application documents the main sorting phase as:

O(N log N)

where N is the number of candidates.

The implementation also performs room searches during allocation, so the practical end-to-end runtime depends on the number of candidates, rooms, and preferences.

The application maintains its working dataset in browser memory and persists it through localStorage.

🏗️ Technology Stack

Layer

Technology

Structure

HTML5

Styling

CSS3 + Tailwind CSS

Logic

Vanilla JavaScript

UI Icons

Inline SVG

Typography

Plus Jakarta Sans, JetBrains Mono

Persistence

Browser localStorage

Support Integration

WhatsApp deep link

Runtime

Modern web browser

External frontend resources currently used by the application include:

Tailwind CSS CDN

Google Fonts

📁 Project Structure

The application is intended to use the following structure:

hostel-allocator/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md

index.html

Defines the complete application interface, including:

Authentication screen

Dashboard

Candidate registry

Room inventory

DAA engine

Analytics

Support desk

css/style.css

Contains application-specific styling such as:

Glass UI components

Dark-mode styling

Animations

Scrollbar styling

Status indicators

Support-section styling

js/app.js

Contains the application logic, including:

Authentication

Theme management

Navigation

Activity logging

Local persistence

Candidate management

Room management

Greedy allocation

Rendering

Simulation

Report generation

WhatsApp support

⚙️ Getting Started

Prerequisites

No backend runtime is required for the current implementation.

You only need:

A modern web browser

A local web server for a reliable development environment

1. Clone the repository

git clone https://github.com/<your-username>/<your-repository>.git
cd <your-repository>

2. Verify the project structure

Make sure the JavaScript and CSS files match the paths referenced by index.html:

css/style.css
js/app.js

3. Run locally

You can use VS Code Live Server or another static HTTP server.

For example:

python3 -m http.server 8000

Then open:

http://localhost:8000

Opening the HTML file directly may work for some browser features, but serving the project through a local HTTP server is recommended for development.

🔑 Demo Authentication

The current source contains a client-side demo credential check.

Default credentials in the current implementation:

Warden ID: admin
Passphrase: warden123

⚠️ Important

These credentials are embedded in frontend JavaScript and therefore must not be considered secure credentials.

For production deployment, replace this mechanism with server-side authentication and never commit real passwords, API keys, or privileged credentials to the repository.

💾 Data Persistence

The application stores its working state in browser localStorage.

The primary storage key is:

DAA_ENGINE_DATA

Stored data includes:

Candidates

Rooms

Waiting queue

Activity logs

This means data is:

Local to the browser

Persistent across page reloads

Not automatically synchronized between administrators

Not stored in a centralized database

Clearing browser storage will remove the application's locally persisted dataset.

📤 Allocation Report

The DAA Engine provides an Export Report action.

The generated text report contains:

HOSTEL ALLOCATION REPORT

ROOM <ID> [<TYPE> - <YEAR GROUP>]: <RESIDENTS>

WAITING LIST:
<CANDIDATES>

The report is downloaded as:

allocation_report.txt

🧪 Example Workflow

A typical administrator workflow is:

Authenticate
    ↓
Register Candidates
    ↓
Configure Hostel Inventory
    ↓
Set Candidate Preferences
    ↓
Initialize DAA Engine
    ↓
Sort Candidates by Priority
    ↓
Apply Room Constraints
    ↓
Allocate Available Inventory
    ↓
Generate Waiting Queue
    ↓
Review Analytics
    ↓
Export Allocation Report

🛡️ Production Hardening

The current project is a polished client-side application/demo. Before deploying it as a real institutional production system, the following improvements are strongly recommended.

Authentication & Authorization

Replace client-side credential checking with:

Server-side authentication

Password hashing

Session management

Role-based access control

Secure logout

Rate limiting

Audit trails

Data Layer

Replace localStorage with a centralized database and API layer.

Recommended architecture:

Browser
   ↓
Frontend
   ↓
Authenticated API
   ↓
Backend Services
   ↓
Database

This would enable:

Multi-user access

Centralized records

Concurrent administration

Reliable backups

Data recovery

Institutional reporting

Security

Before production deployment:

Remove hardcoded credentials

Move secrets to environment variables

Validate all input server-side

Sanitize user-generated content

Add CSRF protection where applicable

Enforce HTTPS

Implement secure session cookies/tokens

Add authorization checks to every protected operation

Deployment

For production infrastructure, consider:

CI/CD pipeline

Environment-specific configuration

Automated testing

Error monitoring

Structured logging

Database backups

Health checks

Dependency pinning

Content Security Policy

Asset bundling/minification

Frontend Dependencies

The current implementation loads Tailwind CSS and Google Fonts from external CDNs.

For a production build, consider using a proper frontend build pipeline so dependencies can be:

Version-pinned

Bundled

Optimized

Audited

Served with appropriate caching policies

🔍 Current Limitations

The current implementation intentionally remains lightweight and browser-based.

Known limitations include:

Client-side authentication

Browser-local data persistence

No backend API

No centralized database

No multi-admin synchronization

No server-side authorization

No automated test suite

No transactional allocation persistence

No conflict resolution for concurrent administrators

Allocation report is plain text

External CDN dependencies

These limitations should be addressed before using the system for real institutional data.

🎯 Project Objectives

The project demonstrates how Design and Analysis of Algorithms (DAA) concepts can be integrated into a practical administrative application.

The primary objective is to transform a hostel allocation problem into a structured optimization workflow involving:

Candidate prioritization

Resource constraints

Greedy decision making

Capacity management

Eligibility filtering

Overflow handling

Complexity analysis

Rather than treating DAA as an isolated academic exercise, the application provides a visual interface for observing an algorithm operate on a real-world allocation scenario.

📈 Future Roadmap

Potential future enhancements include:

Backend API

PostgreSQL/MySQL database

Secure authentication

Role-based access control

Admin and warden roles

Centralized student records

REST/GraphQL API

Advanced allocation optimization

Constraint conflict detection

Allocation history and rollback

PDF report generation

CSV/Excel export

Advanced analytics dashboards

Automated test suite

CI/CD

Docker deployment

Production monitoring

Accessibility audit

Automated database backups

🧠 Why a Greedy Strategy?

Hostel allocation is a constrained resource-allocation problem where candidates have different priorities and room preferences.

The current implementation makes locally optimal decisions by:

Establishing a priority order.

Processing candidates from highest to lowest priority.

Assigning the first eligible room that satisfies the candidate's preferences and capacity constraints.

Moving candidates without a feasible assignment into an overflow queue.

This approach is computationally simple and transparent, making it particularly suitable for demonstrating algorithmic decision-making.

For a production institutional system, the allocation policy should be validated against official university rules and, if necessary, replaced or augmented with a more formally optimized algorithm.

🤝 Contributing

Contributions are welcome.

A recommended workflow:

git checkout -b feature/your-feature

Make your changes, test them locally, and submit a pull request with:

A clear description of the change

Screenshots for UI changes

Relevant algorithmic or architectural notes

Testing details

📜 License

No license is currently specified for this repository.

If this project is intended to be publicly distributed or reused, add an appropriate LICENSE file before publishing.

👨‍💻 Author

Your Name

Built as a DAA-focused hostel allocation management system for Graphic Era Hill University, Bhimtal.

⭐ Project Summary

Hostel Allocator — GEHU BHIMTAL is a responsive administrative web application that combines a modern management dashboard with a greedy resource-allocation engine.

It demonstrates how algorithmic concepts such as sorting, priority-based decision making, constrained resource allocation, complexity analysis, persistence, and simulation can be integrated into a practical software system.

Status: Functional frontend prototype / academic enterprise-suite implementation
Recommended production status: Requires backend security, centralized persistence, testing, and deployment hardening before handling real institutional data.
