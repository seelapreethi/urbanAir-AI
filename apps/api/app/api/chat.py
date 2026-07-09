from fastapi import APIRouter, Query, Body
from typing import List, Dict, Any
from app.services.chat_service import ChatService

router = APIRouter()

# Mock conversation history
MOCK_HISTORY: List[Dict[str, Any]] = [
    {
        "conversation_id": "c1",
        "title": "Benz Circle Air Stagnation Audit",
        "messages": [
            {"sender_role": "user", "content": "Why is AQI high in Benz Circle?"},
            {"sender_role": "assistant", "content": "Traffic exhaust contributes 42% and stagnation wind speed is low (8 km/h)."}
        ]
    },
    {
        "conversation_id": "c2",
        "title": "72h forecast inspection",
        "messages": [
            {"sender_role": "user", "content": "What will AQI be on Monday?"},
            {"sender_role": "assistant", "content": "Projected to be 158 (High Risk) due to humidity shifts."}
        ]
    }
]

@router.get("/history", tags=["chat"])
def get_chat_history():
    return MOCK_HISTORY

@router.get("/suggestions", tags=["chat"])
def get_chat_suggestions():
    return ChatService.get_suggestions()

@router.post("/message", tags=["chat"])
def post_chat_message(
    message: str = Body(..., embed=True),
    conversation_id: str = Body(None, embed=True)
):
    # Retrieve matching history context if active
    history_messages = []
    if conversation_id:
        matched = [c for c in MOCK_HISTORY if c["conversation_id"] == conversation_id]
        if matched:
            history_messages = matched[0]["messages"]
            
    # Generate structured prompt response
    response = ChatService.generate_response(message, history_messages)
    return {
        "message_received": message,
        "conversation_id": conversation_id or "new-session-id",
        "response": response
    }
