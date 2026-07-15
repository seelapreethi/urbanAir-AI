from fastapi import APIRouter, Query, Body
from typing import List, Dict, Any
from app.services.report_service import ReportService

router = APIRouter()

# Log of previously compiled reports
MOCK_REPORTS_LOG = [
    {"report_id": "rep-101", "title": "Vijayawada Weekly Compliance digest", "report_type": "Weekly Report", "file_format": "PDF", "created_at": "2026-07-02T14:30:00Z"},
    {"report_id": "rep-102", "title": "Delhi Severe Particulate Audit Summary", "report_type": "Executive Summary", "file_format": "PDF", "created_at": "2026-07-03T09:15:00Z"}
]

@router.get("", tags=["reports"])
def get_reports_log():
    return MOCK_REPORTS_LOG

@router.get("/templates", tags=["reports"])
def get_reports_templates():
    return ReportService.get_templates()

@router.post("/generate", tags=["reports"])
async def generate_custom_report(
    title: str = Body(..., embed=True),
    report_type: str = Body(..., embed=True),
    file_format: str = Body("PDF", embed=True),
    city: str = Body("Delhi", embed=True),
    modules: List[str] = Body([], embed=True)
):
    res = await ReportService.generate_report(title, report_type, file_format, city, modules)
    
    # Append to mock log locally for visual history persistence
    MOCK_REPORTS_LOG.insert(0, {
        "report_id": res["report_id"],
        "title": res["title"],
        "report_type": res["report_type"],
        "file_format": res["file_format"],
        "created_at": res["created_at"]
    })
    
    return {
        "status": "Success",
        "report_details": res
    }
