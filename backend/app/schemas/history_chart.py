from pydantic import BaseModel
from datetime import date
from decimal import Decimal
from typing import List

class PortfolioPoint(BaseModel):
    day: date
    total_value: Decimal

    class Config:
        from_attributes = True

class PortfolioHistoryResponse(BaseModel):
    history: List[PortfolioPoint]