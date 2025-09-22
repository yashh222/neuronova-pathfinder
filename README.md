# 🎓 Smart India Hackathon - AI-based Dropout Prediction & Counseling System

A comprehensive web application for predicting and preventing student dropouts using rule-based analysis of attendance, academic performance, and fee payment patterns.

## 🏆 Project Overview

This system helps educational institutions identify at-risk students early and take proactive measures to prevent dropouts. It features:

- **📊 Interactive Dashboard** - Real-time visualization of student risk indicators
- **📁 Data Upload System** - Easy CSV/Excel file processing for attendance, marks, and fees
- **🚨 Risk Detection Engine** - Rule-based algorithms to identify high-risk students  
- **📧 Alert System** - Email/SMS notifications for parents and teachers
- **📈 Analytics & Insights** - Comprehensive reporting and trend analysis

## 🏗️ Architecture

```
project-root/
├── frontend/                 # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API communication layer
│   │   └── hooks/          # Custom React hooks
├── backend/                 # FastAPI + Python
│   ├── main.py             # Application entry point
│   ├── routers/            # API route handlers
│   │   ├── data_ingestion.py
│   │   ├── risk_detection.py
│   │   └── alerts.py
│   └── utils/              # Business logic utilities
│       ├── csv_parser.py   # File processing
│       └── risk_rules.py   # Risk analysis algorithms
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)

### 🔧 Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend/
   ```

2. **Create Python virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. **Start the backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at: `http://localhost:8000`
   
   - **API Documentation**: `http://localhost:8000/api/docs`
   - **Health Check**: `http://localhost:8000/api/health`

### 🎨 Frontend Setup

1. **Navigate to project root (frontend is in the main directory)**
   ```bash
   cd ../  # if you're in backend directory
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file to point to your backend URL
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at: `http://localhost:5173`

## 📊 Usage Instructions

### 1. Upload Student Data

1. **Go to Upload Page** - Navigate to `/upload` in the application
2. **Prepare Data Files** - Ensure your CSV/Excel files follow the expected format:

   **Attendance Data Format:**
   ```csv
   student_name,class,date,status
   Priya Sharma,10A,2024-01-15,Present
   Raj Kumar,12B,2024-01-15,Absent
   ```

   **Marks Data Format:**
   ```csv
   student_name,subject,test,marks
   Priya Sharma,Math,Test1,85
   Raj Kumar,Science,Test1,72
   ```

   **Fees Data Format:**
   ```csv
   student_name,month,amount,status
   Priya Sharma,Jan2024,5000,Paid
   Raj Kumar,Jan2024,5000,Overdue
   ```

3. **Upload Files** - Drag & drop or select files to upload
4. **Verify Upload** - Check that files are processed successfully

### 2. View Risk Dashboard

1. **Navigate to Dashboard** - Go to `/dashboard`
2. **Review Statistics** - Check overall risk distribution
3. **Filter Students** - Use class and risk level filters
4. **Analyze Individual Students** - Click "View Details" for detailed analysis

### 3. Risk Detection

The system automatically analyzes uploaded data using these rules:

- **🔴 High Risk**: Attendance < 60% OR Marks < 40% OR Fees overdue > 2 months
- **🟡 Medium Risk**: Attendance < 75% OR Marks < 60% OR Fees overdue > 1 month  
- **🟢 Low Risk**: All indicators within acceptable ranges

### 4. Send Alerts

1. **From Dashboard** - Select students to alert
2. **Choose Alert Type** - Email or SMS notifications
3. **Customize Message** - Add personalized content
4. **Send & Track** - Monitor delivery status

## 🔌 API Endpoints

### Data Management
- `POST /api/upload-data` - Upload student data files
- `GET /api/upload-status` - Check upload status
- `GET /api/data-preview/{type}` - Preview uploaded data

### Risk Analysis  
- `GET /api/get-dashboard-data` - Fetch dashboard data with filters
- `POST /api/risk-detection` - Run risk analysis on all students
- `GET /api/student-risk/{student_id}` - Get detailed student risk analysis

### Alerts & Notifications
- `POST /api/send-alerts` - Send email alerts
- `POST /api/send-sms-alerts` - Send SMS alerts  
- `GET /api/alerts-history` - Get alerts history
- `POST /api/bulk-alerts` - Send bulk notifications

### System Health
- `GET /api/health` - API health check
- `GET /` - Basic API information

## 🛠️ Development

### Running Tests

**Backend Tests:**
```bash
cd backend/
pytest
```

**Frontend Tests:**
```bash
npm test
```

### Code Quality

**Backend Linting:**
```bash
cd backend/
flake8 .
black .
```

**Frontend Linting:**
```bash
npm run lint
```

### Building for Production

**Backend:**
```bash
cd backend/
pip install -r requirements.txt
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

**Frontend:**
```bash
npm run build
npm run preview
```

## 📁 Data Format Requirements

### Supported File Types
- **.csv** files (UTF-8 encoded)
- **.xlsx** Excel files
- **.xls** Excel files (legacy)

### Required Columns

The system automatically detects data types, but ensure these columns exist:

**Attendance:** `student_name`, `class`, `date`, `status`
**Marks:** `student_name`, `subject`, `test`, `marks`  
**Fees:** `student_name`, `month`, `amount`, `status`

### Data Validation Rules

- Student names must be consistent across all files
- Dates should be in readable format (YYYY-MM-DD preferred)
- Status values: Present/Absent for attendance, Paid/Overdue/Partial for fees
- Marks should be numeric values (0-100 scale preferred)

## 🔒 Security & Privacy

- All uploaded data is processed locally and not shared with external services
- File uploads are validated and sanitized
- Email/SMS alerts are placeholder implementations (configure with your providers)
- No student data is permanently stored (in-memory processing only)

## ⚡ Performance Considerations

- **File Size Limits**: 10MB per file upload
- **Concurrent Users**: Designed for institutional use (100+ concurrent users)
- **Data Processing**: Optimized for datasets up to 10,000 student records
- **Response Times**: Sub-second API responses for most operations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is developed for Smart India Hackathon 2024. All rights reserved.

## 📞 Support & Contact

- **Issues**: Create GitHub issues for bug reports
- **Features**: Use GitHub discussions for feature requests
- **Documentation**: Check `/api/docs` for detailed API documentation

## 🏆 Smart India Hackathon 2024

This project addresses the critical challenge of student dropout prevention through:
- Early identification of at-risk students
- Data-driven intervention strategies  
- Automated alert systems for stakeholders
- Comprehensive analytics for institutional decision-making

**Built with**: React, TypeScript, FastAPI, Python, Tailwind CSS, shadcn/ui

---

### 📊 Dashboard Screenshots

*Upload demo data to see the full dashboard in action!*

🚀 **Ready to prevent dropouts and support student success!**