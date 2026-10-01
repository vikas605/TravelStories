🌍 TravelStories
Every Journey Has a Story.

TravelStories is a full-stack web application where travelers can share, discover, and explore real travel experiences.

The platform allows users to publish journeys with destinations, transportation details, costs, routes, experiences, and travel tips. Stories are stored in a SQL Server database and served through a Node.js + Express REST API.

🔗 Live Website: https://travelstories-frontend.onrender.com/
🔗 GitHub Repository: https://github.com/vikas605/TravelStories
🔗 Backend API: https://travelstories-backend.onrender.com/api/stories

📌 Project Overview

Travel information is often spread across social media posts, videos, blogs, and different travel websites.

I built TravelStories to create a simple platform where people can share their actual journeys in a structured format.

A traveler can publish information such as:

📍 Starting location
🗺️ Destination
🚗 Transportation method
💰 Travel cost
🛣️ Route
✍️ Travel experience
💡 Useful travel tips

Other users can then explore these stories and learn from real journeys.

✨ Key Features
📝 Share a Travel Story

Users can publish their journey by providing:

Story title
Starting location
Destination
Transportation
Travel cost
Route
Experience
Travel tips
🌍 Explore Travel Stories

Users can browse published journeys and discover travel experiences from different destinations.

Each story provides important travel information in an easy-to-read format.

📖 Story Details

Users can open an individual story and view its complete information.

The application uses the story ID to retrieve the corresponding record from the backend API.

💰 Travel Cost

Stories can include the approximate amount spent during the journey, helping other travelers understand the potential travel budget.

🚗 Transportation Information

The application supports different transportation types and displays an appropriate transport icon for each story.

Examples include:

🚗 Car
🏍️ Bike
🚌 Bus
🚆 Train
✈️ Flight
🚶 Walking
🔎 Travel Search

The interface is designed around discovering journeys by locations and destinations.

Users can explore travel experiences involving places such as:

Pune • Mumbai • Goa • Lonavala • Mulshi

📱 Responsive Interface

The frontend is designed to work across different screen sizes and devices.

The application has been tested from multiple devices and networks after deployment.

🏗️ System Architecture
                    ┌─────────────────────┐
                    │       User          │
                    │   Browser / Mobile  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Frontend       │
                    │    HTML / CSS / JS  │
                    └──────────┬──────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Node.js + Express │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    SQL Server DB    │
                    │    TravelStoriesDB  │
                    └─────────────────────┘
🛠️ Technology Stack
Frontend
HTML5
CSS3
JavaScript
Responsive Web Design
Backend
Node.js
Express.js
CORS
dotenv
mssql
Database
Microsoft SQL Server
SQL Server Management Studio (SSMS)
Deployment
Render
Cloud-hosted SQL Server
Development Tools
Visual Studio Code
SSMS
Git
GitHub
PowerShell
📂 Project Structure
TravelStories/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── database/
│   └── TravelStories_Analytics.sql
│
└── README.md

.env contains sensitive database credentials and should not be committed to GitHub.

🗄️ Database

TravelStories uses Microsoft SQL Server for persistent data storage.

The main database is:

TravelStoriesDB

The primary story data is stored in the:

Stories

table.

A story contains information such as:

Story ID
Title
Start Location
Destination
Transport
Cost
Route
Experience
Tips

The database is accessed by the Node.js backend through the mssql package.

🔌 REST API

The backend exposes REST API endpoints for interacting with travel stories.

Get all stories
GET /api/stories

Example:

https://travelstories-backend.onrender.com/api/stories
Get a specific story
GET /api/stories/:id

Example:

GET /api/stories/1790652373487
Create a new story
POST /api/stories

The frontend sends the story information to the backend, and the backend stores it in SQL Server.

🔄 Application Flow
1. User opens TravelStories

The browser loads the frontend application.

Frontend → HTML + CSS + JavaScript
2. Frontend requests stories

JavaScript sends a request to:

GET /api/stories
3. Backend processes the request

Node.js + Express receives the request and communicates with SQL Server.

Express → SQL Server
4. Database returns the data

The backend receives the travel stories from SQL Server.

5. Backend sends JSON response
SQL Server
     ↓
Node.js / Express
     ↓
JSON
     ↓
Frontend
6. Frontend displays the stories

JavaScript dynamically creates the story cards and displays them to the user.

🚀 Running the Project Locally
1. Clone the repository
git clone https://github.com/vikas605/TravelStories.git

Move into the project:

cd TravelStories
⚙️ Backend Setup

Move into the backend directory:

cd backend

Install dependencies:

npm install

Create a .env file:

DB_SERVER=your_sql_server
DB_DATABASE=your_database
DB_USER=your_username
DB_PASSWORD=your_password
DB_PORT=1433

