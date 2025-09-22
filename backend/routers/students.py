from fastapi import APIRouter
import pandas as pd
from pathlib import Path

router = APIRouter()
BASE_DIR = Path(__file__).resolve().parent.parent / "data"

# Helper functions
def calculate_attendance(att_df: pd.DataFrame):
    """Calculate attendance % per student"""
    att_summary = att_df.groupby("student_name")["status"].apply(lambda x: (x=="Present").sum() / len(x) * 100)
    return att_summary.to_dict()

def calculate_risk(attendance, score, fee_status):
    risk = 0
    if attendance < 60: risk += 40
    elif attendance < 75: risk += 20
    if score < 50: risk += 30
    elif score < 70: risk += 15
    if str(fee_status).lower() == "overdue": risk += 30
    return min(risk, 100)

def get_risk_level(attendance, score, fee_status):
    risk = calculate_risk(attendance, score, fee_status)
    if risk >= 70: return "high"
    elif risk >= 40: return "medium"
    return "low"


@router.get("/students")
def get_students():
    # Read CSV files
    attendance_df = pd.read_csv(BASE_DIR / "attendance.csv")
    fees_df = pd.read_csv(BASE_DIR / "fees.csv").rename(columns={"status": "feeStatus"})
    marks_df = pd.read_csv(BASE_DIR / "marks.csv").rename(columns={"marks": "score"})

    # Aggregate attendance per student
    attendance_summary = attendance_df.groupby("student_name")["status"].apply(lambda x: (x=="Present").sum()/len(x)*100).reset_index()
    attendance_summary.rename(columns={"status":"attendance"}, inplace=True)

    # Aggregate marks per student (average)
    marks_summary = marks_df.groupby("student_name")["score"].mean().reset_index()

    # Aggregate feeStatus per student - pick the "worst" status
    def worst_fee_status(statuses):
        if "Overdue" in statuses:
            return "Overdue"
        elif "Partial" in statuses:
            return "Partial"
        else:
            return "Paid"

    fees_summary = fees_df.groupby("student_name")["feeStatus"].apply(worst_fee_status).reset_index()

    # Merge all summaries
    students_df = attendance_summary.merge(marks_summary, on="student_name").merge(fees_summary, on="student_name")

    # Get class and department (take the first entry)
    students_df["class"] = students_df["student_name"].apply(lambda n: attendance_df[attendance_df["student_name"]==n]["class"].iloc[0])
    students_df["department"] = "All Subjects"

    # Build JSON
    students = []
    for _, row in students_df.iterrows():
        att = row["attendance"]
        score = row["score"]
        fee_status = row["feeStatus"]
        students.append({
            "id": row["student_name"].replace(" ","_"),
            "name": row["student_name"],
            "class": row["class"],
            "department": row["department"],
            "attendance": int(att),
            "score": int(score),
            "feeStatus": fee_status,
            "riskScore": calculate_risk(att, score, fee_status),
            "riskLevel": get_risk_level(att, score, fee_status),
            "lastUpdated": pd.Timestamp.now().strftime("%Y-%m-%d")
        })

    return {"students": students}
