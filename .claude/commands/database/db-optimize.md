# /db-optimize [query]

Optimize database operations.

## Description
Analyzes and optimizes database queries for performance, suggesting indexes, query refactoring, and caching strategies.

## Usage
```
/db-optimize SELECT * FROM orders WHERE user_id = ? AND status = ?
/db-optimize complex-join-query.sql
/db-optimize slow-aggregation-query
```

## Output Includes
- Query execution plan analysis
- Index recommendations
- Query refactoring suggestions
- Caching strategy
- Materialized view options
- Partitioning recommendations
- Performance benchmarks
