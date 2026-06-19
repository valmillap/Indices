import pyodbc
import pandas as pd

CONSULTA_ATRIBUTOS = """
    SELECT 
        t.name                                          AS Tabla,
        i.name                                          AS Indice,
        i.type_desc                                     AS Tipo,
        i.is_primary_key                                AS EsPK,
        i.is_unique                                     AS EsUnique,
        i.is_disabled                                   AS EstaDeshabilitado,
        i.ignore_dup_key                                AS IgnoraDuplicados,
        ic.key_ordinal                                  AS OrdenColumna,
        c.name                                          AS Columna,
        ic.is_descending_key                            AS EsDescendente,
        ic.is_included_column                           AS EsIncluida,
        ic.partition_ordinal                            AS OrdenParticion,
        ic.column_store_order_ordinal                   AS ColStoreOrder  -- NULL si no aplica
    FROM sys.indexes i
    INNER JOIN sys.tables t 
        ON i.object_id = t.object_id
    INNER JOIN sys.index_columns ic 
        ON i.object_id = ic.object_id 
        AND i.index_id = ic.index_id
    INNER JOIN sys.columns c 
        ON ic.object_id = c.object_id 
        AND ic.column_id = c.column_id

"""

CONSULTA_USO_TAMAÑO = """
    SELECT
        t.name                                  AS Tabla,
        i.name                                  AS Indice,
        i.type_desc                             AS TypeDesc,
        i.is_primary_key                        AS EsPK,
        i.is_unique                             AS EsUnique,
        u.user_seeks,
        u.user_scans,
        u.user_lookups,
        u.user_updates,
        u.last_user_seek,
        u.last_user_scan,

        -- Tamaño
        SUM(a.total_pages) * 8 / 1024.0        AS TamanoTotal_MB,
        SUM(a.used_pages)  * 8 / 1024.0        AS UsedPages_MB,
        SUM(a.data_pages)  * 8 / 1024.0        AS DataPages_MB

    FROM sys.indexes i
    INNER JOIN sys.tables t
        ON t.object_id      = i.object_id
    INNER JOIN sys.partitions p
        ON p.object_id      = i.object_id
        AND p.index_id      = i.index_id
    INNER JOIN sys.allocation_units a
        ON a.container_id   = p.partition_id
    LEFT JOIN sys.dm_db_index_usage_stats u
        ON u.object_id      = i.object_id
        AND u.index_id      = i.index_id
        AND u.database_id   = DB_ID()

    WHERE t.is_ms_shipped = 0

    GROUP BY
        t.name, i.name, i.type_desc,
        i.is_primary_key, i.is_unique,
        u.user_seeks, u.user_scans, u.user_lookups, u.user_updates,
        u.last_user_seek, u.last_user_scan

    ORDER BY t.name, i.name;


"""

CONSULTA_FRAGMENTACION = """
    SELECT 
        s.name                                          AS Esquema,
        t.name                                          AS Tabla,
        i.name                                          AS Indice,
        i.type_desc                                     AS Tipo,
        i.is_primary_key                                AS EsPK,
        i.is_unique                                     AS EsUnique,
        ips.page_count                                  AS Pages,
        ips.avg_fragmentation_in_percent                AS Fragmentacion,
        ips.avg_page_space_used_in_percent              AS PageFullness
    FROM sys.indexes i
    INNER JOIN sys.tables t 
        ON i.object_id = t.object_id
    INNER JOIN sys.schemas s 
        ON t.schema_id = s.schema_id
    INNER JOIN sys.dm_db_index_physical_stats(
        DB_ID(), NULL, NULL, NULL, 'SAMPLED'
    ) ips 
        ON ips.object_id = i.object_id 
        AND ips.index_id = i.index_id
    WHERE i.name IS NOT NULL
    ORDER BY s.name, t.name, i.name;

"""