Then start the backend:

npm start

The local API runs on:

http://localhost:5000

API endpoint:

http://localhost:5000/api/stories
🗃️ Database Setup

Open:

database/TravelStories_Analytics.sql

in SQL Server Management Studio.

Execute the SQL script to create the required database objects.

Then configure the database credentials in the backend .env file.

🌐 Frontend Setup

Open:

frontend/index.html

in a browser or use a local development server.

The frontend communicates with the backend API.

For local development:

Frontend
    ↓
http://localhost:5000/api/stories

For production:

Frontend
    ↓
https://travelstories-backend.onrender.com/api/stories
☁️ Deployment

TravelStories is deployed as separate frontend and backend services.

Frontend

Hosted using Render:

https://travelstories-frontend.onrender.com/
Backend

Hosted using Render:

https://travelstories-backend.onrender.com/
Database

The production backend connects to a cloud-hosted Microsoft SQL Server database.

This allows the publicly deployed application to retrieve and store travel stories without depending on the developer's local computer.

🔐 Environment Variables

Sensitive credentials are stored using environment variables rather than hard-coded directly into the application.

Example:

DB_SERVER=
DB_DATABASE=
DB_USER=
DB_PASSWORD=
DB_PORT=

The .env file should never be uploaded to GitHub.

A .gitignore file is used to prevent sensitive files from being committed.

🧪 Testing

The application was tested locally and after deployment.

Testing included:

Frontend loading
Backend API connectivity
SQL Server connectivity
Story retrieval
Individual story retrieval
Story publishing
Story IDs
API URLs
Cross-origin requests
Transport icons
Public deployment
Access from another device/network

The deployed application was also accessed from another device and network to verify that the production system works outside the development environment.

🐛 Problems Solved During Development

Building TravelStories involved solving several real-world development and deployment problems.

API URL Configuration

The frontend initially used an incorrect backend deployment URL.

The API configuration was updated to point to the deployed Render backend.

Story ID Handling

Story IDs needed to remain consistent between the frontend, backend, and database.

The application was updated so individual stories could correctly open using their IDs.

Transport Icon Display

Different transportation values required consistent icon handling.

A dedicated transport-icon mapping was implemented so the UI displays the appropriate symbol.

SQL Server Cloud Connection

The application originally worked with a local SQL Server environment.

The backend was later configured to connect to a cloud-hosted SQL Server database so the deployed application could access persistent data.

Environment Configuration

Database credentials and production configuration were separated from application source code using environment variables.

📚 What I Learned

Building TravelStories helped me gain practical experience with:

Full-stack web development
REST APIs
Node.js
Express.js
SQL Server
Database connectivity
JavaScript DOM manipulation
CRUD operations
Environment variables
CORS
Git and GitHub
Cloud deployment
Debugging production issues
Connecting a deployed backend to a cloud database
Testing a live application across different devices and networks
🎯 Project Goals

The long-term goal of TravelStories is to create a platform where travelers can:

Share authentic journeys
Discover new destinations
Compare travel experiences
Understand approximate travel costs
Find useful route information
Learn practical tips from other travelers

The project can be expanded with additional community and travel features in the future.

🔮 Future Improvements

Potential future improvements include:

🔐 User authentication
👤 User profiles
❤️ Like and save stories
💬 Comments
⭐ Story ratings
📸 Travel photos
🗺️ Interactive maps
🔎 Advanced search and filters
📍 Location-based discovery
📊 Travel analytics dashboard
📱 Progressive Web App functionality
🔔 Notifications
🛡️ Improved moderation and reporting
📈 Admin dashboard
📸 Screenshots

Add screenshots of the deployed application here.

Example:

screenshots/
├── home.png
├── explore.png
├── share-story.png
└── story-details.png

Then add them to this README:

![TravelStories Home](screenshots/home.png)

![Explore Stories](screenshots/explore.png)

![Share a Story](screenshots/share-story.png)

![Story Details](screenshots/story-details.png)
👨‍💻 Developer

Vikas Gaikwad

Computer Engineering Graduate
Pune, Maharashtra, India

Interested in:

Software Development
SQL
Data Analytics
Backend Development
Full-Stack Development
🔗 Project Links
🌍 Live Website

https://travelstories-frontend.onrender.com/

💻 GitHub Repository

https://github.com/vikas605/TravelStories

⚙️ Backend API

https://travelstories-backend.onrender.com/api/stories

⭐ Support the Project

If you find TravelStories interesting, consider giving the repository a ⭐ on GitHub.

Feedback, suggestions, and contributions are welcome.
📄 License

This project is created for portfolio, learning, and demonstration purposes.
