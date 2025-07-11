import 'package:drift/drift.dart';
import '../database.dart';
import '../tables/auth_tokens_table.dart';

part 'auth_tokens_dao.g.dart';

@DriftAccessor(tables: [AuthTokens])
class AuthTokensDao extends DatabaseAccessor<AppDatabase> with _$AuthTokensDaoMixin {
  AuthTokensDao(AppDatabase db) : super(db);

  Future<AuthToken?> getActiveToken() async {
    final query = select(authTokens)
      ..where((tbl) => tbl.expiresAt.isBiggerThan(DateTime.now()))
      ..orderBy([(tbl) => OrderingTerm.desc(tbl.createdAt)])
      ..limit(1);
    
    final result = await query.getSingleOrNull();
    return result;
  }

  Future<AuthToken> saveToken({
    required String userId,
    required String accessToken,
    required String refreshToken,
    required DateTime expiresAt,
  }) async {
    // Delete existing tokens for the user
    await (delete(authTokens)..where((tbl) => tbl.userId.equals(userId))).go();
    
    // Insert new token
    final token = await into(authTokens).insertReturning(
      AuthTokensCompanion(
        userId: Value(userId),
        accessToken: Value(accessToken),
        refreshToken: Value(refreshToken),
        expiresAt: Value(expiresAt),
      ),
    );
    
    return token;
  }

  Future<void> deleteToken(String userId) async {
    await (delete(authTokens)..where((tbl) => tbl.userId.equals(userId))).go();
  }

  Future<void> deleteAllTokens() async {
    await delete(authTokens).go();
  }

  Future<AuthToken?> getTokenByUserId(String userId) async {
    final query = select(authTokens)
      ..where((tbl) => tbl.userId.equals(userId))
      ..orderBy([(tbl) => OrderingTerm.desc(tbl.createdAt)])
      ..limit(1);
    
    return await query.getSingleOrNull();
  }

  Future<void> updateToken({
    required String userId,
    required String accessToken,
    required String refreshToken,
    required DateTime expiresAt,
  }) async {
    await (update(authTokens)..where((tbl) => tbl.userId.equals(userId)))
        .write(
      AuthTokensCompanion(
        accessToken: Value(accessToken),
        refreshToken: Value(refreshToken),
        expiresAt: Value(expiresAt),
        updatedAt: Value(DateTime.now()),
      ),
    );
  }
}