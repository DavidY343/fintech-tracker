from pydantic import BaseModel


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