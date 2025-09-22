"""
Data Ingestion Router - Handles file uploads and data processing
Supports CSV and Excel files for attendance, marks, and fees data
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
from typing import List, Dict, Any, Optional
import pandas as pd
import io
import json
from datetime import datetime

from utils.csv_parser import CSVParser, validate_file_format

router = APIRouter()

# In-memory storage for demo purposes (replace with database in production)
uploaded_data = {
    "attendance": [],
    "marks": [],
    "fees": []
}

processing_status = {
    "last_upload": None,
    "total_files": 0,
    "processed_files": 0,
    "errors": []
}


@router.post("/upload-data")
async def upload_data(
    files: List[UploadFile] = File(...),
    data_type: Optional[str] = Form(None)
) -> Dict[str, Any]:
    """
    Upload CSV/Excel files for student data processing
    
    Args:
        files: List of uploaded files (CSV/Excel)
        data_type: Optional data type hint (attendance, marks, fees)
    
    Returns:
        Upload status and processing results
    """
    try:
        results = []
        parser = CSVParser()
        
        processing_status["total_files"] = len(files)
        processing_status["processed_files"] = 0
        processing_status["errors"] = []
        processing_status["last_upload"] = datetime.now().isoformat()
        
        for file in files:
            try:
                # Validate file format
                if not validate_file_format(file.filename):
                    raise HTTPException(
                        status_code=400,
                        detail=f"Unsupported file format: {file.filename}. Only CSV and Excel files are supported."
                    )
                
                # Read file content
                content = await file.read()
                
                # Parse based on file extension
                if file.filename.lower().endswith('.csv'):
                    df = pd.read_csv(io.StringIO(content.decode('utf-8')))
                else:  # Excel files
                    df = pd.read_excel(io.BytesIO(content))
                
                # Detect data type if not provided
                detected_type = data_type or parser.detect_data_type(file.filename, df.columns.tolist())
                
                # Validate and process data
                processed_data = parser.process_data(df, detected_type)
                
                # Store processed data
                uploaded_data[detected_type].extend(processed_data)
                
                results.append({
                    "filename": file.filename,
                    "type": detected_type,
                    "status": "success",
                    "records_count": len(processed_data),
                    "columns": list(df.columns),
                    "sample_data": processed_data[:3] if processed_data else []  # First 3 records as sample
                })
                
                processing_status["processed_files"] += 1
                
            except Exception as e:
                error_msg = f"Error processing {file.filename}: {str(e)}"
                processing_status["errors"].append(error_msg)
                results.append({
                    "filename": file.filename,
                    "status": "error",
                    "error": str(e)
                })
        
        return {
            "success": True,
            "message": f"Processed {processing_status['processed_files']} out of {processing_status['total_files']} files",
            "results": results,
            "summary": {
                "total_attendance_records": len(uploaded_data["attendance"]),
                "total_marks_records": len(uploaded_data["marks"]),
                "total_fees_records": len(uploaded_data["fees"])
            },
            "processing_status": processing_status
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload processing failed: {str(e)}")


@router.get("/upload-status")
async def get_upload_status() -> Dict[str, Any]:
    """Get current upload and processing status"""
    return {
        "status": processing_status,
        "data_summary": {
            "attendance": {
                "count": len(uploaded_data["attendance"]),
                "sample": uploaded_data["attendance"][:2] if uploaded_data["attendance"] else []
            },
            "marks": {
                "count": len(uploaded_data["marks"]),
                "sample": uploaded_data["marks"][:2] if uploaded_data["marks"] else []
            },
            "fees": {
                "count": len(uploaded_data["fees"]),
                "sample": uploaded_data["fees"][:2] if uploaded_data["fees"] else []
            }
        }
    }


@router.get("/data-preview/{data_type}")
async def get_data_preview(data_type: str, limit: int = 10) -> Dict[str, Any]:
    """
    Get preview of uploaded data by type
    
    Args:
        data_type: Type of data (attendance, marks, fees)
        limit: Number of records to return
    """
    if data_type not in uploaded_data:
        raise HTTPException(status_code=400, detail="Invalid data type")
    
    data = uploaded_data[data_type]
    
    return {
        "data_type": data_type,
        "total_records": len(data),
        "preview": data[:limit],
        "columns": list(data[0].keys()) if data else []
    }


@router.delete("/clear-data")
async def clear_uploaded_data() -> Dict[str, str]:
    """Clear all uploaded data (for testing purposes)"""
    global uploaded_data, processing_status
    
    uploaded_data = {
        "attendance": [],
        "marks": [],
        "fees": []
    }
    
    processing_status = {
        "last_upload": None,
        "total_files": 0,
        "processed_files": 0,
        "errors": []
    }
    
    return {"message": "All uploaded data cleared successfully"}