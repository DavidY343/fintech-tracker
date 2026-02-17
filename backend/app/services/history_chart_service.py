from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

async def get_portfolio_growth(db: AsyncSession, user_id: int):
    query = text("""
    WITH RECURSIVE calendar AS (
        SELECT min(date_trunc('day', date))::date as day
        FROM operations o
        JOIN accounts a ON o.account_id = a.account_id
        WHERE a.user_id = :user_id
        UNION ALL
        SELECT (day + interval '1 day')::date
        FROM calendar
        WHERE day < now()::date
    ),
    daily_balances AS (
        SELECT 
            date_trunc('day', o.date)::date as day,
            o.asset_id,
            SUM(SUM(CASE WHEN o.operation_type = 'buy' THEN o.quantity ELSE -o.quantity END)) 
                OVER (PARTITION BY o.asset_id ORDER BY date_trunc('day', o.date)) as qty
        FROM operations o
        JOIN accounts a ON o.account_id = a.account_id
        WHERE a.user_id = :user_id
        GROUP BY date_trunc('day', o.date), o.asset_id
    ),
    asset_prices AS (
        -- Obtenemos el precio por día, si no hay, será NULL
        SELECT 
            c.day,
            al.asset_id,
            ph.price
        FROM calendar c
        CROSS JOIN (
            SELECT DISTINCT asset_id 
            FROM operations o 
            JOIN accounts a ON o.account_id = a.account_id 
            WHERE a.user_id = :user_id
        ) al
        LEFT JOIN price_history ph ON ph.asset_id = al.asset_id 
            AND date_trunc('day', ph.date)::date = c.day
    ),
    filled_data AS (
        SELECT 
            ap.day,
            ap.asset_id,
            -- Usamos LAST_VALUE para rellenar los precios nulos con el anterior
            -- Ignorando nulos para hacer el forward-fill
            (array_remove(array_agg(ap.price) OVER (PARTITION BY ap.asset_id ORDER BY ap.day), NULL))[array_upper(array_remove(array_agg(ap.price) OVER (PARTITION BY ap.asset_id ORDER BY ap.day), NULL), 1)] as last_price,
            -- Obtenemos la última cantidad conocida hasta ese día
            (array_remove(array_agg(db.qty) OVER (PARTITION BY ap.asset_id ORDER BY ap.day), NULL))[array_upper(array_remove(array_agg(db.qty) OVER (PARTITION BY ap.asset_id ORDER BY ap.day), NULL), 1)] as last_qty
        FROM asset_prices ap
        LEFT JOIN daily_balances db ON db.day = ap.day AND db.asset_id = ap.asset_id
    )
    SELECT 
        day,
        SUM(COALESCE(last_qty, 0) * COALESCE(last_price, 0)) as total_value
    FROM filled_data
    GROUP BY day
    ORDER BY day;
    """)

    result = await db.execute(query, {"user_id": user_id})
    return result.all()