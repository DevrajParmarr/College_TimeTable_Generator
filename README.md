# Exam Room Allocation System

## PDQA Project

**Under the guidance of:**  
Ashwini Sharma Ma'am

**Team Members:**  
- Devraj Parmar
- Rahul Bamniya
- Prakhar Dangolia
- Prakhar Gupta
- Vaibhav Singh

## 📋 Overview

A comprehensive web application for managing exam room allocations, teacher assignments, and administrative data for educational institutions.

## 🚀 Features

- **Room Allocation Engine**: Intelligent allocation of exam rooms based on capacity and student requirements
- **Teacher Assignment System**: Automated teacher duty assignments with availability constraints
- **Admin Panel**: Complete CRUD operations for managing branches, rooms, exams, and teachers
- **Real-time Allocation**: Dynamic allocation results with visual feedback
- **Modern UI**: Responsive Material-UI interface with search, pagination, and notifications

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Material-UI
- **Database**: In-memory JSON storage
- **Algorithms**: Custom allocation engines for rooms and teachers

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DevrajParmarr/College_TimeTable_Generator.git
   cd exam-room-allocation
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## 🚀 Running the Application

1. **Start Backend Server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`

2. **Start Frontend (in new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on `http://localhost:3000`

## 📊 Usage

1. **View Allocations**: Click "Run Allocation" to see room and teacher assignments
2. **Admin Management**: Switch to "Admin Panel" tab to manage data
3. **CRUD Operations**: Add, edit, delete branches, rooms, exams, and teachers
4. **Search & Filter**: Use search bars and pagination in admin sections

## 📁 Project Structure

```
exam-room-allocation/
├── data/                 # JSON data files
├── utils/               # Allocation algorithms
├── frontend/            # React application
├── server.js           # Express server
├── package.json        # Backend dependencies
└── README.md          # This file
```

## 🎯 Key Components

- **Room Allocation Engine**: Optimizes room assignments based on capacity
- **Teacher Allocation Engine**: Considers availability, experience, and leave
- **Admin Interface**: Modern CRUD interface with advanced features
- **Real-time Updates**: Dynamic allocation with visual feedback

## 📈 Features in Detail

### Admin Panel Enhancements
- ✅ Search functionality across all entities
- ✅ Pagination for large datasets
- ✅ Sort options (ascending/descending)
- ✅ Modern dialog forms with validation
- ✅ Success/error notifications
- ✅ Responsive design
- ✅ Tooltips and accessibility features

### Allocation Features
- ✅ Dynamic teacher assignment reset
- ✅ "Unassigned" status for unavailable slots
- ✅ Visual indicators for allocation status
- ✅ Real-time calculation updates

## 🤝 Contributing

This is a PDQA project developed by the team under Ashwini Sharma Ma'am.

## 📄 License

ISC License