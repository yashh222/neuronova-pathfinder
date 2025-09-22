"""
Risk Rules Utility - Rule-based logic for identifying at-risk students
Implements business rules for dropout prediction without ML models
"""

from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
import statistics


class RiskAnalyzer:
    """Rule-based risk analysis for student dropout prediction"""
    
    def __init__(self):
        # Risk thresholds (configurable)
        self.risk_thresholds = {
            "attendance": {
                "high_risk": 60,    # < 60% attendance = high risk
                "medium_risk": 75   # < 75% attendance = medium risk
            },
            "performance": {
                "high_risk": 40,    # < 40% marks = high risk
                "medium_risk": 60   # < 60% marks = medium risk
            },
            "fees": {
                "high_risk": 2,     # 2+ months overdue = high risk
                "medium_risk": 1    # 1+ month overdue = medium risk
            }
        }
        
        # Risk weights for combined scoring
        self.risk_weights = {
            "attendance": 0.4,   # 40% weightage
            "performance": 0.35, # 35% weightage
            "fees": 0.25        # 25% weightage
        }
    
    def analyze_all_students(
        self, 
        attendance_data: List[Dict], 
        marks_data: List[Dict], 
        fees_data: List[Dict]
    ) -> List[Dict[str, Any]]:
        """
        Analyze risk for all students based on uploaded data
        
        Args:
            attendance_data: List of attendance records
            marks_data: List of marks records
            fees_data: List of fees records
        
        Returns:
            List of students with risk analysis
        """
        # Get unique students from all data sources
        students = self._get_unique_students(attendance_data, marks_data, fees_data)
        
        analyzed_students = []
        
        for student_name in students:
            try:
                student_analysis = self._analyze_single_student(
                    student_name, attendance_data, marks_data, fees_data
                )
                if student_analysis:
                    analyzed_students.append(student_analysis)
            except Exception as e:
                print(f"Error analyzing student {student_name}: {e}")
                continue
        
        # Sort by risk score (highest risk first)
        analyzed_students.sort(key=lambda x: x.get('riskScore', 0), reverse=True)
        
        return analyzed_students
    
    def _analyze_single_student(
        self,
        student_name: str,
        attendance_data: List[Dict],
        marks_data: List[Dict],
        fees_data: List[Dict]
    ) -> Optional[Dict[str, Any]]:
        """Analyze risk for a single student"""
        
        # Get student-specific data
        student_attendance = [r for r in attendance_data if r.get('student_name') == student_name]
        student_marks = [r for r in marks_data if r.get('student_name') == student_name]
        student_fees = [r for r in fees_data if r.get('student_name') == student_name]
        
        # Calculate metrics
        attendance_metrics = self._calculate_attendance_metrics(student_attendance)
        performance_metrics = self._calculate_performance_metrics(student_marks)
        fees_metrics = self._calculate_fees_metrics(student_fees)
        
        # Determine risk levels for each factor
        attendance_risk = self._get_attendance_risk_level(attendance_metrics['percentage'])
        performance_risk = self._get_performance_risk_level(performance_metrics['average'])
        fees_risk = self._get_fees_risk_level(fees_metrics['overdue_months'])
        
        # Calculate combined risk score (0-100)
        risk_score = self._calculate_combined_risk_score(
            attendance_metrics['percentage'],
            performance_metrics['average'],
            fees_metrics['overdue_months']
        )
        
        # Determine overall risk level
        overall_risk = self._get_overall_risk_level(risk_score)
        
        # Get class information (from any available record)
        class_info = self._get_student_class(student_name, attendance_data + marks_data + fees_data)
        
        return {
            "id": hash(student_name) % 10000,  # Generate simple ID
            "name": student_name,
            "class": class_info.get("class", "Unknown"),
            "department": class_info.get("department", "General"),
            "attendance": round(attendance_metrics['percentage'], 1),
            "score": round(performance_metrics['average'], 1),
            "feeStatus": fees_metrics['status'],
            "riskScore": round(risk_score, 1),
            "riskLevel": overall_risk,
            "lastUpdated": datetime.now().strftime("%Y-%m-%d"),
            "riskFactors": {
                "attendance": {
                    "value": attendance_metrics['percentage'],
                    "risk_level": attendance_risk,
                    "details": attendance_metrics
                },
                "performance": {
                    "value": performance_metrics['average'],
                    "risk_level": performance_risk,
                    "details": performance_metrics
                },
                "fees": {
                    "overdue_months": fees_metrics['overdue_months'],
                    "risk_level": fees_risk,
                    "details": fees_metrics
                }
            },
            "recommendations": self._generate_student_recommendations(
                overall_risk, attendance_risk, performance_risk, fees_risk
            )
        }
    
    def _get_unique_students(self, *data_sources) -> List[str]:
        """Extract unique student names from all data sources"""
        students = set()
        for data_source in data_sources:
            for record in data_source:
                if record.get('student_name'):
                    students.add(record['student_name'])
        return list(students)
    
    def _calculate_attendance_metrics(self, attendance_records: List[Dict]) -> Dict[str, Any]:
        """Calculate attendance-related metrics"""
        if not attendance_records:
            return {
                "percentage": 0,
                "total_days": 0,
                "present_days": 0,
                "absent_days": 0
            }
        
        total_days = len(attendance_records)
        present_days = sum(1 for r in attendance_records if r.get('is_present', False))
        absent_days = total_days - present_days
        
        percentage = (present_days / total_days * 100) if total_days > 0 else 0
        
        return {
            "percentage": percentage,
            "total_days": total_days,
            "present_days": present_days,
            "absent_days": absent_days
        }
    
    def _calculate_performance_metrics(self, marks_records: List[Dict]) -> Dict[str, Any]:
        """Calculate academic performance metrics"""
        if not marks_records:
            return {
                "average": 0,
                "total_tests": 0,
                "subjects": [],
                "marks_list": []
            }
        
        marks_list = []
        subjects = set()
        
        for record in marks_records:
            marks = record.get('marks', 0)
            if marks > 0:  # Only consider valid marks
                marks_list.append(marks)
            
            subject = record.get('subject', '')
            if subject:
                subjects.add(subject)
        
        average = statistics.mean(marks_list) if marks_list else 0
        
        return {
            "average": average,
            "total_tests": len(marks_list),
            "subjects": list(subjects),
            "marks_list": marks_list
        }
    
    def _calculate_fees_metrics(self, fees_records: List[Dict]) -> Dict[str, Any]:
        """Calculate fees-related metrics"""
        if not fees_records:
            return {
                "status": "Unknown",
                "overdue_months": 0,
                "total_amount": 0,
                "paid_amount": 0
            }
        
        total_amount = sum(r.get('amount', 0) for r in fees_records)
        paid_amount = sum(r.get('amount', 0) for r in fees_records if r.get('is_paid', False))
        
        overdue_count = sum(1 for r in fees_records if not r.get('is_paid', False))
        
        # Determine overall fee status
        if overdue_count == 0:
            status = "Paid"
        elif overdue_count >= len(fees_records):
            status = "Overdue"
        else:
            status = "Partial"
        
        return {
            "status": status,
            "overdue_months": overdue_count,
            "total_amount": total_amount,
            "paid_amount": paid_amount
        }
    
    def _get_attendance_risk_level(self, attendance_percentage: float) -> str:
        """Determine risk level based on attendance"""
        if attendance_percentage < self.risk_thresholds["attendance"]["high_risk"]:
            return "high"
        elif attendance_percentage < self.risk_thresholds["attendance"]["medium_risk"]:
            return "medium"
        else:
            return "low"
    
    def _get_performance_risk_level(self, average_marks: float) -> str:
        """Determine risk level based on performance"""
        if average_marks < self.risk_thresholds["performance"]["high_risk"]:
            return "high"
        elif average_marks < self.risk_thresholds["performance"]["medium_risk"]:
            return "medium"
        else:
            return "low"
    
    def _get_fees_risk_level(self, overdue_months: int) -> str:
        """Determine risk level based on fees"""
        if overdue_months >= self.risk_thresholds["fees"]["high_risk"]:
            return "high"
        elif overdue_months >= self.risk_thresholds["fees"]["medium_risk"]:
            return "medium"
        else:
            return "low"
    
    def _calculate_combined_risk_score(
        self, 
        attendance_percentage: float, 
        performance_average: float, 
        overdue_months: int
    ) -> float:
        """Calculate weighted risk score (0-100, higher = more risk)"""
        
        # Convert metrics to risk scores (0-100, where 100 is highest risk)
        attendance_risk_score = max(0, 100 - attendance_percentage)
        performance_risk_score = max(0, 100 - performance_average)
        fees_risk_score = min(100, overdue_months * 30)  # 30 points per overdue month
        
        # Calculate weighted average
        combined_score = (
            attendance_risk_score * self.risk_weights["attendance"] +
            performance_risk_score * self.risk_weights["performance"] +
            fees_risk_score * self.risk_weights["fees"]
        )
        
        return min(100, max(0, combined_score))
    
    def _get_overall_risk_level(self, risk_score: float) -> str:
        """Determine overall risk level from combined score"""
        if risk_score >= 70:
            return "high"
        elif risk_score >= 40:
            return "medium"
        else:
            return "low"
    
    def _get_student_class(self, student_name: str, all_records: List[Dict]) -> Dict[str, str]:
        """Get class and department information for student"""
        for record in all_records:
            if record.get('student_name') == student_name:
                class_info = record.get('class', '')
                if class_info:
                    # Extract department from class (simple heuristic)
                    department = "Science" if any(x in class_info.lower() for x in ['sci', 'pcm', 'pcb']) else \
                                "Commerce" if any(x in class_info.lower() for x in ['com', 'commerce']) else \
                                "Arts" if any(x in class_info.lower() for x in ['arts', 'humanities']) else "General"
                    
                    return {"class": class_info, "department": department}
        
        return {"class": "Unknown", "department": "General"}
    
    def _generate_student_recommendations(
        self, 
        overall_risk: str, 
        attendance_risk: str, 
        performance_risk: str, 
        fees_risk: str
    ) -> List[str]:
        """Generate specific recommendations based on risk factors"""
        recommendations = []
        
        if overall_risk == "high":
            recommendations.append("🚨 Immediate intervention required")
        
        if attendance_risk in ["high", "medium"]:
            recommendations.append("📅 Improve attendance - schedule parent meeting")
            recommendations.append("🏥 Check for health or transport issues")
        
        if performance_risk in ["high", "medium"]:
            recommendations.append("📚 Provide additional academic support")
            recommendations.append("👨‍🏫 Consider tutoring or mentorship program")
        
        if fees_risk in ["high", "medium"]:
            recommendations.append("💰 Follow up on fee payments")
            recommendations.append("🤝 Discuss payment plan options")
        
        if overall_risk == "low":
            recommendations.append("✅ Continue current support strategies")
        
        return recommendations
    
    def generate_risk_alert(self, student_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Generate alert information for high-risk students"""
        if student_data.get('riskLevel') != 'high':
            return None
        
        risk_factors = student_data.get('riskFactors', {})
        alerts = []
        
        # Check each risk factor
        if risk_factors.get('attendance', {}).get('risk_level') == 'high':
            alerts.append(f"Critical attendance issue: {student_data.get('attendance', 0):.1f}%")
        
        if risk_factors.get('performance', {}).get('risk_level') == 'high':
            alerts.append(f"Poor academic performance: {student_data.get('score', 0):.1f}%")
        
        if risk_factors.get('fees', {}).get('risk_level') == 'high':
            overdue = risk_factors.get('fees', {}).get('overdue_months', 0)
            alerts.append(f"Fees overdue: {overdue} months")
        
        return {
            "student_id": str(student_data.get('id')),
            "student_name": student_data.get('name'),
            "risk_score": student_data.get('riskScore'),
            "alert_type": "high_risk_dropout",
            "alerts": alerts,
            "recommendations": student_data.get('recommendations', []),
            "timestamp": datetime.now().isoformat(),
            "priority": "high"
        }
    
    def get_student_details(
        self,
        student_id: str,
        attendance_data: List[Dict],
        marks_data: List[Dict],
        fees_data: List[Dict]
    ) -> Optional[Dict[str, Any]]:
        """Get detailed information for a specific student"""
        # Find student by ID (simple hash-based lookup)
        for student_name in self._get_unique_students(attendance_data, marks_data, fees_data):
            if str(hash(student_name) % 10000) == student_id:
                return {
                    "name": student_name,
                    "attendance_records": [r for r in attendance_data if r.get('student_name') == student_name],
                    "marks_records": [r for r in marks_data if r.get('student_name') == student_name],
                    "fees_records": [r for r in fees_data if r.get('student_name') == student_name]
                }
        
        return None
    
    def analyze_student_detailed(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform detailed risk analysis for a specific student"""
        attendance_records = student_data.get('attendance_records', [])
        marks_records = student_data.get('marks_records', [])
        fees_records = student_data.get('fees_records', [])
        
        return {
            "attendance_analysis": self._calculate_attendance_metrics(attendance_records),
            "performance_analysis": self._calculate_performance_metrics(marks_records),
            "fees_analysis": self._calculate_fees_metrics(fees_records),
            "risk_timeline": self._generate_risk_timeline(attendance_records, marks_records),
            "intervention_suggestions": self._generate_intervention_suggestions(
                attendance_records, marks_records, fees_records
            )
        }
    
    def _generate_risk_timeline(self, attendance_records: List[Dict], marks_records: List[Dict]) -> List[Dict]:
        """Generate timeline of risk indicators"""
        timeline = []
        
        # Add attendance events
        for record in attendance_records[-10:]:  # Last 10 attendance records
            if not record.get('is_present', False):
                timeline.append({
                    "date": record.get('date', ''),
                    "type": "attendance",
                    "event": "Absent",
                    "impact": "negative"
                })
        
        # Add performance events
        for record in marks_records[-5:]:  # Last 5 test results
            marks = record.get('marks', 0)
            if marks < 40:
                timeline.append({
                    "date": record.get('test', ''),
                    "type": "performance",
                    "event": f"Low score: {marks}% in {record.get('subject', 'Unknown')}",
                    "impact": "negative"
                })
        
        # Sort by date if possible
        return timeline
    
    def _generate_intervention_suggestions(
        self, 
        attendance_records: List[Dict], 
        marks_records: List[Dict], 
        fees_records: List[Dict]
    ) -> List[Dict[str, str]]:
        """Generate specific intervention suggestions"""
        suggestions = []
        
        # Attendance-based suggestions
        if attendance_records:
            attendance_pct = self._calculate_attendance_metrics(attendance_records)['percentage']
            if attendance_pct < 60:
                suggestions.append({
                    "category": "Attendance",
                    "action": "Immediate parent conference required",
                    "priority": "high"
                })
                suggestions.append({
                    "category": "Attendance", 
                    "action": "Investigate barriers to attendance (transport, health, etc.)",
                    "priority": "high"
                })
        
        # Performance-based suggestions
        if marks_records:
            avg_marks = self._calculate_performance_metrics(marks_records)['average']
            if avg_marks < 40:
                suggestions.append({
                    "category": "Academic",
                    "action": "Enroll in remedial classes",
                    "priority": "high"
                })
                suggestions.append({
                    "category": "Academic",
                    "action": "Assign peer tutoring or mentorship",
                    "priority": "medium"
                })
        
        # Fees-based suggestions
        if fees_records:
            overdue = self._calculate_fees_metrics(fees_records)['overdue_months']
            if overdue >= 2:
                suggestions.append({
                    "category": "Financial",
                    "action": "Explore scholarship or financial aid options",
                    "priority": "high"
                })
        
        return suggestions