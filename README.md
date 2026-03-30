# Dual Simplex Airline Application 🛫

A cinematic, interactive storytelling website for solving and visualizing the **Dual Simplex Algorithm** with real-world airline optimization scenarios. This application combines mathematical optimization with engaging UI/UX and 3D visualization.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation Requirements](#installation-requirements)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technology Stack](#technology-stack)
- [Project Details](#project-details)

---

## 🎯 Project Overview

The **Dual Simplex Airline Application** is an interactive web-based tool designed to:

- **Solve optimization problems** using the Dual Simplex Algorithm
- **Visualize solutions** with interactive 3D graphics and animations
- **Simulate airline scheduling** and cost optimization scenarios
- **Calculate costs** based on various flight parameters
- **Provide step-by-step explanations** of the simplex method

This application bridges the gap between complex mathematical algorithms and user-friendly visualization, making optimization accessible to students and professionals alike.

---

## ✨ Features

- 🎬 **Cinematic UI** - Smooth animations powered by GSAP (GreenSock Animation Platform)
- 📊 **Interactive 3D Visualization** - Real-time 3D scene rendering using Three.js
- ✈️ **Airline Optimization** - Real-world scenarios for flight planning and cost optimization
- 🧮 **Cost Calculator** - Automated calculation system for optimization parameters
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 💾 **Database Storage** - SQLite integration for persisting optimization results
- 🎨 **Modern Styling** - Clean and intuitive CSS styling for enhanced UX

---

## 📁 Project Structure

```
Dual_Simplex_Application/
│
├── app.js                          # Main Express application entry point
├── package.json                    # Project dependencies and scripts
├── README.md                       # Project documentation (this file)
│
├── controllers/
│   ├── optimizeController.js       # Handles optimization algorithm logic
│   └── pageController.js           # Manages page rendering and navigation
│
├── database/                       # Database configurations (if any)
│
├── models/
│   └── index.js                    # Database models and initialization
│
├── public/                         # Static files served to clients
│   ├── css/
│   │   └── style.css               # Main stylesheet
│   └── js/
│       ├── main.js                 # Main client-side logic
│       ├── simplex-logic.js        # Dual Simplex algorithm implementation
│       ├── cost-calculator.js      # Cost calculation logic
│       ├── gsap-animations.js      # Animation definitions
│       └── three-scene.js          # 3D visualization setup
│
├── routes/
│   ├── mainRoutes.js               # Main page routes
│   └── apiRoutes.js                # API endpoint routes
│
└── views/                          # EJS template files
    ├── index.ejs                   # Home page template
    ├── simulate.ejs                # Simulation page template
    ├── results.ejs                 # Results display template
    └── partials/
        ├── head.ejs                # Common HTML head section
        └── footer.ejs              # Common footer section
```

---

## 🔧 Installation Requirements

### System Requirements

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **Operating System**: Windows, macOS, or Linux
- **Browser**: Modern browser supporting WebGL and ES6 (Chrome, Firefox, Safari, Edge)

### Dependencies

All dependencies are listed in `package.json`:

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework for Node.js |
| ejs | ^3.1.9 | Templating engine for dynamic views |
| sqlite3 | ^5.1.7 | SQLite database driver |
| sqlite | ^5.1.1 | SQLite database wrapper |

### Optional Dependencies (for development)

- **Nodemon** (recommended): Auto-restart server during development
- **Git**: For version control

---

## 📥 Setup Instructions

### Step 1: Prerequisites

Ensure you have Node.js and npm installed:

```bash
node --version
npm --version
```

### Step 2: Clone or Navigate to Project

```bash
cd "Math Project/Dual_Simplex_Application"
```

### Step 3: Install Dependencies

Install all required packages using npm:

```bash
npm install
```

This will install all packages listed in `package.json`:
- express
- ejs
- sqlite3
- sqlite

### Step 4: Start the Application

Run the application using:

```bash
npm start
```

Or alternatively:

```bash
node app.js
```

The server will start and display:
```
Server is running at http://localhost:3000
```

### Step 5: Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

---

## 🚀 Usage

### Home Page (`/`)
- Landing page with project introduction
- Navigation to simulation and results sections

### Simulation Page (`/simulate`)
- Input optimization parameters
- Configure airline scenario details
- Run the Dual Simplex algorithm

### Results Page (`/results`)
- View computed optimization results
- 3D visualization of the solution
- Animated breakdown of calculation steps

### API Endpoints
- `POST /api/optimize` - Run optimization calculation
- `GET /api/results` - Retrieve stored optimization results

---

## 🌐 API Endpoints

### POST `/api/optimize`

**Purpose**: Execute the Dual Simplex algorithm with given parameters

**Request Body**:
```json
{
  "flights": [
    { "origin": "NYC", "destination": "LAX", "cost": 250 },
    { "origin": "LAX", "destination": "CHI", "cost": 180 }
  ],
  "constraints": {
    "maxFlights": 10,
    "budgetLimit": 5000
  }
}
```

**Response**:
```json
{
  "success": true,
  "result": {
    "optimalSolution": [...],
    "totalCost": 4200,
    "iterations": 7
  }
}
```

---

## 💻 Technology Stack

| Category | Technology | Usage |
|----------|-----------|-------|
| **Backend** | Node.js + Express.js | Server and API management |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | User interface |
| **Templating** | EJS | Dynamic page rendering |
| **Database** | SQLite3 | Data persistence |
| **3D Graphics** | Three.js | 3D visualization |
| **Animations** | GSAP (GreenSock) | Smooth animations |
| **Styling** | CSS3 | Modern UI design |

---

## 📊 Project Details

### Dual Simplex Algorithm

The **Dual Simplex Method** is a linear programming algorithm that solves optimization problems by:

1. Starting from an infeasible but optimal basis
2. Iteratively removing infeasibility
3. Converging to the optimal solution

**Application in Airline Industry**:
- Minimize operational costs
- Optimize flight schedules
- Allocate resources efficiently
- Satisfy constraints (capacity, time, budget)

### Key Features of Implementation

- **Cost Calculator** (`cost-calculator.js`): Computes objective function values
- **Simplex Logic** (`simplex-logic.js`): Core algorithm implementation
- **3D Scene** (`three-scene.js`): Real-time visualization of solution space
- **Database Models** (`models/index.js`): Store and retrieve optimization history

---

## 🎮 Client-Side Architecture

### JavaScript Files Overview

1. **main.js** - Entry point for client-side logic and event handling
2. **simplex-logic.js** - Implements the Dual Simplex algorithm
3. **cost-calculator.js** - Calculates costs based on parameters
4. **gsap-animations.js** - Defines smooth animations for UI elements
5. **three-scene.js** - Creates and manages 3D visualization using Three.js

---

## 📝 Server-Side Architecture

### Routes

- **mainRoutes.js** - Handles page rendering (GET requests)
- **apiRoutes.js** - Handles API requests (POST/GET)

### Controllers

- **pageController.js** - Manages view rendering and passing data to templates
- **optimizeController.js** - Processes optimization logic and database operations

---

## 🐛 Troubleshooting

### Issue: Server won't start

**Solution**: 
```bash
# Clear npm cache and reinstall
npm cache clean --force
npm install
npm start
```

### Issue: Port 3000 already in use

**Solution**: Change port in `app.js` or kill the process using port 3000

### Issue: Database not initializing

**Solution**: Ensure SQLite is properly installed
```bash
npm install sqlite3 --build-from-source
npm start
```

### Issue: 3D visualization not showing

**Solution**: Ensure your browser supports WebGL
- Check WebGL support: https://webglreport.com/
- Use a modern browser (Chrome, Firefox, Safari, Edge)

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [EJS Templating](https://ejs.co/)
- [Three.js Documentation](https://threejs.org/)
- [GSAP Animation Library](https://greensock.com/gsap/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Simplex Algorithm Theory](https://en.wikipedia.org/wiki/Simplex_algorithm)

---

## 🤝 Contributing

To contribute to this project:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Yash Jadhav**

---

## 📧 Support

For questions or issues, please create an issue in the repository or contact the project maintainer.

---

**Last Updated**: March 2026

**Version**: 1.0.0
