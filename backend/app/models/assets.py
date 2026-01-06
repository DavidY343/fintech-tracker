from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class AssetType(Base):
    __tablename__ = "asset_types"

    asset_type_id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)

    assets = relationship("Asset", back_populates="asset_type")


class Asset(Base):
    __tablename__ = "assets"

    asset_id: Mapped[int] = mapped_column(primary_key=True)
    ticker: Mapped[str | None] = mapped_column(String(50))
    name: Mapped[str] = mapped_column(String(255))
    currency: Mapped[str] = mapped_column(String(3))
    is_active: Mapped[bool] = mapped_column(default=True)

    asset_type_id: Mapped[int] = mapped_column(
        ForeignKey("asset_types.asset_type_id")
    )

    asset_type = relationship("AssetType", back_populates="assets")
