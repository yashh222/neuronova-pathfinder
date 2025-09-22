"""
Risk Detection Router - Rule-based risk analysis and dashboard data
Implements business logic for identifying at-risk students
"""

from fastapi import APIRouter, HTTPException, Query
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json

from utils.risk_rules import RiskAnalyzer
from routers.data_ingestion import uploaded_data

router = APIRouter()
risk_analyzer = RiskAnalyzer()


@router.get("/get-dashboard-data")
async def get_dashboard_data(
    class_filter: Optional[str] = Query(None, description="Filter by class (e.g., '10th', '11th')"),
    risk_filter: Optional[str] = Query(None, description="Filter by risk level (high, medium, low)"),
    limit: Optional[int] = Query(100, description="Maximum number of students to return")
) -> Dict[str, Any]:
    """
    Get processed dashboard data with risk indicators for frontend visualization
    
    Args:
        class_filter: Optional class filter
        risk_filter: Optional risk level filter
        limit: Maximum students to return
    
    Returns:
        Complete dashboard data with risk analysis
    """
    try:
        # Get student risk analysis
        students_with_risk = risk_analyzer.analyze_all_students(
            uploaded_data["attendance"],
            uploaded_data["marks"], 
            uploaded_data["fees"]
        )
        
        # Apply filters
        filtered_students = students_with_risk
        
        if class_filter and class_filter.lower() != 'all':
            filtered_students = [
                s for s in filtered_students 
                if class_filter.lower() in s.get('class', '').lower()
            ]
        
        if risk_filter and risk_filter.lower() != 'all':
            filtered_students = [
                s for s in filtered_students 
                if s.get('riskLevel') == risk_filter.lower()
            ]
        
        # Apply limit
        filtered_students = filtered_students[:limit]
        
        # Calculate statistics
        total_students = len(students_with_risk)
        risk_stats = {
            "high": len([s for s in students_with_risk if s.get('riskLevel') == 'high']),
            "medium": len([s for s in students_with_risk if s.get('riskLevel') == 'medium']),
            "low": len([s for s in students_with_risk if s.get('riskLevel') == 'low'])
        }
        
        # Calculate trends (mock data for demo)
        trends = {
            "attendance_trend": calculate_attendance_trend(),
            "performance_trend": calculate_performance_trend(),
            "risk_trend": calculate_risk_trend(students_with_risk)
        }
        
        return {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "students": filtered_students,
            "statistics": {
                "total_students": total_students,
                "filtered_count": len(filtered_students),
                "risk_distribution": risk_stats,
                "attendance_avg": calculate_average_attendance(students_with_risk),
                "performance_avg": calculate_average_performance(students_with_risk)
            },
            "trends": trends,
            "filters_applied": {
                "class": class_filter,
                "risk_level": risk_filter,
                "limit": limit
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dashboard data generation failed: {str(e)}")


@router.post("/risk-detection")
async def run_risk_detection(
    refresh_data: bool = True
) -> Dict[str, Any]:
    """
    Run risk detection analysis on all uploaded student data
    
    Args:
        refresh_data: Whether to refresh analysis with latest data
    
    Returns:
        Risk detection results and flagged students
    """
    try:
        if not any(uploaded_data.values()):
            raise HTTPException(
                status_code=400,
                detail="No student data available. Please upload data files first."
            )
        
        # Analyze student risk
        analysis_results = risk_analyzer.analyze_all_students(
            uploaded_data["attendance"],
            uploaded_data["marks"],
            uploaded_data["fees"]
        )
        
        # Categorize by risk level
        high_risk_students = [s for s in analysis_results if s.get('riskLevel') == 'high']
        medium_risk_students = [s for s in analysis_results if s.get('riskLevel') == 'medium']
        
        # Generate alerts for high-risk students
        alerts = []
        for student in high_risk_students:
            alert = risk_analyzer.generate_risk_alert(student)
            if alert:
                alerts.append(alert)
        
        return {
            "success": True,
            "analysis_timestamp": datetime.now().isoformat(),
            "total_students_analyzed": len(analysis_results),
            "risk_summary": {
                "high_risk_count": len(high_risk_students),
                "medium_risk_count": len(medium_risk_students),
                "low_risk_count": len(analysis_results) - len(high_risk_students) - len(medium_risk_students)
            },
            "high_risk_students": high_risk_students,
            "medium_risk_students": medium_risk_students,
            "generated_alerts": alerts,
            "recommendations": generate_recommendations(high_risk_students, medium_risk_students)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk detection failed: {str(e)}")


@router.get("/student-risk/{student_id}")
async def get_student_risk_details(student_id: str) -> Dict[str, Any]:
    """Get detailed risk analysis for a specific student"""
    try:
        # Find student in uploaded data
        student_data = risk_analyzer.get_student_details(
            student_id,
            uploaded_data["attendance"],
            uploaded_data["marks"],
            uploaded_data["fees"]
        )
        
        if not student_data:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Perform detailed risk analysis
        risk_analysis = risk_analyzer.analyze_student_detailed(student_data)
        
        return {
            "student_data": student_data,
            "risk_analysis": risk_analysis,
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Student risk analysis failed: {str(e)}")


# Helper functions for dashboard calculations

def calculate_attendance_trend() -> List[Dict[str, Any]]:
    """Calculate attendance trend over time (mock data for demo)"""
    return [
        {"month": "Aug 2024", "average": 78.5},
        {"month": "Sep 2024", "average": 76.2},
        {"month": "Oct 2024", "average": 74.8},
        {"month": "Nov 2024", "average": 73.1}
    ]


def calculate_performance_trend() -> List[Dict[str, Any]]:
    """Calculate performance trend over time (mock data for demo)"""
    return [
        {"month": "Aug 2024", "average": 68.3},
        {"month": "Sep 2024", "average": 66.7},
        {"month": "Oct 2024", "average": 65.2},
        {"month": "Nov 2024", "average": 64.8}
    ]


def calculate_risk_trend(students: List[Dict]) -> List[Dict[str, Any]]:
    """Calculate risk level distribution trend"""
    high_risk_count = len([s for s in students if s.get('riskLevel') == 'high'])
    medium_risk_count = len([s for s in students if s.get('riskLevel') == 'medium'])
    
    return [
        {"month": "Aug 2024", "high": max(0, high_risk_count - 3), "medium": max(0, medium_risk_count - 2)},
        {"month": "Sep 2024", "high": max(0, high_risk_count - 2), "medium": max(0, medium_risk_count - 1)},
        {"month": "Oct 2024", "high": max(0, high_risk_count - 1), "medium": medium_risk_count},
        {"month": "Nov 2024", "high": high_risk_count, "medium": medium_risk_count}
    ]


def calculate_average_attendance(students: List[Dict]) -> float:
    """Calculate average attendance across all students"""
    if not students:
        return 0.0
    
    attendances = [s.get('attendance', 0) for s in students]
    return round(sum(attendances) / len(attendances), 2)


def calculate_average_performance(students: List[Dict]) -> float:
    """Calculate average performance/score across all students"""
    if not students:
        return 0.0
    
    scores = [s.get('score', 0) for s in students]
    return round(sum(scores) / len(scores), 2)


def generate_recommendations(high_risk: List[Dict], medium_risk: List[Dict]) -> List[str]:
    """Generate actionable recommendations based on risk analysis"""
    recommendations = []
    
    if high_risk:
        recommendations.append(f"Immediate intervention needed for {len(high_risk)} high-risk students")
        recommendations.append("Schedule parent-teacher meetings for high-risk students")
        recommendations.append("Implement personalized study plans and mentorship programs")
    
    if medium_risk:
        recommendations.append(f"Monitor and support {len(medium_risk)} medium-risk students")
        recommendations.append("Provide additional academic support and counseling")
    
    if not high_risk and not medium_risk:
        recommendations.append("All students are performing well - continue current strategies")
    
    return recommendations