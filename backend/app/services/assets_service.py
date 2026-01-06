from sqlalchemy import text

async def get_asset_allocation(db, account_id: int, user_id: int, group_by: str):
    """
    Devuelve la asignación de activos agrupada por:
    - asset (detalle)
    - theme
    - type

    Incluye porcentaje sobre el total.
    """
    if group_by != 'asset' and group_by != 'theme' and group_by != 'type':
        group_by = 'asset'
    query = text("""
        WITH positions AS (
            SELECT
                o.asset_id,
                SUM(
                    CASE
                        WHEN o.operation_type = 'buy' THEN o.quantity
                        ELSE -o.quantity
                    END
                ) AS net_quantity
            FROM operations o
            JOIN accounts ac ON ac.account_id = o.account_id
            WHERE o.account_id = :account_id
                AND ac.user_id = :user_id
            GROUP BY o.asset_id
            HAVING SUM(
                CASE
                    WHEN o.operation_type = 'buy' THEN o.quantity
                    ELSE -o.quantity
                END
            ) > 0
        ),
        latest_prices AS (
            SELECT DISTINCT ON (asset_id)
                asset_id,
                price
            FROM price_history
            ORDER BY asset_id, date DESC
        ),
        valued_positions AS (
            SELECT
                a.asset_id,
                a.name,
                COALESCE(a.theme, 'Unclassified') AS theme,
                a.type,
                p.net_quantity * lp.price AS value
            FROM positions p
            JOIN assets a ON a.asset_id = p.asset_id
            JOIN latest_prices lp ON lp.asset_id = p.asset_id
        )
        SELECT
            CASE
                WHEN :group_by = 'theme' THEN theme
                WHEN :group_by = 'type'  THEN type
                ELSE name
            END AS group_key,

            SUM(value) AS total_value,

            SUM(value)
            / SUM(SUM(value)) OVER ()
            AS allocation_pct,
            COUNT(DISTINCT asset_id) AS asset_count
        FROM valued_positions
        GROUP BY group_key
        ORDER BY total_value DESC;
    """)
    result = await db.execute(query, {"account_id": account_id, "user_id": user_id, "group_by": group_by})
    return result.mappings().all()

async def get_global_asset_allocation(db, user_id: int, group_by: str):
    """
    Devuelve la asignación de activos glboal agrupada por:
    - asset (detalle)
    - theme
    - type

    Incluye porcentaje sobre el total.
    """
    if group_by != 'asset' and group_by != 'theme' and group_by != 'type':
        group_by = 'asset'
    query = text("""
        WITH positions AS (
            SELECT
                o.asset_id,
                SUM(
                    CASE
                        WHEN o.operation_type = 'buy' THEN o.quantity
                        ELSE -o.quantity
                    END
                ) AS net_quantity
            FROM operations o
            JOIN accounts ac ON ac.account_id = o.account_id
            WHERE ac.user_id = :user_id
            GROUP BY o.asset_id
            HAVING SUM(
                CASE
                    WHEN o.operation_type = 'buy' THEN o.quantity
                    ELSE -o.quantity
                END
            ) > 0
        ),
        latest_prices AS (
            SELECT DISTINCT ON (asset_id)
                asset_id,
                price
            FROM price_history
            ORDER BY asset_id, date DESC
        ),
        valued_positions AS (
            SELECT
                a.asset_id,
                a.name,
                COALESCE(a.theme, 'Unclassified') AS theme,
                a.type,
                p.net_quantity * lp.price AS value
            FROM positions p
            JOIN assets a ON a.asset_id = p.asset_id
            JOIN latest_prices lp ON lp.asset_id = p.asset_id
        )
        SELECT
            CASE
                WHEN :group_by = 'theme' THEN theme
                WHEN :group_by = 'type'  THEN type
                ELSE name
            END AS group_key,

            SUM(value) AS total_value,

            SUM(value)
            / SUM(SUM(value)) OVER ()
            AS allocation_pct,
            COUNT(DISTINCT asset_id) AS asset_count
        FROM valued_positions
        GROUP BY group_key
        ORDER BY total_value DESC;
    """)

    if group_by not in {"asset", "theme", "type"}:
        raise ValueError("group_by must be: asset, theme or type")

    result = await db.execute(
        query,
        {"user_id": user_id, "group_by": group_by}
    )
    return result.mappings().all()
