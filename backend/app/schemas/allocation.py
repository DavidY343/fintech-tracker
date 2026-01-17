from pydantic import BaseModel
from typing import Optional

class AccountWithBalance(BaseModel):
    account_id: int
    name: str
    type: str
    currency: str
    cash_balance: float
    invested_value: float
    total_value: float
    
class AssetAllocation(BaseModel):
    group_key: str
    total_value: float
    allocation_pct: float
    asset_count: int


class AssetTableRow(BaseModel):
    account_id: int
    account_name: str
    asset_id: int
    name: str
    ticker: Optional[str] = None
    isin: Optional[str] = None
    type: str
    theme: str
    quantity: float
    current_price: float
    total_value: float
    invested_value: float
    performance: float

    class Config:
        from_attributes = True