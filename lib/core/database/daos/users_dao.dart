import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/users_table.dart';

part 'users_dao.g.dart';

@DriftAccessor(tables: [Users])
class UsersDao extends DatabaseAccessor<AppDatabase> with _$UsersDaoMixin {
  UsersDao(AppDatabase db) : super(db);

  // Get current user
  Future<User?> getCurrentUser() async {
    return (select(users)..limit(1)).getSingleOrNull();
  }

  // Get user by external ID
  Future<User?> getUserByExternalId(String externalId) async {
    return (select(users)..where((u) => u.externalId.equals(externalId)))
        .getSingleOrNull();
  }

  // Insert or update user
  Future<int> upsertUser(UsersCompanion user) async {
    return into(users).insertOnConflictUpdate(user);
  }

  // Update last login
  Future<bool> updateLastLogin(String externalId) async {
    return (update(users)..where((u) => u.externalId.equals(externalId)))
        .write(UsersCompanion(
      lastLoginAt: Value(DateTime.now()),
      updatedAt: Value(DateTime.now()),
    ));
  }

  // Delete user
  Future<int> deleteUser(String externalId) async {
    return (delete(users)..where((u) => u.externalId.equals(externalId))).go();
  }

  // Clear all users (for logout)
  Future<int> clearAllUsers() async {
    return delete(users).go();
  }
}