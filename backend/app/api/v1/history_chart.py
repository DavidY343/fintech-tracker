from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_current_user_id, get_db
from app.services.history_chart_service import get_portfolio_growth 
from app.schemas.history_chart import PortfolioHistoryResponse

router = APIRouter()

@router.get("/growth", response_model=PortfolioHistoryResponse)
async def get_user_portfolio_growth(user_id: int = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):

    stats = await get_portfolio_growth(db, user_id)

    # Convertimos explícitamente a diccionarios
    history_list = [{"day": row.day, "total_value": row.total_value} for row in stats]
    return {"history": history_list}