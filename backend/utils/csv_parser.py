"""
CSV Parser Utility - Handles file validation and data processing
Supports CSV and Excel file parsing for attendance, marks, and fees data
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional
import re
from datetime import datetime


class CSVParser:
    """Utility class for parsing and validating student data files"""
    
    def __init__(self):
        # Define expected column patterns for different data types
        self.column_patterns = {
            "attendance": {
                "student": ["student", "name", "student_name", "studentname"],
                "class": ["class", "grade", "section", "standard"],
                "date": ["date", "attendance_date", "day"],
                "status": ["status", "present", "absent", "attendance"]
            },
            "marks": {
                "student": ["student", "name", "student_name", "studentname"],
                "subject": ["subject", "course", "paper"],
                "test": ["test", "exam", "assessment", "quiz"],
                "marks": ["marks", "score", "grade", "points"]
            },
            "fees": {
                "student": ["student", "name", "student_name", "studentname"],
                "month": ["month", "period", "term"],
                "amount": ["amount", "fee", "fees", "total"],
                "status": ["status", "paid", "pending", "payment_status"]
            }
        }
    
    def detect_data_type(self, filename: str, columns: List[str]) -> str:
        """
        Detect the type of data based on filename and columns
        
        Args:
            filename: Name of the uploaded file
            columns: List of column names from the file
        
        Returns:
            Detected data type (attendance, marks, fees)
        """
        filename_lower = filename.lower()
        columns_lower = [col.lower().strip() for col in columns]
        
        # Check filename for hints
        if any(keyword in filename_lower for keyword in ["attendance", "absent", "present"]):
            return "attendance"
        elif any(keyword in filename_lower for keyword in ["marks", "score", "grade", "exam"]):
            return "marks"
        elif any(keyword in filename_lower for keyword in ["fee", "payment", "dues"]):
            return "fees"
        
        # Check columns for patterns
        for data_type, patterns in self.column_patterns.items():
            matches = 0
            for pattern_type, pattern_list in patterns.items():
                if any(pattern in col for col in columns_lower for pattern in pattern_list):
                    matches += 1
            
            # If we find matches for most pattern types, it's likely this data type
            if matches >= len(patterns) * 0.5:  # At least 50% of patterns match
                return data_type
        
        # Default fallback
        return "attendance"
    
    def process_data(self, df: pd.DataFrame, data_type: str) -> List[Dict[str, Any]]:
        """
        Process and standardize data based on type
        
        Args:
            df: Pandas DataFrame with raw data
            data_type: Type of data (attendance, marks, fees)
        
        Returns:
            List of standardized data dictionaries
        """
        # Clean column names
        df.columns = [col.strip().lower() for col in df.columns]
        
        # Remove empty rows
        df = df.dropna(how='all')
        
        if data_type == "attendance":
            return self._process_attendance_data(df)
        elif data_type == "marks":
            return self._process_marks_data(df)
        elif data_type == "fees":
            return self._process_fees_data(df)
        else:
            raise ValueError(f"Unsupported data type: {data_type}")
    
    def _process_attendance_data(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Process attendance data"""
        processed_data = []
        
        # Find relevant columns
        student_col = self._find_column(df.columns, self.column_patterns["attendance"]["student"])
        class_col = self._find_column(df.columns, self.column_patterns["attendance"]["class"])
        date_col = self._find_column(df.columns, self.column_patterns["attendance"]["date"])
        status_col = self._find_column(df.columns, self.column_patterns["attendance"]["status"])
        
        for _, row in df.iterrows():
            try:
                # Extract and clean data
                student_name = str(row.get(student_col, "")).strip()
                class_name = str(row.get(class_col, "")).strip()
                date_value = str(row.get(date_col, "")).strip() if date_col else ""
                status_value = str(row.get(status_col, "")).strip().lower()
                
                if not student_name or student_name == "nan":
                    continue
                
                # Standardize status
                is_present = status_value in ["present", "p", "1", "yes", "attended"]
                
                record = {
                    "student_name": student_name,
                    "class": class_name,
                    "date": date_value,
                    "status": "Present" if is_present else "Absent",
                    "is_present": is_present,
                    "data_type": "attendance"
                }
                
                processed_data.append(record)
                
            except Exception as e:
                print(f"Error processing attendance row: {e}")
                continue
        
        return processed_data
    
    def _process_marks_data(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Process marks/grades data"""
        processed_data = []
        
        # Find relevant columns
        student_col = self._find_column(df.columns, self.column_patterns["marks"]["student"])
        subject_col = self._find_column(df.columns, self.column_patterns["marks"]["subject"])
        test_col = self._find_column(df.columns, self.column_patterns["marks"]["test"])
        marks_col = self._find_column(df.columns, self.column_patterns["marks"]["marks"])
        
        for _, row in df.iterrows():
            try:
                student_name = str(row.get(student_col, "")).strip()
                subject = str(row.get(subject_col, "")).strip()
                test_name = str(row.get(test_col, "")).strip()
                marks_value = row.get(marks_col, 0)
                
                if not student_name or student_name == "nan":
                    continue
                
                # Convert marks to numeric
                try:
                    marks = float(marks_value) if marks_value and str(marks_value) != "nan" else 0
                except (ValueError, TypeError):
                    marks = 0
                
                record = {
                    "student_name": student_name,
                    "subject": subject,
                    "test": test_name,
                    "marks": marks,
                    "data_type": "marks"
                }
                
                processed_data.append(record)
                
            except Exception as e:
                print(f"Error processing marks row: {e}")
                continue
        
        return processed_data
    
    def _process_fees_data(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        """Process fees/payment data"""
        processed_data = []
        
        # Find relevant columns
        student_col = self._find_column(df.columns, self.column_patterns["fees"]["student"])
        month_col = self._find_column(df.columns, self.column_patterns["fees"]["month"])
        amount_col = self._find_column(df.columns, self.column_patterns["fees"]["amount"])
        status_col = self._find_column(df.columns, self.column_patterns["fees"]["status"])
        
        for _, row in df.iterrows():
            try:
                student_name = str(row.get(student_col, "")).strip()
                month = str(row.get(month_col, "")).strip()
                amount_value = row.get(amount_col, 0)
                status_value = str(row.get(status_col, "")).strip().lower()
                
                if not student_name or student_name == "nan":
                    continue
                
                # Convert amount to numeric
                try:
                    amount = float(amount_value) if amount_value and str(amount_value) != "nan" else 0
                except (ValueError, TypeError):
                    amount = 0
                
                # Standardize status
                is_paid = status_value in ["paid", "p", "complete", "cleared", "yes"]
                fee_status = "Paid" if is_paid else "Overdue" if status_value in ["overdue", "pending", "due"] else "Partial"
                
                record = {
                    "student_name": student_name,
                    "month": month,
                    "amount": amount,
                    "status": fee_status,
                    "is_paid": is_paid,
                    "data_type": "fees"
                }
                
                processed_data.append(record)
                
            except Exception as e:
                print(f"Error processing fees row: {e}")
                continue
        
        return processed_data
    
    def _find_column(self, columns: List[str], patterns: List[str]) -> Optional[str]:
        """
        Find column name that matches given patterns
        
        Args:
            columns: List of available column names
            patterns: List of patterns to match
        
        Returns:
            Matching column name or None
        """
        for col in columns:
            for pattern in patterns:
                if pattern in col.lower():
                    return col
        return columns[0] if columns else None


def validate_file_format(filename: str) -> bool:
    """
    Validate if the file format is supported
    
    Args:
        filename: Name of the uploaded file
    
    Returns:
        True if format is supported, False otherwise
    """
    if not filename:
        return False
    
    supported_extensions = ['.csv', '.xlsx', '.xls']
    return any(filename.lower().endswith(ext) for ext in supported_extensions)


def get_sample_data_format(data_type: str) -> Dict[str, Any]:
    """
    Get sample data format for each data type
    
    Args:
        data_type: Type of data (attendance, marks, fees)
    
    Returns:
        Sample data structure
    """
    samples = {
        "attendance": {
            "required_columns": ["student_name", "class", "date", "status"],
            "sample_rows": [
                {"student_name": "Priya Sharma", "class": "10A", "date": "2024-01-15", "status": "Present"},
                {"student_name": "Raj Kumar", "class": "12B", "date": "2024-01-15", "status": "Absent"}
            ]
        },
        "marks": {
            "required_columns": ["student_name", "subject", "test", "marks"],
            "sample_rows": [
                {"student_name": "Priya Sharma", "subject": "Math", "test": "Test1", "marks": 85},
                {"student_name": "Raj Kumar", "subject": "Science", "test": "Test1", "marks": 72}
            ]
        },
        "fees": {
            "required_columns": ["student_name", "month", "amount", "status"],
            "sample_rows": [
                {"student_name": "Priya Sharma", "month": "Jan2024", "amount": 5000, "status": "Paid"},
                {"student_name": "Raj Kumar", "month": "Jan2024", "amount": 5000, "status": "Overdue"}
            ]
        }
    }
    
    return samples.get(data_type, samples["attendance"])