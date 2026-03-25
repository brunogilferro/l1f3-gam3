/**
 * Shared types for PostgreSQL raw query results.
 *
 * WHY rawQuery instead of Lucid ORM?
 * Use rawQuery only when the query requires one or more of:
 * - Role derivation via FK boolean checks  (p."CodigoLider" = ?) AS is_leader
 * - COUNT DISTINCT with GROUP BY
 * - EXISTS subqueries for access checks
 * - Complex OR conditions across multiple joined tables
 *
 * For all other cases, prefer Lucid ORM.
 *
 * PATTERN: db.rawQuery<QueryResult<RowType>>(sql, bindings)
 *
 * Example:
 *   const result = await db.rawQuery<QueryResult<Projects>>(sql, [userId])
 *   result.rows.map(row => ...)
 */
export type QueryResult<T> = { rows: T[] }
