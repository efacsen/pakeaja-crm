// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_database.dart';

// ignore_for_file: type=lint
class $UsersTable extends Users with TableInfo<$UsersTable, User> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $UsersTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _externalIdMeta =
      const VerificationMeta('externalId');
  @override
  late final GeneratedColumn<String> externalId = GeneratedColumn<String>(
      'external_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _emailMeta = const VerificationMeta('email');
  @override
  late final GeneratedColumn<String> email = GeneratedColumn<String>(
      'email', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
      'name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _phoneMeta = const VerificationMeta('phone');
  @override
  late final GeneratedColumn<String> phone = GeneratedColumn<String>(
      'phone', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _roleMeta = const VerificationMeta('role');
  @override
  late final GeneratedColumn<String> role = GeneratedColumn<String>(
      'role', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _organizationIdMeta =
      const VerificationMeta('organizationId');
  @override
  late final GeneratedColumn<String> organizationId = GeneratedColumn<String>(
      'organization_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _profileImageUrlMeta =
      const VerificationMeta('profileImageUrl');
  @override
  late final GeneratedColumn<String> profileImageUrl = GeneratedColumn<String>(
      'profile_image_url', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _isActiveMeta =
      const VerificationMeta('isActive');
  @override
  late final GeneratedColumn<bool> isActive = GeneratedColumn<bool>(
      'is_active', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('CHECK ("is_active" IN (0, 1))'),
      defaultValue: const Constant(true));
  static const VerificationMeta _lastLoginAtMeta =
      const VerificationMeta('lastLoginAt');
  @override
  late final GeneratedColumn<DateTime> lastLoginAt = GeneratedColumn<DateTime>(
      'last_login_at', aliasedName, true,
      type: DriftSqlType.dateTime, requiredDuringInsert: false);
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        externalId,
        email,
        name,
        phone,
        role,
        organizationId,
        profileImageUrl,
        isActive,
        lastLoginAt,
        createdAt,
        updatedAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'users';
  @override
  VerificationContext validateIntegrity(Insertable<User> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('external_id')) {
      context.handle(
          _externalIdMeta,
          externalId.isAcceptableOrUnknown(
              data['external_id']!, _externalIdMeta));
    } else if (isInserting) {
      context.missing(_externalIdMeta);
    }
    if (data.containsKey('email')) {
      context.handle(
          _emailMeta, email.isAcceptableOrUnknown(data['email']!, _emailMeta));
    } else if (isInserting) {
      context.missing(_emailMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
          _nameMeta, name.isAcceptableOrUnknown(data['name']!, _nameMeta));
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('phone')) {
      context.handle(
          _phoneMeta, phone.isAcceptableOrUnknown(data['phone']!, _phoneMeta));
    }
    if (data.containsKey('role')) {
      context.handle(
          _roleMeta, role.isAcceptableOrUnknown(data['role']!, _roleMeta));
    } else if (isInserting) {
      context.missing(_roleMeta);
    }
    if (data.containsKey('organization_id')) {
      context.handle(
          _organizationIdMeta,
          organizationId.isAcceptableOrUnknown(
              data['organization_id']!, _organizationIdMeta));
    } else if (isInserting) {
      context.missing(_organizationIdMeta);
    }
    if (data.containsKey('profile_image_url')) {
      context.handle(
          _profileImageUrlMeta,
          profileImageUrl.isAcceptableOrUnknown(
              data['profile_image_url']!, _profileImageUrlMeta));
    }
    if (data.containsKey('is_active')) {
      context.handle(_isActiveMeta,
          isActive.isAcceptableOrUnknown(data['is_active']!, _isActiveMeta));
    }
    if (data.containsKey('last_login_at')) {
      context.handle(
          _lastLoginAtMeta,
          lastLoginAt.isAcceptableOrUnknown(
              data['last_login_at']!, _lastLoginAtMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  User map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return User(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      externalId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}external_id'])!,
      email: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}email'])!,
      name: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}name'])!,
      phone: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}phone']),
      role: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}role'])!,
      organizationId: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}organization_id'])!,
      profileImageUrl: attachedDatabase.typeMapping.read(
          DriftSqlType.string, data['${effectivePrefix}profile_image_url']),
      isActive: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_active'])!,
      lastLoginAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}last_login_at']),
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
    );
  }

  @override
  $UsersTable createAlias(String alias) {
    return $UsersTable(attachedDatabase, alias);
  }
}

class User extends DataClass implements Insertable<User> {
  final int id;
  final String externalId;
  final String email;
  final String name;
  final String? phone;
  final String role;
  final String organizationId;
  final String? profileImageUrl;
  final bool isActive;
  final DateTime? lastLoginAt;
  final DateTime createdAt;
  final DateTime updatedAt;
  const User(
      {required this.id,
      required this.externalId,
      required this.email,
      required this.name,
      this.phone,
      required this.role,
      required this.organizationId,
      this.profileImageUrl,
      required this.isActive,
      this.lastLoginAt,
      required this.createdAt,
      required this.updatedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['external_id'] = Variable<String>(externalId);
    map['email'] = Variable<String>(email);
    map['name'] = Variable<String>(name);
    if (!nullToAbsent || phone != null) {
      map['phone'] = Variable<String>(phone);
    }
    map['role'] = Variable<String>(role);
    map['organization_id'] = Variable<String>(organizationId);
    if (!nullToAbsent || profileImageUrl != null) {
      map['profile_image_url'] = Variable<String>(profileImageUrl);
    }
    map['is_active'] = Variable<bool>(isActive);
    if (!nullToAbsent || lastLoginAt != null) {
      map['last_login_at'] = Variable<DateTime>(lastLoginAt);
    }
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    return map;
  }

  UsersCompanion toCompanion(bool nullToAbsent) {
    return UsersCompanion(
      id: Value(id),
      externalId: Value(externalId),
      email: Value(email),
      name: Value(name),
      phone:
          phone == null && nullToAbsent ? const Value.absent() : Value(phone),
      role: Value(role),
      organizationId: Value(organizationId),
      profileImageUrl: profileImageUrl == null && nullToAbsent
          ? const Value.absent()
          : Value(profileImageUrl),
      isActive: Value(isActive),
      lastLoginAt: lastLoginAt == null && nullToAbsent
          ? const Value.absent()
          : Value(lastLoginAt),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
    );
  }

  factory User.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return User(
      id: serializer.fromJson<int>(json['id']),
      externalId: serializer.fromJson<String>(json['externalId']),
      email: serializer.fromJson<String>(json['email']),
      name: serializer.fromJson<String>(json['name']),
      phone: serializer.fromJson<String?>(json['phone']),
      role: serializer.fromJson<String>(json['role']),
      organizationId: serializer.fromJson<String>(json['organizationId']),
      profileImageUrl: serializer.fromJson<String?>(json['profileImageUrl']),
      isActive: serializer.fromJson<bool>(json['isActive']),
      lastLoginAt: serializer.fromJson<DateTime?>(json['lastLoginAt']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'externalId': serializer.toJson<String>(externalId),
      'email': serializer.toJson<String>(email),
      'name': serializer.toJson<String>(name),
      'phone': serializer.toJson<String?>(phone),
      'role': serializer.toJson<String>(role),
      'organizationId': serializer.toJson<String>(organizationId),
      'profileImageUrl': serializer.toJson<String?>(profileImageUrl),
      'isActive': serializer.toJson<bool>(isActive),
      'lastLoginAt': serializer.toJson<DateTime?>(lastLoginAt),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
    };
  }

  User copyWith(
          {int? id,
          String? externalId,
          String? email,
          String? name,
          Value<String?> phone = const Value.absent(),
          String? role,
          String? organizationId,
          Value<String?> profileImageUrl = const Value.absent(),
          bool? isActive,
          Value<DateTime?> lastLoginAt = const Value.absent(),
          DateTime? createdAt,
          DateTime? updatedAt}) =>
      User(
        id: id ?? this.id,
        externalId: externalId ?? this.externalId,
        email: email ?? this.email,
        name: name ?? this.name,
        phone: phone.present ? phone.value : this.phone,
        role: role ?? this.role,
        organizationId: organizationId ?? this.organizationId,
        profileImageUrl: profileImageUrl.present
            ? profileImageUrl.value
            : this.profileImageUrl,
        isActive: isActive ?? this.isActive,
        lastLoginAt: lastLoginAt.present ? lastLoginAt.value : this.lastLoginAt,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
      );
  User copyWithCompanion(UsersCompanion data) {
    return User(
      id: data.id.present ? data.id.value : this.id,
      externalId:
          data.externalId.present ? data.externalId.value : this.externalId,
      email: data.email.present ? data.email.value : this.email,
      name: data.name.present ? data.name.value : this.name,
      phone: data.phone.present ? data.phone.value : this.phone,
      role: data.role.present ? data.role.value : this.role,
      organizationId: data.organizationId.present
          ? data.organizationId.value
          : this.organizationId,
      profileImageUrl: data.profileImageUrl.present
          ? data.profileImageUrl.value
          : this.profileImageUrl,
      isActive: data.isActive.present ? data.isActive.value : this.isActive,
      lastLoginAt:
          data.lastLoginAt.present ? data.lastLoginAt.value : this.lastLoginAt,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('User(')
          ..write('id: $id, ')
          ..write('externalId: $externalId, ')
          ..write('email: $email, ')
          ..write('name: $name, ')
          ..write('phone: $phone, ')
          ..write('role: $role, ')
          ..write('organizationId: $organizationId, ')
          ..write('profileImageUrl: $profileImageUrl, ')
          ..write('isActive: $isActive, ')
          ..write('lastLoginAt: $lastLoginAt, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      externalId,
      email,
      name,
      phone,
      role,
      organizationId,
      profileImageUrl,
      isActive,
      lastLoginAt,
      createdAt,
      updatedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is User &&
          other.id == this.id &&
          other.externalId == this.externalId &&
          other.email == this.email &&
          other.name == this.name &&
          other.phone == this.phone &&
          other.role == this.role &&
          other.organizationId == this.organizationId &&
          other.profileImageUrl == this.profileImageUrl &&
          other.isActive == this.isActive &&
          other.lastLoginAt == this.lastLoginAt &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt);
}

class UsersCompanion extends UpdateCompanion<User> {
  final Value<int> id;
  final Value<String> externalId;
  final Value<String> email;
  final Value<String> name;
  final Value<String?> phone;
  final Value<String> role;
  final Value<String> organizationId;
  final Value<String?> profileImageUrl;
  final Value<bool> isActive;
  final Value<DateTime?> lastLoginAt;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  const UsersCompanion({
    this.id = const Value.absent(),
    this.externalId = const Value.absent(),
    this.email = const Value.absent(),
    this.name = const Value.absent(),
    this.phone = const Value.absent(),
    this.role = const Value.absent(),
    this.organizationId = const Value.absent(),
    this.profileImageUrl = const Value.absent(),
    this.isActive = const Value.absent(),
    this.lastLoginAt = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
  });
  UsersCompanion.insert({
    this.id = const Value.absent(),
    required String externalId,
    required String email,
    required String name,
    this.phone = const Value.absent(),
    required String role,
    required String organizationId,
    this.profileImageUrl = const Value.absent(),
    this.isActive = const Value.absent(),
    this.lastLoginAt = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
  })  : externalId = Value(externalId),
        email = Value(email),
        name = Value(name),
        role = Value(role),
        organizationId = Value(organizationId);
  static Insertable<User> custom({
    Expression<int>? id,
    Expression<String>? externalId,
    Expression<String>? email,
    Expression<String>? name,
    Expression<String>? phone,
    Expression<String>? role,
    Expression<String>? organizationId,
    Expression<String>? profileImageUrl,
    Expression<bool>? isActive,
    Expression<DateTime>? lastLoginAt,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (externalId != null) 'external_id': externalId,
      if (email != null) 'email': email,
      if (name != null) 'name': name,
      if (phone != null) 'phone': phone,
      if (role != null) 'role': role,
      if (organizationId != null) 'organization_id': organizationId,
      if (profileImageUrl != null) 'profile_image_url': profileImageUrl,
      if (isActive != null) 'is_active': isActive,
      if (lastLoginAt != null) 'last_login_at': lastLoginAt,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
    });
  }

  UsersCompanion copyWith(
      {Value<int>? id,
      Value<String>? externalId,
      Value<String>? email,
      Value<String>? name,
      Value<String?>? phone,
      Value<String>? role,
      Value<String>? organizationId,
      Value<String?>? profileImageUrl,
      Value<bool>? isActive,
      Value<DateTime?>? lastLoginAt,
      Value<DateTime>? createdAt,
      Value<DateTime>? updatedAt}) {
    return UsersCompanion(
      id: id ?? this.id,
      externalId: externalId ?? this.externalId,
      email: email ?? this.email,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      organizationId: organizationId ?? this.organizationId,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      isActive: isActive ?? this.isActive,
      lastLoginAt: lastLoginAt ?? this.lastLoginAt,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (externalId.present) {
      map['external_id'] = Variable<String>(externalId.value);
    }
    if (email.present) {
      map['email'] = Variable<String>(email.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (phone.present) {
      map['phone'] = Variable<String>(phone.value);
    }
    if (role.present) {
      map['role'] = Variable<String>(role.value);
    }
    if (organizationId.present) {
      map['organization_id'] = Variable<String>(organizationId.value);
    }
    if (profileImageUrl.present) {
      map['profile_image_url'] = Variable<String>(profileImageUrl.value);
    }
    if (isActive.present) {
      map['is_active'] = Variable<bool>(isActive.value);
    }
    if (lastLoginAt.present) {
      map['last_login_at'] = Variable<DateTime>(lastLoginAt.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('UsersCompanion(')
          ..write('id: $id, ')
          ..write('externalId: $externalId, ')
          ..write('email: $email, ')
          ..write('name: $name, ')
          ..write('phone: $phone, ')
          ..write('role: $role, ')
          ..write('organizationId: $organizationId, ')
          ..write('profileImageUrl: $profileImageUrl, ')
          ..write('isActive: $isActive, ')
          ..write('lastLoginAt: $lastLoginAt, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt')
          ..write(')'))
        .toString();
  }
}

class $SyncQueueTable extends SyncQueue
    with TableInfo<$SyncQueueTable, SyncQueueData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $SyncQueueTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _entityTypeMeta =
      const VerificationMeta('entityType');
  @override
  late final GeneratedColumn<String> entityType = GeneratedColumn<String>(
      'entity_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _entityIdMeta =
      const VerificationMeta('entityId');
  @override
  late final GeneratedColumn<String> entityId = GeneratedColumn<String>(
      'entity_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _actionMeta = const VerificationMeta('action');
  @override
  late final GeneratedColumn<String> action = GeneratedColumn<String>(
      'action', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _payloadMeta =
      const VerificationMeta('payload');
  @override
  late final GeneratedColumn<String> payload = GeneratedColumn<String>(
      'payload', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _retryCountMeta =
      const VerificationMeta('retryCount');
  @override
  late final GeneratedColumn<int> retryCount = GeneratedColumn<int>(
      'retry_count', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _lastAttemptAtMeta =
      const VerificationMeta('lastAttemptAt');
  @override
  late final GeneratedColumn<DateTime> lastAttemptAt =
      GeneratedColumn<DateTime>('last_attempt_at', aliasedName, true,
          type: DriftSqlType.dateTime, requiredDuringInsert: false);
  static const VerificationMeta _lastErrorMeta =
      const VerificationMeta('lastError');
  @override
  late final GeneratedColumn<String> lastError = GeneratedColumn<String>(
      'last_error', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _isSyncedMeta =
      const VerificationMeta('isSynced');
  @override
  late final GeneratedColumn<bool> isSynced = GeneratedColumn<bool>(
      'is_synced', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('CHECK ("is_synced" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  static const VerificationMeta _syncedAtMeta =
      const VerificationMeta('syncedAt');
  @override
  late final GeneratedColumn<DateTime> syncedAt = GeneratedColumn<DateTime>(
      'synced_at', aliasedName, true,
      type: DriftSqlType.dateTime, requiredDuringInsert: false);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        entityType,
        entityId,
        action,
        payload,
        retryCount,
        lastAttemptAt,
        lastError,
        isSynced,
        createdAt,
        syncedAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'sync_queue';
  @override
  VerificationContext validateIntegrity(Insertable<SyncQueueData> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('entity_type')) {
      context.handle(
          _entityTypeMeta,
          entityType.isAcceptableOrUnknown(
              data['entity_type']!, _entityTypeMeta));
    } else if (isInserting) {
      context.missing(_entityTypeMeta);
    }
    if (data.containsKey('entity_id')) {
      context.handle(_entityIdMeta,
          entityId.isAcceptableOrUnknown(data['entity_id']!, _entityIdMeta));
    } else if (isInserting) {
      context.missing(_entityIdMeta);
    }
    if (data.containsKey('action')) {
      context.handle(_actionMeta,
          action.isAcceptableOrUnknown(data['action']!, _actionMeta));
    } else if (isInserting) {
      context.missing(_actionMeta);
    }
    if (data.containsKey('payload')) {
      context.handle(_payloadMeta,
          payload.isAcceptableOrUnknown(data['payload']!, _payloadMeta));
    } else if (isInserting) {
      context.missing(_payloadMeta);
    }
    if (data.containsKey('retry_count')) {
      context.handle(
          _retryCountMeta,
          retryCount.isAcceptableOrUnknown(
              data['retry_count']!, _retryCountMeta));
    }
    if (data.containsKey('last_attempt_at')) {
      context.handle(
          _lastAttemptAtMeta,
          lastAttemptAt.isAcceptableOrUnknown(
              data['last_attempt_at']!, _lastAttemptAtMeta));
    }
    if (data.containsKey('last_error')) {
      context.handle(_lastErrorMeta,
          lastError.isAcceptableOrUnknown(data['last_error']!, _lastErrorMeta));
    }
    if (data.containsKey('is_synced')) {
      context.handle(_isSyncedMeta,
          isSynced.isAcceptableOrUnknown(data['is_synced']!, _isSyncedMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    if (data.containsKey('synced_at')) {
      context.handle(_syncedAtMeta,
          syncedAt.isAcceptableOrUnknown(data['synced_at']!, _syncedAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  SyncQueueData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return SyncQueueData(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      entityType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}entity_type'])!,
      entityId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}entity_id'])!,
      action: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}action'])!,
      payload: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}payload'])!,
      retryCount: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}retry_count'])!,
      lastAttemptAt: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}last_attempt_at']),
      lastError: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}last_error']),
      isSynced: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_synced'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      syncedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}synced_at']),
    );
  }

  @override
  $SyncQueueTable createAlias(String alias) {
    return $SyncQueueTable(attachedDatabase, alias);
  }
}

class SyncQueueData extends DataClass implements Insertable<SyncQueueData> {
  final int id;
  final String entityType;
  final String entityId;
  final String action;
  final String payload;
  final int retryCount;
  final DateTime? lastAttemptAt;
  final String? lastError;
  final bool isSynced;
  final DateTime createdAt;
  final DateTime? syncedAt;
  const SyncQueueData(
      {required this.id,
      required this.entityType,
      required this.entityId,
      required this.action,
      required this.payload,
      required this.retryCount,
      this.lastAttemptAt,
      this.lastError,
      required this.isSynced,
      required this.createdAt,
      this.syncedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['entity_type'] = Variable<String>(entityType);
    map['entity_id'] = Variable<String>(entityId);
    map['action'] = Variable<String>(action);
    map['payload'] = Variable<String>(payload);
    map['retry_count'] = Variable<int>(retryCount);
    if (!nullToAbsent || lastAttemptAt != null) {
      map['last_attempt_at'] = Variable<DateTime>(lastAttemptAt);
    }
    if (!nullToAbsent || lastError != null) {
      map['last_error'] = Variable<String>(lastError);
    }
    map['is_synced'] = Variable<bool>(isSynced);
    map['created_at'] = Variable<DateTime>(createdAt);
    if (!nullToAbsent || syncedAt != null) {
      map['synced_at'] = Variable<DateTime>(syncedAt);
    }
    return map;
  }

  SyncQueueCompanion toCompanion(bool nullToAbsent) {
    return SyncQueueCompanion(
      id: Value(id),
      entityType: Value(entityType),
      entityId: Value(entityId),
      action: Value(action),
      payload: Value(payload),
      retryCount: Value(retryCount),
      lastAttemptAt: lastAttemptAt == null && nullToAbsent
          ? const Value.absent()
          : Value(lastAttemptAt),
      lastError: lastError == null && nullToAbsent
          ? const Value.absent()
          : Value(lastError),
      isSynced: Value(isSynced),
      createdAt: Value(createdAt),
      syncedAt: syncedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(syncedAt),
    );
  }

  factory SyncQueueData.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return SyncQueueData(
      id: serializer.fromJson<int>(json['id']),
      entityType: serializer.fromJson<String>(json['entityType']),
      entityId: serializer.fromJson<String>(json['entityId']),
      action: serializer.fromJson<String>(json['action']),
      payload: serializer.fromJson<String>(json['payload']),
      retryCount: serializer.fromJson<int>(json['retryCount']),
      lastAttemptAt: serializer.fromJson<DateTime?>(json['lastAttemptAt']),
      lastError: serializer.fromJson<String?>(json['lastError']),
      isSynced: serializer.fromJson<bool>(json['isSynced']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      syncedAt: serializer.fromJson<DateTime?>(json['syncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'entityType': serializer.toJson<String>(entityType),
      'entityId': serializer.toJson<String>(entityId),
      'action': serializer.toJson<String>(action),
      'payload': serializer.toJson<String>(payload),
      'retryCount': serializer.toJson<int>(retryCount),
      'lastAttemptAt': serializer.toJson<DateTime?>(lastAttemptAt),
      'lastError': serializer.toJson<String?>(lastError),
      'isSynced': serializer.toJson<bool>(isSynced),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'syncedAt': serializer.toJson<DateTime?>(syncedAt),
    };
  }

  SyncQueueData copyWith(
          {int? id,
          String? entityType,
          String? entityId,
          String? action,
          String? payload,
          int? retryCount,
          Value<DateTime?> lastAttemptAt = const Value.absent(),
          Value<String?> lastError = const Value.absent(),
          bool? isSynced,
          DateTime? createdAt,
          Value<DateTime?> syncedAt = const Value.absent()}) =>
      SyncQueueData(
        id: id ?? this.id,
        entityType: entityType ?? this.entityType,
        entityId: entityId ?? this.entityId,
        action: action ?? this.action,
        payload: payload ?? this.payload,
        retryCount: retryCount ?? this.retryCount,
        lastAttemptAt:
            lastAttemptAt.present ? lastAttemptAt.value : this.lastAttemptAt,
        lastError: lastError.present ? lastError.value : this.lastError,
        isSynced: isSynced ?? this.isSynced,
        createdAt: createdAt ?? this.createdAt,
        syncedAt: syncedAt.present ? syncedAt.value : this.syncedAt,
      );
  SyncQueueData copyWithCompanion(SyncQueueCompanion data) {
    return SyncQueueData(
      id: data.id.present ? data.id.value : this.id,
      entityType:
          data.entityType.present ? data.entityType.value : this.entityType,
      entityId: data.entityId.present ? data.entityId.value : this.entityId,
      action: data.action.present ? data.action.value : this.action,
      payload: data.payload.present ? data.payload.value : this.payload,
      retryCount:
          data.retryCount.present ? data.retryCount.value : this.retryCount,
      lastAttemptAt: data.lastAttemptAt.present
          ? data.lastAttemptAt.value
          : this.lastAttemptAt,
      lastError: data.lastError.present ? data.lastError.value : this.lastError,
      isSynced: data.isSynced.present ? data.isSynced.value : this.isSynced,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      syncedAt: data.syncedAt.present ? data.syncedAt.value : this.syncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('SyncQueueData(')
          ..write('id: $id, ')
          ..write('entityType: $entityType, ')
          ..write('entityId: $entityId, ')
          ..write('action: $action, ')
          ..write('payload: $payload, ')
          ..write('retryCount: $retryCount, ')
          ..write('lastAttemptAt: $lastAttemptAt, ')
          ..write('lastError: $lastError, ')
          ..write('isSynced: $isSynced, ')
          ..write('createdAt: $createdAt, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, entityType, entityId, action, payload,
      retryCount, lastAttemptAt, lastError, isSynced, createdAt, syncedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is SyncQueueData &&
          other.id == this.id &&
          other.entityType == this.entityType &&
          other.entityId == this.entityId &&
          other.action == this.action &&
          other.payload == this.payload &&
          other.retryCount == this.retryCount &&
          other.lastAttemptAt == this.lastAttemptAt &&
          other.lastError == this.lastError &&
          other.isSynced == this.isSynced &&
          other.createdAt == this.createdAt &&
          other.syncedAt == this.syncedAt);
}

class SyncQueueCompanion extends UpdateCompanion<SyncQueueData> {
  final Value<int> id;
  final Value<String> entityType;
  final Value<String> entityId;
  final Value<String> action;
  final Value<String> payload;
  final Value<int> retryCount;
  final Value<DateTime?> lastAttemptAt;
  final Value<String?> lastError;
  final Value<bool> isSynced;
  final Value<DateTime> createdAt;
  final Value<DateTime?> syncedAt;
  const SyncQueueCompanion({
    this.id = const Value.absent(),
    this.entityType = const Value.absent(),
    this.entityId = const Value.absent(),
    this.action = const Value.absent(),
    this.payload = const Value.absent(),
    this.retryCount = const Value.absent(),
    this.lastAttemptAt = const Value.absent(),
    this.lastError = const Value.absent(),
    this.isSynced = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.syncedAt = const Value.absent(),
  });
  SyncQueueCompanion.insert({
    this.id = const Value.absent(),
    required String entityType,
    required String entityId,
    required String action,
    required String payload,
    this.retryCount = const Value.absent(),
    this.lastAttemptAt = const Value.absent(),
    this.lastError = const Value.absent(),
    this.isSynced = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.syncedAt = const Value.absent(),
  })  : entityType = Value(entityType),
        entityId = Value(entityId),
        action = Value(action),
        payload = Value(payload);
  static Insertable<SyncQueueData> custom({
    Expression<int>? id,
    Expression<String>? entityType,
    Expression<String>? entityId,
    Expression<String>? action,
    Expression<String>? payload,
    Expression<int>? retryCount,
    Expression<DateTime>? lastAttemptAt,
    Expression<String>? lastError,
    Expression<bool>? isSynced,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? syncedAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (entityType != null) 'entity_type': entityType,
      if (entityId != null) 'entity_id': entityId,
      if (action != null) 'action': action,
      if (payload != null) 'payload': payload,
      if (retryCount != null) 'retry_count': retryCount,
      if (lastAttemptAt != null) 'last_attempt_at': lastAttemptAt,
      if (lastError != null) 'last_error': lastError,
      if (isSynced != null) 'is_synced': isSynced,
      if (createdAt != null) 'created_at': createdAt,
      if (syncedAt != null) 'synced_at': syncedAt,
    });
  }

  SyncQueueCompanion copyWith(
      {Value<int>? id,
      Value<String>? entityType,
      Value<String>? entityId,
      Value<String>? action,
      Value<String>? payload,
      Value<int>? retryCount,
      Value<DateTime?>? lastAttemptAt,
      Value<String?>? lastError,
      Value<bool>? isSynced,
      Value<DateTime>? createdAt,
      Value<DateTime?>? syncedAt}) {
    return SyncQueueCompanion(
      id: id ?? this.id,
      entityType: entityType ?? this.entityType,
      entityId: entityId ?? this.entityId,
      action: action ?? this.action,
      payload: payload ?? this.payload,
      retryCount: retryCount ?? this.retryCount,
      lastAttemptAt: lastAttemptAt ?? this.lastAttemptAt,
      lastError: lastError ?? this.lastError,
      isSynced: isSynced ?? this.isSynced,
      createdAt: createdAt ?? this.createdAt,
      syncedAt: syncedAt ?? this.syncedAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (entityType.present) {
      map['entity_type'] = Variable<String>(entityType.value);
    }
    if (entityId.present) {
      map['entity_id'] = Variable<String>(entityId.value);
    }
    if (action.present) {
      map['action'] = Variable<String>(action.value);
    }
    if (payload.present) {
      map['payload'] = Variable<String>(payload.value);
    }
    if (retryCount.present) {
      map['retry_count'] = Variable<int>(retryCount.value);
    }
    if (lastAttemptAt.present) {
      map['last_attempt_at'] = Variable<DateTime>(lastAttemptAt.value);
    }
    if (lastError.present) {
      map['last_error'] = Variable<String>(lastError.value);
    }
    if (isSynced.present) {
      map['is_synced'] = Variable<bool>(isSynced.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (syncedAt.present) {
      map['synced_at'] = Variable<DateTime>(syncedAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('SyncQueueCompanion(')
          ..write('id: $id, ')
          ..write('entityType: $entityType, ')
          ..write('entityId: $entityId, ')
          ..write('action: $action, ')
          ..write('payload: $payload, ')
          ..write('retryCount: $retryCount, ')
          ..write('lastAttemptAt: $lastAttemptAt, ')
          ..write('lastError: $lastError, ')
          ..write('isSynced: $isSynced, ')
          ..write('createdAt: $createdAt, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }
}

class $DailyReportsTable extends DailyReports
    with TableInfo<$DailyReportsTable, DailyReportData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DailyReportsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _userIdMeta = const VerificationMeta('userId');
  @override
  late final GeneratedColumn<String> userId = GeneratedColumn<String>(
      'user_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _reportDateMeta =
      const VerificationMeta('reportDate');
  @override
  late final GeneratedColumn<DateTime> reportDate = GeneratedColumn<DateTime>(
      'report_date', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _visitSummaryMeta =
      const VerificationMeta('visitSummary');
  @override
  late final GeneratedColumn<String> visitSummary = GeneratedColumn<String>(
      'visit_summary', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _totalVisitsMeta =
      const VerificationMeta('totalVisits');
  @override
  late final GeneratedColumn<int> totalVisits = GeneratedColumn<int>(
      'total_visits', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _totalCallsMeta =
      const VerificationMeta('totalCalls');
  @override
  late final GeneratedColumn<int> totalCalls = GeneratedColumn<int>(
      'total_calls', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _proposalsSentMeta =
      const VerificationMeta('proposalsSent');
  @override
  late final GeneratedColumn<int> proposalsSent = GeneratedColumn<int>(
      'proposals_sent', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
      'status', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _isSyncedMeta =
      const VerificationMeta('isSynced');
  @override
  late final GeneratedColumn<bool> isSynced = GeneratedColumn<bool>(
      'is_synced', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('CHECK ("is_synced" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        userId,
        reportDate,
        visitSummary,
        totalVisits,
        totalCalls,
        proposalsSent,
        status,
        isSynced,
        createdAt,
        updatedAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'daily_reports';
  @override
  VerificationContext validateIntegrity(Insertable<DailyReportData> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('user_id')) {
      context.handle(_userIdMeta,
          userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta));
    } else if (isInserting) {
      context.missing(_userIdMeta);
    }
    if (data.containsKey('report_date')) {
      context.handle(
          _reportDateMeta,
          reportDate.isAcceptableOrUnknown(
              data['report_date']!, _reportDateMeta));
    } else if (isInserting) {
      context.missing(_reportDateMeta);
    }
    if (data.containsKey('visit_summary')) {
      context.handle(
          _visitSummaryMeta,
          visitSummary.isAcceptableOrUnknown(
              data['visit_summary']!, _visitSummaryMeta));
    } else if (isInserting) {
      context.missing(_visitSummaryMeta);
    }
    if (data.containsKey('total_visits')) {
      context.handle(
          _totalVisitsMeta,
          totalVisits.isAcceptableOrUnknown(
              data['total_visits']!, _totalVisitsMeta));
    }
    if (data.containsKey('total_calls')) {
      context.handle(
          _totalCallsMeta,
          totalCalls.isAcceptableOrUnknown(
              data['total_calls']!, _totalCallsMeta));
    }
    if (data.containsKey('proposals_sent')) {
      context.handle(
          _proposalsSentMeta,
          proposalsSent.isAcceptableOrUnknown(
              data['proposals_sent']!, _proposalsSentMeta));
    }
    if (data.containsKey('status')) {
      context.handle(_statusMeta,
          status.isAcceptableOrUnknown(data['status']!, _statusMeta));
    } else if (isInserting) {
      context.missing(_statusMeta);
    }
    if (data.containsKey('is_synced')) {
      context.handle(_isSyncedMeta,
          isSynced.isAcceptableOrUnknown(data['is_synced']!, _isSyncedMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  DailyReportData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return DailyReportData(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      userId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}user_id'])!,
      reportDate: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}report_date'])!,
      visitSummary: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}visit_summary'])!,
      totalVisits: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}total_visits'])!,
      totalCalls: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}total_calls'])!,
      proposalsSent: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}proposals_sent'])!,
      status: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}status'])!,
      isSynced: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_synced'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
    );
  }

  @override
  $DailyReportsTable createAlias(String alias) {
    return $DailyReportsTable(attachedDatabase, alias);
  }
}

class DailyReportData extends DataClass implements Insertable<DailyReportData> {
  final String id;
  final String userId;
  final DateTime reportDate;
  final String visitSummary;
  final int totalVisits;
  final int totalCalls;
  final int proposalsSent;
  final String status;
  final bool isSynced;
  final DateTime createdAt;
  final DateTime updatedAt;
  const DailyReportData(
      {required this.id,
      required this.userId,
      required this.reportDate,
      required this.visitSummary,
      required this.totalVisits,
      required this.totalCalls,
      required this.proposalsSent,
      required this.status,
      required this.isSynced,
      required this.createdAt,
      required this.updatedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['user_id'] = Variable<String>(userId);
    map['report_date'] = Variable<DateTime>(reportDate);
    map['visit_summary'] = Variable<String>(visitSummary);
    map['total_visits'] = Variable<int>(totalVisits);
    map['total_calls'] = Variable<int>(totalCalls);
    map['proposals_sent'] = Variable<int>(proposalsSent);
    map['status'] = Variable<String>(status);
    map['is_synced'] = Variable<bool>(isSynced);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    return map;
  }

  DailyReportsCompanion toCompanion(bool nullToAbsent) {
    return DailyReportsCompanion(
      id: Value(id),
      userId: Value(userId),
      reportDate: Value(reportDate),
      visitSummary: Value(visitSummary),
      totalVisits: Value(totalVisits),
      totalCalls: Value(totalCalls),
      proposalsSent: Value(proposalsSent),
      status: Value(status),
      isSynced: Value(isSynced),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
    );
  }

  factory DailyReportData.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return DailyReportData(
      id: serializer.fromJson<String>(json['id']),
      userId: serializer.fromJson<String>(json['userId']),
      reportDate: serializer.fromJson<DateTime>(json['reportDate']),
      visitSummary: serializer.fromJson<String>(json['visitSummary']),
      totalVisits: serializer.fromJson<int>(json['totalVisits']),
      totalCalls: serializer.fromJson<int>(json['totalCalls']),
      proposalsSent: serializer.fromJson<int>(json['proposalsSent']),
      status: serializer.fromJson<String>(json['status']),
      isSynced: serializer.fromJson<bool>(json['isSynced']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'userId': serializer.toJson<String>(userId),
      'reportDate': serializer.toJson<DateTime>(reportDate),
      'visitSummary': serializer.toJson<String>(visitSummary),
      'totalVisits': serializer.toJson<int>(totalVisits),
      'totalCalls': serializer.toJson<int>(totalCalls),
      'proposalsSent': serializer.toJson<int>(proposalsSent),
      'status': serializer.toJson<String>(status),
      'isSynced': serializer.toJson<bool>(isSynced),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
    };
  }

  DailyReportData copyWith(
          {String? id,
          String? userId,
          DateTime? reportDate,
          String? visitSummary,
          int? totalVisits,
          int? totalCalls,
          int? proposalsSent,
          String? status,
          bool? isSynced,
          DateTime? createdAt,
          DateTime? updatedAt}) =>
      DailyReportData(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        reportDate: reportDate ?? this.reportDate,
        visitSummary: visitSummary ?? this.visitSummary,
        totalVisits: totalVisits ?? this.totalVisits,
        totalCalls: totalCalls ?? this.totalCalls,
        proposalsSent: proposalsSent ?? this.proposalsSent,
        status: status ?? this.status,
        isSynced: isSynced ?? this.isSynced,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
      );
  DailyReportData copyWithCompanion(DailyReportsCompanion data) {
    return DailyReportData(
      id: data.id.present ? data.id.value : this.id,
      userId: data.userId.present ? data.userId.value : this.userId,
      reportDate:
          data.reportDate.present ? data.reportDate.value : this.reportDate,
      visitSummary: data.visitSummary.present
          ? data.visitSummary.value
          : this.visitSummary,
      totalVisits:
          data.totalVisits.present ? data.totalVisits.value : this.totalVisits,
      totalCalls:
          data.totalCalls.present ? data.totalCalls.value : this.totalCalls,
      proposalsSent: data.proposalsSent.present
          ? data.proposalsSent.value
          : this.proposalsSent,
      status: data.status.present ? data.status.value : this.status,
      isSynced: data.isSynced.present ? data.isSynced.value : this.isSynced,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('DailyReportData(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('reportDate: $reportDate, ')
          ..write('visitSummary: $visitSummary, ')
          ..write('totalVisits: $totalVisits, ')
          ..write('totalCalls: $totalCalls, ')
          ..write('proposalsSent: $proposalsSent, ')
          ..write('status: $status, ')
          ..write('isSynced: $isSynced, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      userId,
      reportDate,
      visitSummary,
      totalVisits,
      totalCalls,
      proposalsSent,
      status,
      isSynced,
      createdAt,
      updatedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is DailyReportData &&
          other.id == this.id &&
          other.userId == this.userId &&
          other.reportDate == this.reportDate &&
          other.visitSummary == this.visitSummary &&
          other.totalVisits == this.totalVisits &&
          other.totalCalls == this.totalCalls &&
          other.proposalsSent == this.proposalsSent &&
          other.status == this.status &&
          other.isSynced == this.isSynced &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt);
}

class DailyReportsCompanion extends UpdateCompanion<DailyReportData> {
  final Value<String> id;
  final Value<String> userId;
  final Value<DateTime> reportDate;
  final Value<String> visitSummary;
  final Value<int> totalVisits;
  final Value<int> totalCalls;
  final Value<int> proposalsSent;
  final Value<String> status;
  final Value<bool> isSynced;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<int> rowid;
  const DailyReportsCompanion({
    this.id = const Value.absent(),
    this.userId = const Value.absent(),
    this.reportDate = const Value.absent(),
    this.visitSummary = const Value.absent(),
    this.totalVisits = const Value.absent(),
    this.totalCalls = const Value.absent(),
    this.proposalsSent = const Value.absent(),
    this.status = const Value.absent(),
    this.isSynced = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  DailyReportsCompanion.insert({
    required String id,
    required String userId,
    required DateTime reportDate,
    required String visitSummary,
    this.totalVisits = const Value.absent(),
    this.totalCalls = const Value.absent(),
    this.proposalsSent = const Value.absent(),
    required String status,
    this.isSynced = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        userId = Value(userId),
        reportDate = Value(reportDate),
        visitSummary = Value(visitSummary),
        status = Value(status),
        createdAt = Value(createdAt),
        updatedAt = Value(updatedAt);
  static Insertable<DailyReportData> custom({
    Expression<String>? id,
    Expression<String>? userId,
    Expression<DateTime>? reportDate,
    Expression<String>? visitSummary,
    Expression<int>? totalVisits,
    Expression<int>? totalCalls,
    Expression<int>? proposalsSent,
    Expression<String>? status,
    Expression<bool>? isSynced,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (userId != null) 'user_id': userId,
      if (reportDate != null) 'report_date': reportDate,
      if (visitSummary != null) 'visit_summary': visitSummary,
      if (totalVisits != null) 'total_visits': totalVisits,
      if (totalCalls != null) 'total_calls': totalCalls,
      if (proposalsSent != null) 'proposals_sent': proposalsSent,
      if (status != null) 'status': status,
      if (isSynced != null) 'is_synced': isSynced,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  DailyReportsCompanion copyWith(
      {Value<String>? id,
      Value<String>? userId,
      Value<DateTime>? reportDate,
      Value<String>? visitSummary,
      Value<int>? totalVisits,
      Value<int>? totalCalls,
      Value<int>? proposalsSent,
      Value<String>? status,
      Value<bool>? isSynced,
      Value<DateTime>? createdAt,
      Value<DateTime>? updatedAt,
      Value<int>? rowid}) {
    return DailyReportsCompanion(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      reportDate: reportDate ?? this.reportDate,
      visitSummary: visitSummary ?? this.visitSummary,
      totalVisits: totalVisits ?? this.totalVisits,
      totalCalls: totalCalls ?? this.totalCalls,
      proposalsSent: proposalsSent ?? this.proposalsSent,
      status: status ?? this.status,
      isSynced: isSynced ?? this.isSynced,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (userId.present) {
      map['user_id'] = Variable<String>(userId.value);
    }
    if (reportDate.present) {
      map['report_date'] = Variable<DateTime>(reportDate.value);
    }
    if (visitSummary.present) {
      map['visit_summary'] = Variable<String>(visitSummary.value);
    }
    if (totalVisits.present) {
      map['total_visits'] = Variable<int>(totalVisits.value);
    }
    if (totalCalls.present) {
      map['total_calls'] = Variable<int>(totalCalls.value);
    }
    if (proposalsSent.present) {
      map['proposals_sent'] = Variable<int>(proposalsSent.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (isSynced.present) {
      map['is_synced'] = Variable<bool>(isSynced.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DailyReportsCompanion(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('reportDate: $reportDate, ')
          ..write('visitSummary: $visitSummary, ')
          ..write('totalVisits: $totalVisits, ')
          ..write('totalCalls: $totalCalls, ')
          ..write('proposalsSent: $proposalsSent, ')
          ..write('status: $status, ')
          ..write('isSynced: $isSynced, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $CustomerVisitsTable extends CustomerVisits
    with TableInfo<$CustomerVisitsTable, CustomerVisitData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CustomerVisitsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _reportIdMeta =
      const VerificationMeta('reportId');
  @override
  late final GeneratedColumn<String> reportId = GeneratedColumn<String>(
      'report_id', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('REFERENCES daily_reports (id)'));
  static const VerificationMeta _customerIdMeta =
      const VerificationMeta('customerId');
  @override
  late final GeneratedColumn<String> customerId = GeneratedColumn<String>(
      'customer_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerNameMeta =
      const VerificationMeta('customerName');
  @override
  late final GeneratedColumn<String> customerName = GeneratedColumn<String>(
      'customer_name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _visitTimeMeta =
      const VerificationMeta('visitTime');
  @override
  late final GeneratedColumn<DateTime> visitTime = GeneratedColumn<DateTime>(
      'visit_time', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _visitOutcomeMeta =
      const VerificationMeta('visitOutcome');
  @override
  late final GeneratedColumn<String> visitOutcome = GeneratedColumn<String>(
      'visit_outcome', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _notesMeta = const VerificationMeta('notes');
  @override
  late final GeneratedColumn<String> notes = GeneratedColumn<String>(
      'notes', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _nextActionMeta =
      const VerificationMeta('nextAction');
  @override
  late final GeneratedColumn<String> nextAction = GeneratedColumn<String>(
      'next_action', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _followUpDateMeta =
      const VerificationMeta('followUpDate');
  @override
  late final GeneratedColumn<DateTime> followUpDate = GeneratedColumn<DateTime>(
      'follow_up_date', aliasedName, true,
      type: DriftSqlType.dateTime, requiredDuringInsert: false);
  static const VerificationMeta _isSyncedMeta =
      const VerificationMeta('isSynced');
  @override
  late final GeneratedColumn<bool> isSynced = GeneratedColumn<bool>(
      'is_synced', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('CHECK ("is_synced" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        reportId,
        customerId,
        customerName,
        visitTime,
        visitOutcome,
        notes,
        nextAction,
        followUpDate,
        isSynced,
        createdAt,
        updatedAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'customer_visits';
  @override
  VerificationContext validateIntegrity(Insertable<CustomerVisitData> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('report_id')) {
      context.handle(_reportIdMeta,
          reportId.isAcceptableOrUnknown(data['report_id']!, _reportIdMeta));
    } else if (isInserting) {
      context.missing(_reportIdMeta);
    }
    if (data.containsKey('customer_id')) {
      context.handle(
          _customerIdMeta,
          customerId.isAcceptableOrUnknown(
              data['customer_id']!, _customerIdMeta));
    } else if (isInserting) {
      context.missing(_customerIdMeta);
    }
    if (data.containsKey('customer_name')) {
      context.handle(
          _customerNameMeta,
          customerName.isAcceptableOrUnknown(
              data['customer_name']!, _customerNameMeta));
    } else if (isInserting) {
      context.missing(_customerNameMeta);
    }
    if (data.containsKey('visit_time')) {
      context.handle(_visitTimeMeta,
          visitTime.isAcceptableOrUnknown(data['visit_time']!, _visitTimeMeta));
    } else if (isInserting) {
      context.missing(_visitTimeMeta);
    }
    if (data.containsKey('visit_outcome')) {
      context.handle(
          _visitOutcomeMeta,
          visitOutcome.isAcceptableOrUnknown(
              data['visit_outcome']!, _visitOutcomeMeta));
    } else if (isInserting) {
      context.missing(_visitOutcomeMeta);
    }
    if (data.containsKey('notes')) {
      context.handle(
          _notesMeta, notes.isAcceptableOrUnknown(data['notes']!, _notesMeta));
    }
    if (data.containsKey('next_action')) {
      context.handle(
          _nextActionMeta,
          nextAction.isAcceptableOrUnknown(
              data['next_action']!, _nextActionMeta));
    }
    if (data.containsKey('follow_up_date')) {
      context.handle(
          _followUpDateMeta,
          followUpDate.isAcceptableOrUnknown(
              data['follow_up_date']!, _followUpDateMeta));
    }
    if (data.containsKey('is_synced')) {
      context.handle(_isSyncedMeta,
          isSynced.isAcceptableOrUnknown(data['is_synced']!, _isSyncedMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CustomerVisitData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CustomerVisitData(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      reportId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}report_id'])!,
      customerId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_id'])!,
      customerName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_name'])!,
      visitTime: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}visit_time'])!,
      visitOutcome: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}visit_outcome'])!,
      notes: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}notes']),
      nextAction: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}next_action']),
      followUpDate: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}follow_up_date']),
      isSynced: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_synced'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
    );
  }

  @override
  $CustomerVisitsTable createAlias(String alias) {
    return $CustomerVisitsTable(attachedDatabase, alias);
  }
}

class CustomerVisitData extends DataClass
    implements Insertable<CustomerVisitData> {
  final String id;
  final String reportId;
  final String customerId;
  final String customerName;
  final DateTime visitTime;
  final String visitOutcome;
  final String? notes;
  final String? nextAction;
  final DateTime? followUpDate;
  final bool isSynced;
  final DateTime createdAt;
  final DateTime updatedAt;
  const CustomerVisitData(
      {required this.id,
      required this.reportId,
      required this.customerId,
      required this.customerName,
      required this.visitTime,
      required this.visitOutcome,
      this.notes,
      this.nextAction,
      this.followUpDate,
      required this.isSynced,
      required this.createdAt,
      required this.updatedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['report_id'] = Variable<String>(reportId);
    map['customer_id'] = Variable<String>(customerId);
    map['customer_name'] = Variable<String>(customerName);
    map['visit_time'] = Variable<DateTime>(visitTime);
    map['visit_outcome'] = Variable<String>(visitOutcome);
    if (!nullToAbsent || notes != null) {
      map['notes'] = Variable<String>(notes);
    }
    if (!nullToAbsent || nextAction != null) {
      map['next_action'] = Variable<String>(nextAction);
    }
    if (!nullToAbsent || followUpDate != null) {
      map['follow_up_date'] = Variable<DateTime>(followUpDate);
    }
    map['is_synced'] = Variable<bool>(isSynced);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    return map;
  }

  CustomerVisitsCompanion toCompanion(bool nullToAbsent) {
    return CustomerVisitsCompanion(
      id: Value(id),
      reportId: Value(reportId),
      customerId: Value(customerId),
      customerName: Value(customerName),
      visitTime: Value(visitTime),
      visitOutcome: Value(visitOutcome),
      notes:
          notes == null && nullToAbsent ? const Value.absent() : Value(notes),
      nextAction: nextAction == null && nullToAbsent
          ? const Value.absent()
          : Value(nextAction),
      followUpDate: followUpDate == null && nullToAbsent
          ? const Value.absent()
          : Value(followUpDate),
      isSynced: Value(isSynced),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
    );
  }

  factory CustomerVisitData.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CustomerVisitData(
      id: serializer.fromJson<String>(json['id']),
      reportId: serializer.fromJson<String>(json['reportId']),
      customerId: serializer.fromJson<String>(json['customerId']),
      customerName: serializer.fromJson<String>(json['customerName']),
      visitTime: serializer.fromJson<DateTime>(json['visitTime']),
      visitOutcome: serializer.fromJson<String>(json['visitOutcome']),
      notes: serializer.fromJson<String?>(json['notes']),
      nextAction: serializer.fromJson<String?>(json['nextAction']),
      followUpDate: serializer.fromJson<DateTime?>(json['followUpDate']),
      isSynced: serializer.fromJson<bool>(json['isSynced']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'reportId': serializer.toJson<String>(reportId),
      'customerId': serializer.toJson<String>(customerId),
      'customerName': serializer.toJson<String>(customerName),
      'visitTime': serializer.toJson<DateTime>(visitTime),
      'visitOutcome': serializer.toJson<String>(visitOutcome),
      'notes': serializer.toJson<String?>(notes),
      'nextAction': serializer.toJson<String?>(nextAction),
      'followUpDate': serializer.toJson<DateTime?>(followUpDate),
      'isSynced': serializer.toJson<bool>(isSynced),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
    };
  }

  CustomerVisitData copyWith(
          {String? id,
          String? reportId,
          String? customerId,
          String? customerName,
          DateTime? visitTime,
          String? visitOutcome,
          Value<String?> notes = const Value.absent(),
          Value<String?> nextAction = const Value.absent(),
          Value<DateTime?> followUpDate = const Value.absent(),
          bool? isSynced,
          DateTime? createdAt,
          DateTime? updatedAt}) =>
      CustomerVisitData(
        id: id ?? this.id,
        reportId: reportId ?? this.reportId,
        customerId: customerId ?? this.customerId,
        customerName: customerName ?? this.customerName,
        visitTime: visitTime ?? this.visitTime,
        visitOutcome: visitOutcome ?? this.visitOutcome,
        notes: notes.present ? notes.value : this.notes,
        nextAction: nextAction.present ? nextAction.value : this.nextAction,
        followUpDate:
            followUpDate.present ? followUpDate.value : this.followUpDate,
        isSynced: isSynced ?? this.isSynced,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
      );
  CustomerVisitData copyWithCompanion(CustomerVisitsCompanion data) {
    return CustomerVisitData(
      id: data.id.present ? data.id.value : this.id,
      reportId: data.reportId.present ? data.reportId.value : this.reportId,
      customerId:
          data.customerId.present ? data.customerId.value : this.customerId,
      customerName: data.customerName.present
          ? data.customerName.value
          : this.customerName,
      visitTime: data.visitTime.present ? data.visitTime.value : this.visitTime,
      visitOutcome: data.visitOutcome.present
          ? data.visitOutcome.value
          : this.visitOutcome,
      notes: data.notes.present ? data.notes.value : this.notes,
      nextAction:
          data.nextAction.present ? data.nextAction.value : this.nextAction,
      followUpDate: data.followUpDate.present
          ? data.followUpDate.value
          : this.followUpDate,
      isSynced: data.isSynced.present ? data.isSynced.value : this.isSynced,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CustomerVisitData(')
          ..write('id: $id, ')
          ..write('reportId: $reportId, ')
          ..write('customerId: $customerId, ')
          ..write('customerName: $customerName, ')
          ..write('visitTime: $visitTime, ')
          ..write('visitOutcome: $visitOutcome, ')
          ..write('notes: $notes, ')
          ..write('nextAction: $nextAction, ')
          ..write('followUpDate: $followUpDate, ')
          ..write('isSynced: $isSynced, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      reportId,
      customerId,
      customerName,
      visitTime,
      visitOutcome,
      notes,
      nextAction,
      followUpDate,
      isSynced,
      createdAt,
      updatedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CustomerVisitData &&
          other.id == this.id &&
          other.reportId == this.reportId &&
          other.customerId == this.customerId &&
          other.customerName == this.customerName &&
          other.visitTime == this.visitTime &&
          other.visitOutcome == this.visitOutcome &&
          other.notes == this.notes &&
          other.nextAction == this.nextAction &&
          other.followUpDate == this.followUpDate &&
          other.isSynced == this.isSynced &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt);
}

class CustomerVisitsCompanion extends UpdateCompanion<CustomerVisitData> {
  final Value<String> id;
  final Value<String> reportId;
  final Value<String> customerId;
  final Value<String> customerName;
  final Value<DateTime> visitTime;
  final Value<String> visitOutcome;
  final Value<String?> notes;
  final Value<String?> nextAction;
  final Value<DateTime?> followUpDate;
  final Value<bool> isSynced;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<int> rowid;
  const CustomerVisitsCompanion({
    this.id = const Value.absent(),
    this.reportId = const Value.absent(),
    this.customerId = const Value.absent(),
    this.customerName = const Value.absent(),
    this.visitTime = const Value.absent(),
    this.visitOutcome = const Value.absent(),
    this.notes = const Value.absent(),
    this.nextAction = const Value.absent(),
    this.followUpDate = const Value.absent(),
    this.isSynced = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CustomerVisitsCompanion.insert({
    required String id,
    required String reportId,
    required String customerId,
    required String customerName,
    required DateTime visitTime,
    required String visitOutcome,
    this.notes = const Value.absent(),
    this.nextAction = const Value.absent(),
    this.followUpDate = const Value.absent(),
    this.isSynced = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        reportId = Value(reportId),
        customerId = Value(customerId),
        customerName = Value(customerName),
        visitTime = Value(visitTime),
        visitOutcome = Value(visitOutcome),
        createdAt = Value(createdAt),
        updatedAt = Value(updatedAt);
  static Insertable<CustomerVisitData> custom({
    Expression<String>? id,
    Expression<String>? reportId,
    Expression<String>? customerId,
    Expression<String>? customerName,
    Expression<DateTime>? visitTime,
    Expression<String>? visitOutcome,
    Expression<String>? notes,
    Expression<String>? nextAction,
    Expression<DateTime>? followUpDate,
    Expression<bool>? isSynced,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (reportId != null) 'report_id': reportId,
      if (customerId != null) 'customer_id': customerId,
      if (customerName != null) 'customer_name': customerName,
      if (visitTime != null) 'visit_time': visitTime,
      if (visitOutcome != null) 'visit_outcome': visitOutcome,
      if (notes != null) 'notes': notes,
      if (nextAction != null) 'next_action': nextAction,
      if (followUpDate != null) 'follow_up_date': followUpDate,
      if (isSynced != null) 'is_synced': isSynced,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CustomerVisitsCompanion copyWith(
      {Value<String>? id,
      Value<String>? reportId,
      Value<String>? customerId,
      Value<String>? customerName,
      Value<DateTime>? visitTime,
      Value<String>? visitOutcome,
      Value<String?>? notes,
      Value<String?>? nextAction,
      Value<DateTime?>? followUpDate,
      Value<bool>? isSynced,
      Value<DateTime>? createdAt,
      Value<DateTime>? updatedAt,
      Value<int>? rowid}) {
    return CustomerVisitsCompanion(
      id: id ?? this.id,
      reportId: reportId ?? this.reportId,
      customerId: customerId ?? this.customerId,
      customerName: customerName ?? this.customerName,
      visitTime: visitTime ?? this.visitTime,
      visitOutcome: visitOutcome ?? this.visitOutcome,
      notes: notes ?? this.notes,
      nextAction: nextAction ?? this.nextAction,
      followUpDate: followUpDate ?? this.followUpDate,
      isSynced: isSynced ?? this.isSynced,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (reportId.present) {
      map['report_id'] = Variable<String>(reportId.value);
    }
    if (customerId.present) {
      map['customer_id'] = Variable<String>(customerId.value);
    }
    if (customerName.present) {
      map['customer_name'] = Variable<String>(customerName.value);
    }
    if (visitTime.present) {
      map['visit_time'] = Variable<DateTime>(visitTime.value);
    }
    if (visitOutcome.present) {
      map['visit_outcome'] = Variable<String>(visitOutcome.value);
    }
    if (notes.present) {
      map['notes'] = Variable<String>(notes.value);
    }
    if (nextAction.present) {
      map['next_action'] = Variable<String>(nextAction.value);
    }
    if (followUpDate.present) {
      map['follow_up_date'] = Variable<DateTime>(followUpDate.value);
    }
    if (isSynced.present) {
      map['is_synced'] = Variable<bool>(isSynced.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CustomerVisitsCompanion(')
          ..write('id: $id, ')
          ..write('reportId: $reportId, ')
          ..write('customerId: $customerId, ')
          ..write('customerName: $customerName, ')
          ..write('visitTime: $visitTime, ')
          ..write('visitOutcome: $visitOutcome, ')
          ..write('notes: $notes, ')
          ..write('nextAction: $nextAction, ')
          ..write('followUpDate: $followUpDate, ')
          ..write('isSynced: $isSynced, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $DailyPlanningTable extends DailyPlanning
    with TableInfo<$DailyPlanningTable, PlanningItemData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $DailyPlanningTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _reportIdMeta =
      const VerificationMeta('reportId');
  @override
  late final GeneratedColumn<String> reportId = GeneratedColumn<String>(
      'report_id', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('REFERENCES daily_reports (id)'));
  static const VerificationMeta _activityMeta =
      const VerificationMeta('activity');
  @override
  late final GeneratedColumn<String> activity = GeneratedColumn<String>(
      'activity', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _scheduledDateMeta =
      const VerificationMeta('scheduledDate');
  @override
  late final GeneratedColumn<DateTime> scheduledDate =
      GeneratedColumn<DateTime>('scheduled_date', aliasedName, false,
          type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _priorityMeta =
      const VerificationMeta('priority');
  @override
  late final GeneratedColumn<String> priority = GeneratedColumn<String>(
      'priority', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _customerIdMeta =
      const VerificationMeta('customerId');
  @override
  late final GeneratedColumn<String> customerId = GeneratedColumn<String>(
      'customer_id', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _customerNameMeta =
      const VerificationMeta('customerName');
  @override
  late final GeneratedColumn<String> customerName = GeneratedColumn<String>(
      'customer_name', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _notesMeta = const VerificationMeta('notes');
  @override
  late final GeneratedColumn<String> notes = GeneratedColumn<String>(
      'notes', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _isCompletedMeta =
      const VerificationMeta('isCompleted');
  @override
  late final GeneratedColumn<bool> isCompleted = GeneratedColumn<bool>(
      'is_completed', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints: GeneratedColumn.constraintIsAlways(
          'CHECK ("is_completed" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _isSyncedMeta =
      const VerificationMeta('isSynced');
  @override
  late final GeneratedColumn<bool> isSynced = GeneratedColumn<bool>(
      'is_synced', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('CHECK ("is_synced" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        reportId,
        activity,
        scheduledDate,
        priority,
        customerId,
        customerName,
        notes,
        isCompleted,
        isSynced,
        createdAt,
        updatedAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'daily_planning';
  @override
  VerificationContext validateIntegrity(Insertable<PlanningItemData> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('report_id')) {
      context.handle(_reportIdMeta,
          reportId.isAcceptableOrUnknown(data['report_id']!, _reportIdMeta));
    } else if (isInserting) {
      context.missing(_reportIdMeta);
    }
    if (data.containsKey('activity')) {
      context.handle(_activityMeta,
          activity.isAcceptableOrUnknown(data['activity']!, _activityMeta));
    } else if (isInserting) {
      context.missing(_activityMeta);
    }
    if (data.containsKey('scheduled_date')) {
      context.handle(
          _scheduledDateMeta,
          scheduledDate.isAcceptableOrUnknown(
              data['scheduled_date']!, _scheduledDateMeta));
    } else if (isInserting) {
      context.missing(_scheduledDateMeta);
    }
    if (data.containsKey('priority')) {
      context.handle(_priorityMeta,
          priority.isAcceptableOrUnknown(data['priority']!, _priorityMeta));
    } else if (isInserting) {
      context.missing(_priorityMeta);
    }
    if (data.containsKey('customer_id')) {
      context.handle(
          _customerIdMeta,
          customerId.isAcceptableOrUnknown(
              data['customer_id']!, _customerIdMeta));
    }
    if (data.containsKey('customer_name')) {
      context.handle(
          _customerNameMeta,
          customerName.isAcceptableOrUnknown(
              data['customer_name']!, _customerNameMeta));
    }
    if (data.containsKey('notes')) {
      context.handle(
          _notesMeta, notes.isAcceptableOrUnknown(data['notes']!, _notesMeta));
    }
    if (data.containsKey('is_completed')) {
      context.handle(
          _isCompletedMeta,
          isCompleted.isAcceptableOrUnknown(
              data['is_completed']!, _isCompletedMeta));
    }
    if (data.containsKey('is_synced')) {
      context.handle(_isSyncedMeta,
          isSynced.isAcceptableOrUnknown(data['is_synced']!, _isSyncedMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  PlanningItemData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return PlanningItemData(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      reportId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}report_id'])!,
      activity: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}activity'])!,
      scheduledDate: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}scheduled_date'])!,
      priority: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}priority'])!,
      customerId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_id']),
      customerName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}customer_name']),
      notes: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}notes']),
      isCompleted: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_completed'])!,
      isSynced: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_synced'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
    );
  }

  @override
  $DailyPlanningTable createAlias(String alias) {
    return $DailyPlanningTable(attachedDatabase, alias);
  }
}

class PlanningItemData extends DataClass
    implements Insertable<PlanningItemData> {
  final String id;
  final String reportId;
  final String activity;
  final DateTime scheduledDate;
  final String priority;
  final String? customerId;
  final String? customerName;
  final String? notes;
  final bool isCompleted;
  final bool isSynced;
  final DateTime createdAt;
  final DateTime updatedAt;
  const PlanningItemData(
      {required this.id,
      required this.reportId,
      required this.activity,
      required this.scheduledDate,
      required this.priority,
      this.customerId,
      this.customerName,
      this.notes,
      required this.isCompleted,
      required this.isSynced,
      required this.createdAt,
      required this.updatedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['report_id'] = Variable<String>(reportId);
    map['activity'] = Variable<String>(activity);
    map['scheduled_date'] = Variable<DateTime>(scheduledDate);
    map['priority'] = Variable<String>(priority);
    if (!nullToAbsent || customerId != null) {
      map['customer_id'] = Variable<String>(customerId);
    }
    if (!nullToAbsent || customerName != null) {
      map['customer_name'] = Variable<String>(customerName);
    }
    if (!nullToAbsent || notes != null) {
      map['notes'] = Variable<String>(notes);
    }
    map['is_completed'] = Variable<bool>(isCompleted);
    map['is_synced'] = Variable<bool>(isSynced);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    return map;
  }

  DailyPlanningCompanion toCompanion(bool nullToAbsent) {
    return DailyPlanningCompanion(
      id: Value(id),
      reportId: Value(reportId),
      activity: Value(activity),
      scheduledDate: Value(scheduledDate),
      priority: Value(priority),
      customerId: customerId == null && nullToAbsent
          ? const Value.absent()
          : Value(customerId),
      customerName: customerName == null && nullToAbsent
          ? const Value.absent()
          : Value(customerName),
      notes:
          notes == null && nullToAbsent ? const Value.absent() : Value(notes),
      isCompleted: Value(isCompleted),
      isSynced: Value(isSynced),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
    );
  }

  factory PlanningItemData.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return PlanningItemData(
      id: serializer.fromJson<String>(json['id']),
      reportId: serializer.fromJson<String>(json['reportId']),
      activity: serializer.fromJson<String>(json['activity']),
      scheduledDate: serializer.fromJson<DateTime>(json['scheduledDate']),
      priority: serializer.fromJson<String>(json['priority']),
      customerId: serializer.fromJson<String?>(json['customerId']),
      customerName: serializer.fromJson<String?>(json['customerName']),
      notes: serializer.fromJson<String?>(json['notes']),
      isCompleted: serializer.fromJson<bool>(json['isCompleted']),
      isSynced: serializer.fromJson<bool>(json['isSynced']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'reportId': serializer.toJson<String>(reportId),
      'activity': serializer.toJson<String>(activity),
      'scheduledDate': serializer.toJson<DateTime>(scheduledDate),
      'priority': serializer.toJson<String>(priority),
      'customerId': serializer.toJson<String?>(customerId),
      'customerName': serializer.toJson<String?>(customerName),
      'notes': serializer.toJson<String?>(notes),
      'isCompleted': serializer.toJson<bool>(isCompleted),
      'isSynced': serializer.toJson<bool>(isSynced),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
    };
  }

  PlanningItemData copyWith(
          {String? id,
          String? reportId,
          String? activity,
          DateTime? scheduledDate,
          String? priority,
          Value<String?> customerId = const Value.absent(),
          Value<String?> customerName = const Value.absent(),
          Value<String?> notes = const Value.absent(),
          bool? isCompleted,
          bool? isSynced,
          DateTime? createdAt,
          DateTime? updatedAt}) =>
      PlanningItemData(
        id: id ?? this.id,
        reportId: reportId ?? this.reportId,
        activity: activity ?? this.activity,
        scheduledDate: scheduledDate ?? this.scheduledDate,
        priority: priority ?? this.priority,
        customerId: customerId.present ? customerId.value : this.customerId,
        customerName:
            customerName.present ? customerName.value : this.customerName,
        notes: notes.present ? notes.value : this.notes,
        isCompleted: isCompleted ?? this.isCompleted,
        isSynced: isSynced ?? this.isSynced,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
      );
  PlanningItemData copyWithCompanion(DailyPlanningCompanion data) {
    return PlanningItemData(
      id: data.id.present ? data.id.value : this.id,
      reportId: data.reportId.present ? data.reportId.value : this.reportId,
      activity: data.activity.present ? data.activity.value : this.activity,
      scheduledDate: data.scheduledDate.present
          ? data.scheduledDate.value
          : this.scheduledDate,
      priority: data.priority.present ? data.priority.value : this.priority,
      customerId:
          data.customerId.present ? data.customerId.value : this.customerId,
      customerName: data.customerName.present
          ? data.customerName.value
          : this.customerName,
      notes: data.notes.present ? data.notes.value : this.notes,
      isCompleted:
          data.isCompleted.present ? data.isCompleted.value : this.isCompleted,
      isSynced: data.isSynced.present ? data.isSynced.value : this.isSynced,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('PlanningItemData(')
          ..write('id: $id, ')
          ..write('reportId: $reportId, ')
          ..write('activity: $activity, ')
          ..write('scheduledDate: $scheduledDate, ')
          ..write('priority: $priority, ')
          ..write('customerId: $customerId, ')
          ..write('customerName: $customerName, ')
          ..write('notes: $notes, ')
          ..write('isCompleted: $isCompleted, ')
          ..write('isSynced: $isSynced, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      reportId,
      activity,
      scheduledDate,
      priority,
      customerId,
      customerName,
      notes,
      isCompleted,
      isSynced,
      createdAt,
      updatedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is PlanningItemData &&
          other.id == this.id &&
          other.reportId == this.reportId &&
          other.activity == this.activity &&
          other.scheduledDate == this.scheduledDate &&
          other.priority == this.priority &&
          other.customerId == this.customerId &&
          other.customerName == this.customerName &&
          other.notes == this.notes &&
          other.isCompleted == this.isCompleted &&
          other.isSynced == this.isSynced &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt);
}

class DailyPlanningCompanion extends UpdateCompanion<PlanningItemData> {
  final Value<String> id;
  final Value<String> reportId;
  final Value<String> activity;
  final Value<DateTime> scheduledDate;
  final Value<String> priority;
  final Value<String?> customerId;
  final Value<String?> customerName;
  final Value<String?> notes;
  final Value<bool> isCompleted;
  final Value<bool> isSynced;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<int> rowid;
  const DailyPlanningCompanion({
    this.id = const Value.absent(),
    this.reportId = const Value.absent(),
    this.activity = const Value.absent(),
    this.scheduledDate = const Value.absent(),
    this.priority = const Value.absent(),
    this.customerId = const Value.absent(),
    this.customerName = const Value.absent(),
    this.notes = const Value.absent(),
    this.isCompleted = const Value.absent(),
    this.isSynced = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  DailyPlanningCompanion.insert({
    required String id,
    required String reportId,
    required String activity,
    required DateTime scheduledDate,
    required String priority,
    this.customerId = const Value.absent(),
    this.customerName = const Value.absent(),
    this.notes = const Value.absent(),
    this.isCompleted = const Value.absent(),
    this.isSynced = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        reportId = Value(reportId),
        activity = Value(activity),
        scheduledDate = Value(scheduledDate),
        priority = Value(priority),
        createdAt = Value(createdAt),
        updatedAt = Value(updatedAt);
  static Insertable<PlanningItemData> custom({
    Expression<String>? id,
    Expression<String>? reportId,
    Expression<String>? activity,
    Expression<DateTime>? scheduledDate,
    Expression<String>? priority,
    Expression<String>? customerId,
    Expression<String>? customerName,
    Expression<String>? notes,
    Expression<bool>? isCompleted,
    Expression<bool>? isSynced,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (reportId != null) 'report_id': reportId,
      if (activity != null) 'activity': activity,
      if (scheduledDate != null) 'scheduled_date': scheduledDate,
      if (priority != null) 'priority': priority,
      if (customerId != null) 'customer_id': customerId,
      if (customerName != null) 'customer_name': customerName,
      if (notes != null) 'notes': notes,
      if (isCompleted != null) 'is_completed': isCompleted,
      if (isSynced != null) 'is_synced': isSynced,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  DailyPlanningCompanion copyWith(
      {Value<String>? id,
      Value<String>? reportId,
      Value<String>? activity,
      Value<DateTime>? scheduledDate,
      Value<String>? priority,
      Value<String?>? customerId,
      Value<String?>? customerName,
      Value<String?>? notes,
      Value<bool>? isCompleted,
      Value<bool>? isSynced,
      Value<DateTime>? createdAt,
      Value<DateTime>? updatedAt,
      Value<int>? rowid}) {
    return DailyPlanningCompanion(
      id: id ?? this.id,
      reportId: reportId ?? this.reportId,
      activity: activity ?? this.activity,
      scheduledDate: scheduledDate ?? this.scheduledDate,
      priority: priority ?? this.priority,
      customerId: customerId ?? this.customerId,
      customerName: customerName ?? this.customerName,
      notes: notes ?? this.notes,
      isCompleted: isCompleted ?? this.isCompleted,
      isSynced: isSynced ?? this.isSynced,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (reportId.present) {
      map['report_id'] = Variable<String>(reportId.value);
    }
    if (activity.present) {
      map['activity'] = Variable<String>(activity.value);
    }
    if (scheduledDate.present) {
      map['scheduled_date'] = Variable<DateTime>(scheduledDate.value);
    }
    if (priority.present) {
      map['priority'] = Variable<String>(priority.value);
    }
    if (customerId.present) {
      map['customer_id'] = Variable<String>(customerId.value);
    }
    if (customerName.present) {
      map['customer_name'] = Variable<String>(customerName.value);
    }
    if (notes.present) {
      map['notes'] = Variable<String>(notes.value);
    }
    if (isCompleted.present) {
      map['is_completed'] = Variable<bool>(isCompleted.value);
    }
    if (isSynced.present) {
      map['is_synced'] = Variable<bool>(isSynced.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('DailyPlanningCompanion(')
          ..write('id: $id, ')
          ..write('reportId: $reportId, ')
          ..write('activity: $activity, ')
          ..write('scheduledDate: $scheduledDate, ')
          ..write('priority: $priority, ')
          ..write('customerId: $customerId, ')
          ..write('customerName: $customerName, ')
          ..write('notes: $notes, ')
          ..write('isCompleted: $isCompleted, ')
          ..write('isSynced: $isSynced, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $ProspectCustomersTable extends ProspectCustomers
    with TableInfo<$ProspectCustomersTable, ProspectCustomer> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $ProspectCustomersTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _companyNameMeta =
      const VerificationMeta('companyName');
  @override
  late final GeneratedColumn<String> companyName = GeneratedColumn<String>(
      'company_name', aliasedName, false,
      additionalChecks:
          GeneratedColumn.checkTextLength(minTextLength: 1, maxTextLength: 200),
      type: DriftSqlType.string,
      requiredDuringInsert: true);
  static const VerificationMeta _addressMeta =
      const VerificationMeta('address');
  @override
  late final GeneratedColumn<String> address = GeneratedColumn<String>(
      'address', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _latitudeMeta =
      const VerificationMeta('latitude');
  @override
  late final GeneratedColumn<double> latitude = GeneratedColumn<double>(
      'latitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _longitudeMeta =
      const VerificationMeta('longitude');
  @override
  late final GeneratedColumn<double> longitude = GeneratedColumn<double>(
      'longitude', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _businessTypeMeta =
      const VerificationMeta('businessType');
  @override
  late final GeneratedColumn<String> businessType = GeneratedColumn<String>(
      'business_type', aliasedName, false,
      additionalChecks:
          GeneratedColumn.checkTextLength(minTextLength: 1, maxTextLength: 50),
      type: DriftSqlType.string,
      requiredDuringInsert: true);
  static const VerificationMeta _potentialAreaSqmMeta =
      const VerificationMeta('potentialAreaSqm');
  @override
  late final GeneratedColumn<double> potentialAreaSqm = GeneratedColumn<double>(
      'potential_area_sqm', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _potentialValueIdrMeta =
      const VerificationMeta('potentialValueIdr');
  @override
  late final GeneratedColumn<double> potentialValueIdr =
      GeneratedColumn<double>('potential_value_idr', aliasedName, false,
          type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _notesMeta = const VerificationMeta('notes');
  @override
  late final GeneratedColumn<String> notes = GeneratedColumn<String>(
      'notes', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _contactsMeta =
      const VerificationMeta('contacts');
  @override
  late final GeneratedColumn<String> contacts = GeneratedColumn<String>(
      'contacts', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  static const VerificationMeta _isSyncedMeta =
      const VerificationMeta('isSynced');
  @override
  late final GeneratedColumn<bool> isSynced = GeneratedColumn<bool>(
      'is_synced', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('CHECK ("is_synced" IN (0, 1))'),
      defaultValue: const Constant(false));
  @override
  List<GeneratedColumn> get $columns => [
        id,
        companyName,
        address,
        latitude,
        longitude,
        businessType,
        potentialAreaSqm,
        potentialValueIdr,
        notes,
        contacts,
        createdAt,
        updatedAt,
        isSynced
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'prospect_customers';
  @override
  VerificationContext validateIntegrity(Insertable<ProspectCustomer> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('company_name')) {
      context.handle(
          _companyNameMeta,
          companyName.isAcceptableOrUnknown(
              data['company_name']!, _companyNameMeta));
    } else if (isInserting) {
      context.missing(_companyNameMeta);
    }
    if (data.containsKey('address')) {
      context.handle(_addressMeta,
          address.isAcceptableOrUnknown(data['address']!, _addressMeta));
    } else if (isInserting) {
      context.missing(_addressMeta);
    }
    if (data.containsKey('latitude')) {
      context.handle(_latitudeMeta,
          latitude.isAcceptableOrUnknown(data['latitude']!, _latitudeMeta));
    } else if (isInserting) {
      context.missing(_latitudeMeta);
    }
    if (data.containsKey('longitude')) {
      context.handle(_longitudeMeta,
          longitude.isAcceptableOrUnknown(data['longitude']!, _longitudeMeta));
    } else if (isInserting) {
      context.missing(_longitudeMeta);
    }
    if (data.containsKey('business_type')) {
      context.handle(
          _businessTypeMeta,
          businessType.isAcceptableOrUnknown(
              data['business_type']!, _businessTypeMeta));
    } else if (isInserting) {
      context.missing(_businessTypeMeta);
    }
    if (data.containsKey('potential_area_sqm')) {
      context.handle(
          _potentialAreaSqmMeta,
          potentialAreaSqm.isAcceptableOrUnknown(
              data['potential_area_sqm']!, _potentialAreaSqmMeta));
    } else if (isInserting) {
      context.missing(_potentialAreaSqmMeta);
    }
    if (data.containsKey('potential_value_idr')) {
      context.handle(
          _potentialValueIdrMeta,
          potentialValueIdr.isAcceptableOrUnknown(
              data['potential_value_idr']!, _potentialValueIdrMeta));
    } else if (isInserting) {
      context.missing(_potentialValueIdrMeta);
    }
    if (data.containsKey('notes')) {
      context.handle(
          _notesMeta, notes.isAcceptableOrUnknown(data['notes']!, _notesMeta));
    }
    if (data.containsKey('contacts')) {
      context.handle(_contactsMeta,
          contacts.isAcceptableOrUnknown(data['contacts']!, _contactsMeta));
    } else if (isInserting) {
      context.missing(_contactsMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    }
    if (data.containsKey('is_synced')) {
      context.handle(_isSyncedMeta,
          isSynced.isAcceptableOrUnknown(data['is_synced']!, _isSyncedMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  List<Set<GeneratedColumn>> get uniqueKeys => [
        {companyName, latitude, longitude},
      ];
  @override
  ProspectCustomer map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return ProspectCustomer(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      companyName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}company_name'])!,
      address: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}address'])!,
      latitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}latitude'])!,
      longitude: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}longitude'])!,
      businessType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}business_type'])!,
      potentialAreaSqm: attachedDatabase.typeMapping.read(
          DriftSqlType.double, data['${effectivePrefix}potential_area_sqm'])!,
      potentialValueIdr: attachedDatabase.typeMapping.read(
          DriftSqlType.double, data['${effectivePrefix}potential_value_idr'])!,
      notes: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}notes']),
      contacts: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}contacts'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
      isSynced: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_synced'])!,
    );
  }

  @override
  $ProspectCustomersTable createAlias(String alias) {
    return $ProspectCustomersTable(attachedDatabase, alias);
  }
}

class ProspectCustomer extends DataClass
    implements Insertable<ProspectCustomer> {
  final String id;
  final String companyName;
  final String address;
  final double latitude;
  final double longitude;
  final String businessType;
  final double potentialAreaSqm;
  final double potentialValueIdr;
  final String? notes;
  final String contacts;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isSynced;
  const ProspectCustomer(
      {required this.id,
      required this.companyName,
      required this.address,
      required this.latitude,
      required this.longitude,
      required this.businessType,
      required this.potentialAreaSqm,
      required this.potentialValueIdr,
      this.notes,
      required this.contacts,
      required this.createdAt,
      required this.updatedAt,
      required this.isSynced});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['company_name'] = Variable<String>(companyName);
    map['address'] = Variable<String>(address);
    map['latitude'] = Variable<double>(latitude);
    map['longitude'] = Variable<double>(longitude);
    map['business_type'] = Variable<String>(businessType);
    map['potential_area_sqm'] = Variable<double>(potentialAreaSqm);
    map['potential_value_idr'] = Variable<double>(potentialValueIdr);
    if (!nullToAbsent || notes != null) {
      map['notes'] = Variable<String>(notes);
    }
    map['contacts'] = Variable<String>(contacts);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    map['is_synced'] = Variable<bool>(isSynced);
    return map;
  }

  ProspectCustomersCompanion toCompanion(bool nullToAbsent) {
    return ProspectCustomersCompanion(
      id: Value(id),
      companyName: Value(companyName),
      address: Value(address),
      latitude: Value(latitude),
      longitude: Value(longitude),
      businessType: Value(businessType),
      potentialAreaSqm: Value(potentialAreaSqm),
      potentialValueIdr: Value(potentialValueIdr),
      notes:
          notes == null && nullToAbsent ? const Value.absent() : Value(notes),
      contacts: Value(contacts),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
      isSynced: Value(isSynced),
    );
  }

  factory ProspectCustomer.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return ProspectCustomer(
      id: serializer.fromJson<String>(json['id']),
      companyName: serializer.fromJson<String>(json['companyName']),
      address: serializer.fromJson<String>(json['address']),
      latitude: serializer.fromJson<double>(json['latitude']),
      longitude: serializer.fromJson<double>(json['longitude']),
      businessType: serializer.fromJson<String>(json['businessType']),
      potentialAreaSqm: serializer.fromJson<double>(json['potentialAreaSqm']),
      potentialValueIdr: serializer.fromJson<double>(json['potentialValueIdr']),
      notes: serializer.fromJson<String?>(json['notes']),
      contacts: serializer.fromJson<String>(json['contacts']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
      isSynced: serializer.fromJson<bool>(json['isSynced']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'companyName': serializer.toJson<String>(companyName),
      'address': serializer.toJson<String>(address),
      'latitude': serializer.toJson<double>(latitude),
      'longitude': serializer.toJson<double>(longitude),
      'businessType': serializer.toJson<String>(businessType),
      'potentialAreaSqm': serializer.toJson<double>(potentialAreaSqm),
      'potentialValueIdr': serializer.toJson<double>(potentialValueIdr),
      'notes': serializer.toJson<String?>(notes),
      'contacts': serializer.toJson<String>(contacts),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
      'isSynced': serializer.toJson<bool>(isSynced),
    };
  }

  ProspectCustomer copyWith(
          {String? id,
          String? companyName,
          String? address,
          double? latitude,
          double? longitude,
          String? businessType,
          double? potentialAreaSqm,
          double? potentialValueIdr,
          Value<String?> notes = const Value.absent(),
          String? contacts,
          DateTime? createdAt,
          DateTime? updatedAt,
          bool? isSynced}) =>
      ProspectCustomer(
        id: id ?? this.id,
        companyName: companyName ?? this.companyName,
        address: address ?? this.address,
        latitude: latitude ?? this.latitude,
        longitude: longitude ?? this.longitude,
        businessType: businessType ?? this.businessType,
        potentialAreaSqm: potentialAreaSqm ?? this.potentialAreaSqm,
        potentialValueIdr: potentialValueIdr ?? this.potentialValueIdr,
        notes: notes.present ? notes.value : this.notes,
        contacts: contacts ?? this.contacts,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        isSynced: isSynced ?? this.isSynced,
      );
  ProspectCustomer copyWithCompanion(ProspectCustomersCompanion data) {
    return ProspectCustomer(
      id: data.id.present ? data.id.value : this.id,
      companyName:
          data.companyName.present ? data.companyName.value : this.companyName,
      address: data.address.present ? data.address.value : this.address,
      latitude: data.latitude.present ? data.latitude.value : this.latitude,
      longitude: data.longitude.present ? data.longitude.value : this.longitude,
      businessType: data.businessType.present
          ? data.businessType.value
          : this.businessType,
      potentialAreaSqm: data.potentialAreaSqm.present
          ? data.potentialAreaSqm.value
          : this.potentialAreaSqm,
      potentialValueIdr: data.potentialValueIdr.present
          ? data.potentialValueIdr.value
          : this.potentialValueIdr,
      notes: data.notes.present ? data.notes.value : this.notes,
      contacts: data.contacts.present ? data.contacts.value : this.contacts,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
      isSynced: data.isSynced.present ? data.isSynced.value : this.isSynced,
    );
  }

  @override
  String toString() {
    return (StringBuffer('ProspectCustomer(')
          ..write('id: $id, ')
          ..write('companyName: $companyName, ')
          ..write('address: $address, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('businessType: $businessType, ')
          ..write('potentialAreaSqm: $potentialAreaSqm, ')
          ..write('potentialValueIdr: $potentialValueIdr, ')
          ..write('notes: $notes, ')
          ..write('contacts: $contacts, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('isSynced: $isSynced')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      companyName,
      address,
      latitude,
      longitude,
      businessType,
      potentialAreaSqm,
      potentialValueIdr,
      notes,
      contacts,
      createdAt,
      updatedAt,
      isSynced);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is ProspectCustomer &&
          other.id == this.id &&
          other.companyName == this.companyName &&
          other.address == this.address &&
          other.latitude == this.latitude &&
          other.longitude == this.longitude &&
          other.businessType == this.businessType &&
          other.potentialAreaSqm == this.potentialAreaSqm &&
          other.potentialValueIdr == this.potentialValueIdr &&
          other.notes == this.notes &&
          other.contacts == this.contacts &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt &&
          other.isSynced == this.isSynced);
}

class ProspectCustomersCompanion extends UpdateCompanion<ProspectCustomer> {
  final Value<String> id;
  final Value<String> companyName;
  final Value<String> address;
  final Value<double> latitude;
  final Value<double> longitude;
  final Value<String> businessType;
  final Value<double> potentialAreaSqm;
  final Value<double> potentialValueIdr;
  final Value<String?> notes;
  final Value<String> contacts;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  final Value<bool> isSynced;
  final Value<int> rowid;
  const ProspectCustomersCompanion({
    this.id = const Value.absent(),
    this.companyName = const Value.absent(),
    this.address = const Value.absent(),
    this.latitude = const Value.absent(),
    this.longitude = const Value.absent(),
    this.businessType = const Value.absent(),
    this.potentialAreaSqm = const Value.absent(),
    this.potentialValueIdr = const Value.absent(),
    this.notes = const Value.absent(),
    this.contacts = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.isSynced = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  ProspectCustomersCompanion.insert({
    required String id,
    required String companyName,
    required String address,
    required double latitude,
    required double longitude,
    required String businessType,
    required double potentialAreaSqm,
    required double potentialValueIdr,
    this.notes = const Value.absent(),
    required String contacts,
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
    this.isSynced = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        companyName = Value(companyName),
        address = Value(address),
        latitude = Value(latitude),
        longitude = Value(longitude),
        businessType = Value(businessType),
        potentialAreaSqm = Value(potentialAreaSqm),
        potentialValueIdr = Value(potentialValueIdr),
        contacts = Value(contacts);
  static Insertable<ProspectCustomer> custom({
    Expression<String>? id,
    Expression<String>? companyName,
    Expression<String>? address,
    Expression<double>? latitude,
    Expression<double>? longitude,
    Expression<String>? businessType,
    Expression<double>? potentialAreaSqm,
    Expression<double>? potentialValueIdr,
    Expression<String>? notes,
    Expression<String>? contacts,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
    Expression<bool>? isSynced,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (companyName != null) 'company_name': companyName,
      if (address != null) 'address': address,
      if (latitude != null) 'latitude': latitude,
      if (longitude != null) 'longitude': longitude,
      if (businessType != null) 'business_type': businessType,
      if (potentialAreaSqm != null) 'potential_area_sqm': potentialAreaSqm,
      if (potentialValueIdr != null) 'potential_value_idr': potentialValueIdr,
      if (notes != null) 'notes': notes,
      if (contacts != null) 'contacts': contacts,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
      if (isSynced != null) 'is_synced': isSynced,
      if (rowid != null) 'rowid': rowid,
    });
  }

  ProspectCustomersCompanion copyWith(
      {Value<String>? id,
      Value<String>? companyName,
      Value<String>? address,
      Value<double>? latitude,
      Value<double>? longitude,
      Value<String>? businessType,
      Value<double>? potentialAreaSqm,
      Value<double>? potentialValueIdr,
      Value<String?>? notes,
      Value<String>? contacts,
      Value<DateTime>? createdAt,
      Value<DateTime>? updatedAt,
      Value<bool>? isSynced,
      Value<int>? rowid}) {
    return ProspectCustomersCompanion(
      id: id ?? this.id,
      companyName: companyName ?? this.companyName,
      address: address ?? this.address,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      businessType: businessType ?? this.businessType,
      potentialAreaSqm: potentialAreaSqm ?? this.potentialAreaSqm,
      potentialValueIdr: potentialValueIdr ?? this.potentialValueIdr,
      notes: notes ?? this.notes,
      contacts: contacts ?? this.contacts,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isSynced: isSynced ?? this.isSynced,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (companyName.present) {
      map['company_name'] = Variable<String>(companyName.value);
    }
    if (address.present) {
      map['address'] = Variable<String>(address.value);
    }
    if (latitude.present) {
      map['latitude'] = Variable<double>(latitude.value);
    }
    if (longitude.present) {
      map['longitude'] = Variable<double>(longitude.value);
    }
    if (businessType.present) {
      map['business_type'] = Variable<String>(businessType.value);
    }
    if (potentialAreaSqm.present) {
      map['potential_area_sqm'] = Variable<double>(potentialAreaSqm.value);
    }
    if (potentialValueIdr.present) {
      map['potential_value_idr'] = Variable<double>(potentialValueIdr.value);
    }
    if (notes.present) {
      map['notes'] = Variable<String>(notes.value);
    }
    if (contacts.present) {
      map['contacts'] = Variable<String>(contacts.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    if (isSynced.present) {
      map['is_synced'] = Variable<bool>(isSynced.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ProspectCustomersCompanion(')
          ..write('id: $id, ')
          ..write('companyName: $companyName, ')
          ..write('address: $address, ')
          ..write('latitude: $latitude, ')
          ..write('longitude: $longitude, ')
          ..write('businessType: $businessType, ')
          ..write('potentialAreaSqm: $potentialAreaSqm, ')
          ..write('potentialValueIdr: $potentialValueIdr, ')
          ..write('notes: $notes, ')
          ..write('contacts: $contacts, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt, ')
          ..write('isSynced: $isSynced, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $CanvassingSessionsTable extends CanvassingSessions
    with TableInfo<$CanvassingSessionsTable, CanvassingSession> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CanvassingSessionsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _prospectIdMeta =
      const VerificationMeta('prospectId');
  @override
  late final GeneratedColumn<String> prospectId = GeneratedColumn<String>(
      'prospect_id', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      defaultConstraints: GeneratedColumn.constraintIsAlways(
          'REFERENCES prospect_customers (id)'));
  static const VerificationMeta _visitDateMeta =
      const VerificationMeta('visitDate');
  @override
  late final GeneratedColumn<DateTime> visitDate = GeneratedColumn<DateTime>(
      'visit_date', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _outcomeMeta =
      const VerificationMeta('outcome');
  @override
  late final GeneratedColumn<String> outcome = GeneratedColumn<String>(
      'outcome', aliasedName, false,
      additionalChecks:
          GeneratedColumn.checkTextLength(minTextLength: 1, maxTextLength: 50),
      type: DriftSqlType.string,
      requiredDuringInsert: true);
  static const VerificationMeta _visitNotesMeta =
      const VerificationMeta('visitNotes');
  @override
  late final GeneratedColumn<String> visitNotes = GeneratedColumn<String>(
      'visit_notes', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _followUpDateMeta =
      const VerificationMeta('followUpDate');
  @override
  late final GeneratedColumn<DateTime> followUpDate = GeneratedColumn<DateTime>(
      'follow_up_date', aliasedName, true,
      type: DriftSqlType.dateTime, requiredDuringInsert: false);
  static const VerificationMeta _photoIdsMeta =
      const VerificationMeta('photoIds');
  @override
  late final GeneratedColumn<String> photoIds = GeneratedColumn<String>(
      'photo_ids', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: false,
      defaultValue: const Constant('[]'));
  static const VerificationMeta _visitDurationMsMeta =
      const VerificationMeta('visitDurationMs');
  @override
  late final GeneratedColumn<int> visitDurationMs = GeneratedColumn<int>(
      'visit_duration_ms', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _isSyncedMeta =
      const VerificationMeta('isSynced');
  @override
  late final GeneratedColumn<bool> isSynced = GeneratedColumn<bool>(
      'is_synced', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('CHECK ("is_synced" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        prospectId,
        visitDate,
        outcome,
        visitNotes,
        followUpDate,
        photoIds,
        visitDurationMs,
        isSynced,
        createdAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'canvassing_sessions';
  @override
  VerificationContext validateIntegrity(Insertable<CanvassingSession> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('prospect_id')) {
      context.handle(
          _prospectIdMeta,
          prospectId.isAcceptableOrUnknown(
              data['prospect_id']!, _prospectIdMeta));
    } else if (isInserting) {
      context.missing(_prospectIdMeta);
    }
    if (data.containsKey('visit_date')) {
      context.handle(_visitDateMeta,
          visitDate.isAcceptableOrUnknown(data['visit_date']!, _visitDateMeta));
    } else if (isInserting) {
      context.missing(_visitDateMeta);
    }
    if (data.containsKey('outcome')) {
      context.handle(_outcomeMeta,
          outcome.isAcceptableOrUnknown(data['outcome']!, _outcomeMeta));
    } else if (isInserting) {
      context.missing(_outcomeMeta);
    }
    if (data.containsKey('visit_notes')) {
      context.handle(
          _visitNotesMeta,
          visitNotes.isAcceptableOrUnknown(
              data['visit_notes']!, _visitNotesMeta));
    } else if (isInserting) {
      context.missing(_visitNotesMeta);
    }
    if (data.containsKey('follow_up_date')) {
      context.handle(
          _followUpDateMeta,
          followUpDate.isAcceptableOrUnknown(
              data['follow_up_date']!, _followUpDateMeta));
    }
    if (data.containsKey('photo_ids')) {
      context.handle(_photoIdsMeta,
          photoIds.isAcceptableOrUnknown(data['photo_ids']!, _photoIdsMeta));
    }
    if (data.containsKey('visit_duration_ms')) {
      context.handle(
          _visitDurationMsMeta,
          visitDurationMs.isAcceptableOrUnknown(
              data['visit_duration_ms']!, _visitDurationMsMeta));
    } else if (isInserting) {
      context.missing(_visitDurationMsMeta);
    }
    if (data.containsKey('is_synced')) {
      context.handle(_isSyncedMeta,
          isSynced.isAcceptableOrUnknown(data['is_synced']!, _isSyncedMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CanvassingSession map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CanvassingSession(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      prospectId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}prospect_id'])!,
      visitDate: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}visit_date'])!,
      outcome: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}outcome'])!,
      visitNotes: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}visit_notes'])!,
      followUpDate: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}follow_up_date']),
      photoIds: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}photo_ids'])!,
      visitDurationMs: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}visit_duration_ms'])!,
      isSynced: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_synced'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  $CanvassingSessionsTable createAlias(String alias) {
    return $CanvassingSessionsTable(attachedDatabase, alias);
  }
}

class CanvassingSession extends DataClass
    implements Insertable<CanvassingSession> {
  final String id;
  final String prospectId;
  final DateTime visitDate;
  final String outcome;
  final String visitNotes;
  final DateTime? followUpDate;
  final String photoIds;
  final int visitDurationMs;
  final bool isSynced;
  final DateTime createdAt;
  const CanvassingSession(
      {required this.id,
      required this.prospectId,
      required this.visitDate,
      required this.outcome,
      required this.visitNotes,
      this.followUpDate,
      required this.photoIds,
      required this.visitDurationMs,
      required this.isSynced,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['prospect_id'] = Variable<String>(prospectId);
    map['visit_date'] = Variable<DateTime>(visitDate);
    map['outcome'] = Variable<String>(outcome);
    map['visit_notes'] = Variable<String>(visitNotes);
    if (!nullToAbsent || followUpDate != null) {
      map['follow_up_date'] = Variable<DateTime>(followUpDate);
    }
    map['photo_ids'] = Variable<String>(photoIds);
    map['visit_duration_ms'] = Variable<int>(visitDurationMs);
    map['is_synced'] = Variable<bool>(isSynced);
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  CanvassingSessionsCompanion toCompanion(bool nullToAbsent) {
    return CanvassingSessionsCompanion(
      id: Value(id),
      prospectId: Value(prospectId),
      visitDate: Value(visitDate),
      outcome: Value(outcome),
      visitNotes: Value(visitNotes),
      followUpDate: followUpDate == null && nullToAbsent
          ? const Value.absent()
          : Value(followUpDate),
      photoIds: Value(photoIds),
      visitDurationMs: Value(visitDurationMs),
      isSynced: Value(isSynced),
      createdAt: Value(createdAt),
    );
  }

  factory CanvassingSession.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CanvassingSession(
      id: serializer.fromJson<String>(json['id']),
      prospectId: serializer.fromJson<String>(json['prospectId']),
      visitDate: serializer.fromJson<DateTime>(json['visitDate']),
      outcome: serializer.fromJson<String>(json['outcome']),
      visitNotes: serializer.fromJson<String>(json['visitNotes']),
      followUpDate: serializer.fromJson<DateTime?>(json['followUpDate']),
      photoIds: serializer.fromJson<String>(json['photoIds']),
      visitDurationMs: serializer.fromJson<int>(json['visitDurationMs']),
      isSynced: serializer.fromJson<bool>(json['isSynced']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'prospectId': serializer.toJson<String>(prospectId),
      'visitDate': serializer.toJson<DateTime>(visitDate),
      'outcome': serializer.toJson<String>(outcome),
      'visitNotes': serializer.toJson<String>(visitNotes),
      'followUpDate': serializer.toJson<DateTime?>(followUpDate),
      'photoIds': serializer.toJson<String>(photoIds),
      'visitDurationMs': serializer.toJson<int>(visitDurationMs),
      'isSynced': serializer.toJson<bool>(isSynced),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  CanvassingSession copyWith(
          {String? id,
          String? prospectId,
          DateTime? visitDate,
          String? outcome,
          String? visitNotes,
          Value<DateTime?> followUpDate = const Value.absent(),
          String? photoIds,
          int? visitDurationMs,
          bool? isSynced,
          DateTime? createdAt}) =>
      CanvassingSession(
        id: id ?? this.id,
        prospectId: prospectId ?? this.prospectId,
        visitDate: visitDate ?? this.visitDate,
        outcome: outcome ?? this.outcome,
        visitNotes: visitNotes ?? this.visitNotes,
        followUpDate:
            followUpDate.present ? followUpDate.value : this.followUpDate,
        photoIds: photoIds ?? this.photoIds,
        visitDurationMs: visitDurationMs ?? this.visitDurationMs,
        isSynced: isSynced ?? this.isSynced,
        createdAt: createdAt ?? this.createdAt,
      );
  CanvassingSession copyWithCompanion(CanvassingSessionsCompanion data) {
    return CanvassingSession(
      id: data.id.present ? data.id.value : this.id,
      prospectId:
          data.prospectId.present ? data.prospectId.value : this.prospectId,
      visitDate: data.visitDate.present ? data.visitDate.value : this.visitDate,
      outcome: data.outcome.present ? data.outcome.value : this.outcome,
      visitNotes:
          data.visitNotes.present ? data.visitNotes.value : this.visitNotes,
      followUpDate: data.followUpDate.present
          ? data.followUpDate.value
          : this.followUpDate,
      photoIds: data.photoIds.present ? data.photoIds.value : this.photoIds,
      visitDurationMs: data.visitDurationMs.present
          ? data.visitDurationMs.value
          : this.visitDurationMs,
      isSynced: data.isSynced.present ? data.isSynced.value : this.isSynced,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CanvassingSession(')
          ..write('id: $id, ')
          ..write('prospectId: $prospectId, ')
          ..write('visitDate: $visitDate, ')
          ..write('outcome: $outcome, ')
          ..write('visitNotes: $visitNotes, ')
          ..write('followUpDate: $followUpDate, ')
          ..write('photoIds: $photoIds, ')
          ..write('visitDurationMs: $visitDurationMs, ')
          ..write('isSynced: $isSynced, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, prospectId, visitDate, outcome,
      visitNotes, followUpDate, photoIds, visitDurationMs, isSynced, createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CanvassingSession &&
          other.id == this.id &&
          other.prospectId == this.prospectId &&
          other.visitDate == this.visitDate &&
          other.outcome == this.outcome &&
          other.visitNotes == this.visitNotes &&
          other.followUpDate == this.followUpDate &&
          other.photoIds == this.photoIds &&
          other.visitDurationMs == this.visitDurationMs &&
          other.isSynced == this.isSynced &&
          other.createdAt == this.createdAt);
}

class CanvassingSessionsCompanion extends UpdateCompanion<CanvassingSession> {
  final Value<String> id;
  final Value<String> prospectId;
  final Value<DateTime> visitDate;
  final Value<String> outcome;
  final Value<String> visitNotes;
  final Value<DateTime?> followUpDate;
  final Value<String> photoIds;
  final Value<int> visitDurationMs;
  final Value<bool> isSynced;
  final Value<DateTime> createdAt;
  final Value<int> rowid;
  const CanvassingSessionsCompanion({
    this.id = const Value.absent(),
    this.prospectId = const Value.absent(),
    this.visitDate = const Value.absent(),
    this.outcome = const Value.absent(),
    this.visitNotes = const Value.absent(),
    this.followUpDate = const Value.absent(),
    this.photoIds = const Value.absent(),
    this.visitDurationMs = const Value.absent(),
    this.isSynced = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CanvassingSessionsCompanion.insert({
    required String id,
    required String prospectId,
    required DateTime visitDate,
    required String outcome,
    required String visitNotes,
    this.followUpDate = const Value.absent(),
    this.photoIds = const Value.absent(),
    required int visitDurationMs,
    this.isSynced = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        prospectId = Value(prospectId),
        visitDate = Value(visitDate),
        outcome = Value(outcome),
        visitNotes = Value(visitNotes),
        visitDurationMs = Value(visitDurationMs);
  static Insertable<CanvassingSession> custom({
    Expression<String>? id,
    Expression<String>? prospectId,
    Expression<DateTime>? visitDate,
    Expression<String>? outcome,
    Expression<String>? visitNotes,
    Expression<DateTime>? followUpDate,
    Expression<String>? photoIds,
    Expression<int>? visitDurationMs,
    Expression<bool>? isSynced,
    Expression<DateTime>? createdAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (prospectId != null) 'prospect_id': prospectId,
      if (visitDate != null) 'visit_date': visitDate,
      if (outcome != null) 'outcome': outcome,
      if (visitNotes != null) 'visit_notes': visitNotes,
      if (followUpDate != null) 'follow_up_date': followUpDate,
      if (photoIds != null) 'photo_ids': photoIds,
      if (visitDurationMs != null) 'visit_duration_ms': visitDurationMs,
      if (isSynced != null) 'is_synced': isSynced,
      if (createdAt != null) 'created_at': createdAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CanvassingSessionsCompanion copyWith(
      {Value<String>? id,
      Value<String>? prospectId,
      Value<DateTime>? visitDate,
      Value<String>? outcome,
      Value<String>? visitNotes,
      Value<DateTime?>? followUpDate,
      Value<String>? photoIds,
      Value<int>? visitDurationMs,
      Value<bool>? isSynced,
      Value<DateTime>? createdAt,
      Value<int>? rowid}) {
    return CanvassingSessionsCompanion(
      id: id ?? this.id,
      prospectId: prospectId ?? this.prospectId,
      visitDate: visitDate ?? this.visitDate,
      outcome: outcome ?? this.outcome,
      visitNotes: visitNotes ?? this.visitNotes,
      followUpDate: followUpDate ?? this.followUpDate,
      photoIds: photoIds ?? this.photoIds,
      visitDurationMs: visitDurationMs ?? this.visitDurationMs,
      isSynced: isSynced ?? this.isSynced,
      createdAt: createdAt ?? this.createdAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (prospectId.present) {
      map['prospect_id'] = Variable<String>(prospectId.value);
    }
    if (visitDate.present) {
      map['visit_date'] = Variable<DateTime>(visitDate.value);
    }
    if (outcome.present) {
      map['outcome'] = Variable<String>(outcome.value);
    }
    if (visitNotes.present) {
      map['visit_notes'] = Variable<String>(visitNotes.value);
    }
    if (followUpDate.present) {
      map['follow_up_date'] = Variable<DateTime>(followUpDate.value);
    }
    if (photoIds.present) {
      map['photo_ids'] = Variable<String>(photoIds.value);
    }
    if (visitDurationMs.present) {
      map['visit_duration_ms'] = Variable<int>(visitDurationMs.value);
    }
    if (isSynced.present) {
      map['is_synced'] = Variable<bool>(isSynced.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CanvassingSessionsCompanion(')
          ..write('id: $id, ')
          ..write('prospectId: $prospectId, ')
          ..write('visitDate: $visitDate, ')
          ..write('outcome: $outcome, ')
          ..write('visitNotes: $visitNotes, ')
          ..write('followUpDate: $followUpDate, ')
          ..write('photoIds: $photoIds, ')
          ..write('visitDurationMs: $visitDurationMs, ')
          ..write('isSynced: $isSynced, ')
          ..write('createdAt: $createdAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $CanvassingPhotosTable extends CanvassingPhotos
    with TableInfo<$CanvassingPhotosTable, CanvassingPhoto> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CanvassingPhotosTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _sessionIdMeta =
      const VerificationMeta('sessionId');
  @override
  late final GeneratedColumn<String> sessionId = GeneratedColumn<String>(
      'session_id', aliasedName, false,
      type: DriftSqlType.string,
      requiredDuringInsert: true,
      defaultConstraints: GeneratedColumn.constraintIsAlways(
          'REFERENCES canvassing_sessions (id)'));
  static const VerificationMeta _filePathMeta =
      const VerificationMeta('filePath');
  @override
  late final GeneratedColumn<String> filePath = GeneratedColumn<String>(
      'file_path', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _fileSizeBytesMeta =
      const VerificationMeta('fileSizeBytes');
  @override
  late final GeneratedColumn<int> fileSizeBytes = GeneratedColumn<int>(
      'file_size_bytes', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _capturedAtMeta =
      const VerificationMeta('capturedAt');
  @override
  late final GeneratedColumn<DateTime> capturedAt = GeneratedColumn<DateTime>(
      'captured_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _captionMeta =
      const VerificationMeta('caption');
  @override
  late final GeneratedColumn<String> caption = GeneratedColumn<String>(
      'caption', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _isSyncedMeta =
      const VerificationMeta('isSynced');
  @override
  late final GeneratedColumn<bool> isSynced = GeneratedColumn<bool>(
      'is_synced', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('CHECK ("is_synced" IN (0, 1))'),
      defaultValue: const Constant(false));
  static const VerificationMeta _syncedUrlMeta =
      const VerificationMeta('syncedUrl');
  @override
  late final GeneratedColumn<String> syncedUrl = GeneratedColumn<String>(
      'synced_url', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        sessionId,
        filePath,
        fileSizeBytes,
        capturedAt,
        caption,
        isSynced,
        syncedUrl,
        createdAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'canvassing_photos';
  @override
  VerificationContext validateIntegrity(Insertable<CanvassingPhoto> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('session_id')) {
      context.handle(_sessionIdMeta,
          sessionId.isAcceptableOrUnknown(data['session_id']!, _sessionIdMeta));
    } else if (isInserting) {
      context.missing(_sessionIdMeta);
    }
    if (data.containsKey('file_path')) {
      context.handle(_filePathMeta,
          filePath.isAcceptableOrUnknown(data['file_path']!, _filePathMeta));
    } else if (isInserting) {
      context.missing(_filePathMeta);
    }
    if (data.containsKey('file_size_bytes')) {
      context.handle(
          _fileSizeBytesMeta,
          fileSizeBytes.isAcceptableOrUnknown(
              data['file_size_bytes']!, _fileSizeBytesMeta));
    } else if (isInserting) {
      context.missing(_fileSizeBytesMeta);
    }
    if (data.containsKey('captured_at')) {
      context.handle(
          _capturedAtMeta,
          capturedAt.isAcceptableOrUnknown(
              data['captured_at']!, _capturedAtMeta));
    } else if (isInserting) {
      context.missing(_capturedAtMeta);
    }
    if (data.containsKey('caption')) {
      context.handle(_captionMeta,
          caption.isAcceptableOrUnknown(data['caption']!, _captionMeta));
    }
    if (data.containsKey('is_synced')) {
      context.handle(_isSyncedMeta,
          isSynced.isAcceptableOrUnknown(data['is_synced']!, _isSyncedMeta));
    }
    if (data.containsKey('synced_url')) {
      context.handle(_syncedUrlMeta,
          syncedUrl.isAcceptableOrUnknown(data['synced_url']!, _syncedUrlMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CanvassingPhoto map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CanvassingPhoto(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      sessionId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}session_id'])!,
      filePath: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}file_path'])!,
      fileSizeBytes: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}file_size_bytes'])!,
      capturedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}captured_at'])!,
      caption: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}caption']),
      isSynced: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_synced'])!,
      syncedUrl: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}synced_url']),
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  $CanvassingPhotosTable createAlias(String alias) {
    return $CanvassingPhotosTable(attachedDatabase, alias);
  }
}

class CanvassingPhoto extends DataClass implements Insertable<CanvassingPhoto> {
  final String id;
  final String sessionId;
  final String filePath;
  final int fileSizeBytes;
  final DateTime capturedAt;
  final String? caption;
  final bool isSynced;
  final String? syncedUrl;
  final DateTime createdAt;
  const CanvassingPhoto(
      {required this.id,
      required this.sessionId,
      required this.filePath,
      required this.fileSizeBytes,
      required this.capturedAt,
      this.caption,
      required this.isSynced,
      this.syncedUrl,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['session_id'] = Variable<String>(sessionId);
    map['file_path'] = Variable<String>(filePath);
    map['file_size_bytes'] = Variable<int>(fileSizeBytes);
    map['captured_at'] = Variable<DateTime>(capturedAt);
    if (!nullToAbsent || caption != null) {
      map['caption'] = Variable<String>(caption);
    }
    map['is_synced'] = Variable<bool>(isSynced);
    if (!nullToAbsent || syncedUrl != null) {
      map['synced_url'] = Variable<String>(syncedUrl);
    }
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  CanvassingPhotosCompanion toCompanion(bool nullToAbsent) {
    return CanvassingPhotosCompanion(
      id: Value(id),
      sessionId: Value(sessionId),
      filePath: Value(filePath),
      fileSizeBytes: Value(fileSizeBytes),
      capturedAt: Value(capturedAt),
      caption: caption == null && nullToAbsent
          ? const Value.absent()
          : Value(caption),
      isSynced: Value(isSynced),
      syncedUrl: syncedUrl == null && nullToAbsent
          ? const Value.absent()
          : Value(syncedUrl),
      createdAt: Value(createdAt),
    );
  }

  factory CanvassingPhoto.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CanvassingPhoto(
      id: serializer.fromJson<String>(json['id']),
      sessionId: serializer.fromJson<String>(json['sessionId']),
      filePath: serializer.fromJson<String>(json['filePath']),
      fileSizeBytes: serializer.fromJson<int>(json['fileSizeBytes']),
      capturedAt: serializer.fromJson<DateTime>(json['capturedAt']),
      caption: serializer.fromJson<String?>(json['caption']),
      isSynced: serializer.fromJson<bool>(json['isSynced']),
      syncedUrl: serializer.fromJson<String?>(json['syncedUrl']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'sessionId': serializer.toJson<String>(sessionId),
      'filePath': serializer.toJson<String>(filePath),
      'fileSizeBytes': serializer.toJson<int>(fileSizeBytes),
      'capturedAt': serializer.toJson<DateTime>(capturedAt),
      'caption': serializer.toJson<String?>(caption),
      'isSynced': serializer.toJson<bool>(isSynced),
      'syncedUrl': serializer.toJson<String?>(syncedUrl),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  CanvassingPhoto copyWith(
          {String? id,
          String? sessionId,
          String? filePath,
          int? fileSizeBytes,
          DateTime? capturedAt,
          Value<String?> caption = const Value.absent(),
          bool? isSynced,
          Value<String?> syncedUrl = const Value.absent(),
          DateTime? createdAt}) =>
      CanvassingPhoto(
        id: id ?? this.id,
        sessionId: sessionId ?? this.sessionId,
        filePath: filePath ?? this.filePath,
        fileSizeBytes: fileSizeBytes ?? this.fileSizeBytes,
        capturedAt: capturedAt ?? this.capturedAt,
        caption: caption.present ? caption.value : this.caption,
        isSynced: isSynced ?? this.isSynced,
        syncedUrl: syncedUrl.present ? syncedUrl.value : this.syncedUrl,
        createdAt: createdAt ?? this.createdAt,
      );
  CanvassingPhoto copyWithCompanion(CanvassingPhotosCompanion data) {
    return CanvassingPhoto(
      id: data.id.present ? data.id.value : this.id,
      sessionId: data.sessionId.present ? data.sessionId.value : this.sessionId,
      filePath: data.filePath.present ? data.filePath.value : this.filePath,
      fileSizeBytes: data.fileSizeBytes.present
          ? data.fileSizeBytes.value
          : this.fileSizeBytes,
      capturedAt:
          data.capturedAt.present ? data.capturedAt.value : this.capturedAt,
      caption: data.caption.present ? data.caption.value : this.caption,
      isSynced: data.isSynced.present ? data.isSynced.value : this.isSynced,
      syncedUrl: data.syncedUrl.present ? data.syncedUrl.value : this.syncedUrl,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CanvassingPhoto(')
          ..write('id: $id, ')
          ..write('sessionId: $sessionId, ')
          ..write('filePath: $filePath, ')
          ..write('fileSizeBytes: $fileSizeBytes, ')
          ..write('capturedAt: $capturedAt, ')
          ..write('caption: $caption, ')
          ..write('isSynced: $isSynced, ')
          ..write('syncedUrl: $syncedUrl, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, sessionId, filePath, fileSizeBytes,
      capturedAt, caption, isSynced, syncedUrl, createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CanvassingPhoto &&
          other.id == this.id &&
          other.sessionId == this.sessionId &&
          other.filePath == this.filePath &&
          other.fileSizeBytes == this.fileSizeBytes &&
          other.capturedAt == this.capturedAt &&
          other.caption == this.caption &&
          other.isSynced == this.isSynced &&
          other.syncedUrl == this.syncedUrl &&
          other.createdAt == this.createdAt);
}

class CanvassingPhotosCompanion extends UpdateCompanion<CanvassingPhoto> {
  final Value<String> id;
  final Value<String> sessionId;
  final Value<String> filePath;
  final Value<int> fileSizeBytes;
  final Value<DateTime> capturedAt;
  final Value<String?> caption;
  final Value<bool> isSynced;
  final Value<String?> syncedUrl;
  final Value<DateTime> createdAt;
  final Value<int> rowid;
  const CanvassingPhotosCompanion({
    this.id = const Value.absent(),
    this.sessionId = const Value.absent(),
    this.filePath = const Value.absent(),
    this.fileSizeBytes = const Value.absent(),
    this.capturedAt = const Value.absent(),
    this.caption = const Value.absent(),
    this.isSynced = const Value.absent(),
    this.syncedUrl = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CanvassingPhotosCompanion.insert({
    required String id,
    required String sessionId,
    required String filePath,
    required int fileSizeBytes,
    required DateTime capturedAt,
    this.caption = const Value.absent(),
    this.isSynced = const Value.absent(),
    this.syncedUrl = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        sessionId = Value(sessionId),
        filePath = Value(filePath),
        fileSizeBytes = Value(fileSizeBytes),
        capturedAt = Value(capturedAt);
  static Insertable<CanvassingPhoto> custom({
    Expression<String>? id,
    Expression<String>? sessionId,
    Expression<String>? filePath,
    Expression<int>? fileSizeBytes,
    Expression<DateTime>? capturedAt,
    Expression<String>? caption,
    Expression<bool>? isSynced,
    Expression<String>? syncedUrl,
    Expression<DateTime>? createdAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (sessionId != null) 'session_id': sessionId,
      if (filePath != null) 'file_path': filePath,
      if (fileSizeBytes != null) 'file_size_bytes': fileSizeBytes,
      if (capturedAt != null) 'captured_at': capturedAt,
      if (caption != null) 'caption': caption,
      if (isSynced != null) 'is_synced': isSynced,
      if (syncedUrl != null) 'synced_url': syncedUrl,
      if (createdAt != null) 'created_at': createdAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CanvassingPhotosCompanion copyWith(
      {Value<String>? id,
      Value<String>? sessionId,
      Value<String>? filePath,
      Value<int>? fileSizeBytes,
      Value<DateTime>? capturedAt,
      Value<String?>? caption,
      Value<bool>? isSynced,
      Value<String?>? syncedUrl,
      Value<DateTime>? createdAt,
      Value<int>? rowid}) {
    return CanvassingPhotosCompanion(
      id: id ?? this.id,
      sessionId: sessionId ?? this.sessionId,
      filePath: filePath ?? this.filePath,
      fileSizeBytes: fileSizeBytes ?? this.fileSizeBytes,
      capturedAt: capturedAt ?? this.capturedAt,
      caption: caption ?? this.caption,
      isSynced: isSynced ?? this.isSynced,
      syncedUrl: syncedUrl ?? this.syncedUrl,
      createdAt: createdAt ?? this.createdAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (sessionId.present) {
      map['session_id'] = Variable<String>(sessionId.value);
    }
    if (filePath.present) {
      map['file_path'] = Variable<String>(filePath.value);
    }
    if (fileSizeBytes.present) {
      map['file_size_bytes'] = Variable<int>(fileSizeBytes.value);
    }
    if (capturedAt.present) {
      map['captured_at'] = Variable<DateTime>(capturedAt.value);
    }
    if (caption.present) {
      map['caption'] = Variable<String>(caption.value);
    }
    if (isSynced.present) {
      map['is_synced'] = Variable<bool>(isSynced.value);
    }
    if (syncedUrl.present) {
      map['synced_url'] = Variable<String>(syncedUrl.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CanvassingPhotosCompanion(')
          ..write('id: $id, ')
          ..write('sessionId: $sessionId, ')
          ..write('filePath: $filePath, ')
          ..write('fileSizeBytes: $fileSizeBytes, ')
          ..write('capturedAt: $capturedAt, ')
          ..write('caption: $caption, ')
          ..write('isSynced: $isSynced, ')
          ..write('syncedUrl: $syncedUrl, ')
          ..write('createdAt: $createdAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $MaterialProductsTable extends MaterialProducts
    with TableInfo<$MaterialProductsTable, MaterialProduct> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MaterialProductsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _codeMeta = const VerificationMeta('code');
  @override
  late final GeneratedColumn<String> code = GeneratedColumn<String>(
      'code', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
      'name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _categoryMeta =
      const VerificationMeta('category');
  @override
  late final GeneratedColumn<String> category = GeneratedColumn<String>(
      'category', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _unitMeta = const VerificationMeta('unit');
  @override
  late final GeneratedColumn<String> unit = GeneratedColumn<String>(
      'unit', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _basePriceMeta =
      const VerificationMeta('basePrice');
  @override
  late final GeneratedColumn<double> basePrice = GeneratedColumn<double>(
      'base_price', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _priceTiersMeta =
      const VerificationMeta('priceTiers');
  @override
  late final GeneratedColumn<String> priceTiers = GeneratedColumn<String>(
      'price_tiers', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _descriptionMeta =
      const VerificationMeta('description');
  @override
  late final GeneratedColumn<String> description = GeneratedColumn<String>(
      'description', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _specificationsMeta =
      const VerificationMeta('specifications');
  @override
  late final GeneratedColumn<String> specifications = GeneratedColumn<String>(
      'specifications', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _imageUrlsMeta =
      const VerificationMeta('imageUrls');
  @override
  late final GeneratedColumn<String> imageUrls = GeneratedColumn<String>(
      'image_urls', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _isActiveMeta =
      const VerificationMeta('isActive');
  @override
  late final GeneratedColumn<bool> isActive = GeneratedColumn<bool>(
      'is_active', aliasedName, false,
      type: DriftSqlType.bool,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('CHECK ("is_active" IN (0, 1))'),
      defaultValue: const Constant(true));
  static const VerificationMeta _stockLevelMeta =
      const VerificationMeta('stockLevel');
  @override
  late final GeneratedColumn<int> stockLevel = GeneratedColumn<int>(
      'stock_level', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _lastSyncedAtMeta =
      const VerificationMeta('lastSyncedAt');
  @override
  late final GeneratedColumn<DateTime> lastSyncedAt = GeneratedColumn<DateTime>(
      'last_synced_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _lastViewedAtMeta =
      const VerificationMeta('lastViewedAt');
  @override
  late final GeneratedColumn<DateTime> lastViewedAt = GeneratedColumn<DateTime>(
      'last_viewed_at', aliasedName, true,
      type: DriftSqlType.dateTime, requiredDuringInsert: false);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        code,
        name,
        category,
        unit,
        basePrice,
        priceTiers,
        description,
        specifications,
        imageUrls,
        isActive,
        stockLevel,
        lastSyncedAt,
        lastViewedAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'material_products';
  @override
  VerificationContext validateIntegrity(Insertable<MaterialProduct> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('code')) {
      context.handle(
          _codeMeta, code.isAcceptableOrUnknown(data['code']!, _codeMeta));
    } else if (isInserting) {
      context.missing(_codeMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
          _nameMeta, name.isAcceptableOrUnknown(data['name']!, _nameMeta));
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('category')) {
      context.handle(_categoryMeta,
          category.isAcceptableOrUnknown(data['category']!, _categoryMeta));
    } else if (isInserting) {
      context.missing(_categoryMeta);
    }
    if (data.containsKey('unit')) {
      context.handle(
          _unitMeta, unit.isAcceptableOrUnknown(data['unit']!, _unitMeta));
    } else if (isInserting) {
      context.missing(_unitMeta);
    }
    if (data.containsKey('base_price')) {
      context.handle(_basePriceMeta,
          basePrice.isAcceptableOrUnknown(data['base_price']!, _basePriceMeta));
    } else if (isInserting) {
      context.missing(_basePriceMeta);
    }
    if (data.containsKey('price_tiers')) {
      context.handle(
          _priceTiersMeta,
          priceTiers.isAcceptableOrUnknown(
              data['price_tiers']!, _priceTiersMeta));
    } else if (isInserting) {
      context.missing(_priceTiersMeta);
    }
    if (data.containsKey('description')) {
      context.handle(
          _descriptionMeta,
          description.isAcceptableOrUnknown(
              data['description']!, _descriptionMeta));
    } else if (isInserting) {
      context.missing(_descriptionMeta);
    }
    if (data.containsKey('specifications')) {
      context.handle(
          _specificationsMeta,
          specifications.isAcceptableOrUnknown(
              data['specifications']!, _specificationsMeta));
    } else if (isInserting) {
      context.missing(_specificationsMeta);
    }
    if (data.containsKey('image_urls')) {
      context.handle(_imageUrlsMeta,
          imageUrls.isAcceptableOrUnknown(data['image_urls']!, _imageUrlsMeta));
    } else if (isInserting) {
      context.missing(_imageUrlsMeta);
    }
    if (data.containsKey('is_active')) {
      context.handle(_isActiveMeta,
          isActive.isAcceptableOrUnknown(data['is_active']!, _isActiveMeta));
    }
    if (data.containsKey('stock_level')) {
      context.handle(
          _stockLevelMeta,
          stockLevel.isAcceptableOrUnknown(
              data['stock_level']!, _stockLevelMeta));
    }
    if (data.containsKey('last_synced_at')) {
      context.handle(
          _lastSyncedAtMeta,
          lastSyncedAt.isAcceptableOrUnknown(
              data['last_synced_at']!, _lastSyncedAtMeta));
    } else if (isInserting) {
      context.missing(_lastSyncedAtMeta);
    }
    if (data.containsKey('last_viewed_at')) {
      context.handle(
          _lastViewedAtMeta,
          lastViewedAt.isAcceptableOrUnknown(
              data['last_viewed_at']!, _lastViewedAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MaterialProduct map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MaterialProduct(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      code: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}code'])!,
      name: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}name'])!,
      category: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}category'])!,
      unit: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}unit'])!,
      basePrice: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}base_price'])!,
      priceTiers: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}price_tiers'])!,
      description: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}description'])!,
      specifications: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}specifications'])!,
      imageUrls: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}image_urls'])!,
      isActive: attachedDatabase.typeMapping
          .read(DriftSqlType.bool, data['${effectivePrefix}is_active'])!,
      stockLevel: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}stock_level'])!,
      lastSyncedAt: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}last_synced_at'])!,
      lastViewedAt: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}last_viewed_at']),
    );
  }

  @override
  $MaterialProductsTable createAlias(String alias) {
    return $MaterialProductsTable(attachedDatabase, alias);
  }
}

class MaterialProduct extends DataClass implements Insertable<MaterialProduct> {
  final String id;
  final String code;
  final String name;
  final String category;
  final String unit;
  final double basePrice;
  final String priceTiers;
  final String description;
  final String specifications;
  final String imageUrls;
  final bool isActive;
  final int stockLevel;
  final DateTime lastSyncedAt;
  final DateTime? lastViewedAt;
  const MaterialProduct(
      {required this.id,
      required this.code,
      required this.name,
      required this.category,
      required this.unit,
      required this.basePrice,
      required this.priceTiers,
      required this.description,
      required this.specifications,
      required this.imageUrls,
      required this.isActive,
      required this.stockLevel,
      required this.lastSyncedAt,
      this.lastViewedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['code'] = Variable<String>(code);
    map['name'] = Variable<String>(name);
    map['category'] = Variable<String>(category);
    map['unit'] = Variable<String>(unit);
    map['base_price'] = Variable<double>(basePrice);
    map['price_tiers'] = Variable<String>(priceTiers);
    map['description'] = Variable<String>(description);
    map['specifications'] = Variable<String>(specifications);
    map['image_urls'] = Variable<String>(imageUrls);
    map['is_active'] = Variable<bool>(isActive);
    map['stock_level'] = Variable<int>(stockLevel);
    map['last_synced_at'] = Variable<DateTime>(lastSyncedAt);
    if (!nullToAbsent || lastViewedAt != null) {
      map['last_viewed_at'] = Variable<DateTime>(lastViewedAt);
    }
    return map;
  }

  MaterialProductsCompanion toCompanion(bool nullToAbsent) {
    return MaterialProductsCompanion(
      id: Value(id),
      code: Value(code),
      name: Value(name),
      category: Value(category),
      unit: Value(unit),
      basePrice: Value(basePrice),
      priceTiers: Value(priceTiers),
      description: Value(description),
      specifications: Value(specifications),
      imageUrls: Value(imageUrls),
      isActive: Value(isActive),
      stockLevel: Value(stockLevel),
      lastSyncedAt: Value(lastSyncedAt),
      lastViewedAt: lastViewedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(lastViewedAt),
    );
  }

  factory MaterialProduct.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MaterialProduct(
      id: serializer.fromJson<String>(json['id']),
      code: serializer.fromJson<String>(json['code']),
      name: serializer.fromJson<String>(json['name']),
      category: serializer.fromJson<String>(json['category']),
      unit: serializer.fromJson<String>(json['unit']),
      basePrice: serializer.fromJson<double>(json['basePrice']),
      priceTiers: serializer.fromJson<String>(json['priceTiers']),
      description: serializer.fromJson<String>(json['description']),
      specifications: serializer.fromJson<String>(json['specifications']),
      imageUrls: serializer.fromJson<String>(json['imageUrls']),
      isActive: serializer.fromJson<bool>(json['isActive']),
      stockLevel: serializer.fromJson<int>(json['stockLevel']),
      lastSyncedAt: serializer.fromJson<DateTime>(json['lastSyncedAt']),
      lastViewedAt: serializer.fromJson<DateTime?>(json['lastViewedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'code': serializer.toJson<String>(code),
      'name': serializer.toJson<String>(name),
      'category': serializer.toJson<String>(category),
      'unit': serializer.toJson<String>(unit),
      'basePrice': serializer.toJson<double>(basePrice),
      'priceTiers': serializer.toJson<String>(priceTiers),
      'description': serializer.toJson<String>(description),
      'specifications': serializer.toJson<String>(specifications),
      'imageUrls': serializer.toJson<String>(imageUrls),
      'isActive': serializer.toJson<bool>(isActive),
      'stockLevel': serializer.toJson<int>(stockLevel),
      'lastSyncedAt': serializer.toJson<DateTime>(lastSyncedAt),
      'lastViewedAt': serializer.toJson<DateTime?>(lastViewedAt),
    };
  }

  MaterialProduct copyWith(
          {String? id,
          String? code,
          String? name,
          String? category,
          String? unit,
          double? basePrice,
          String? priceTiers,
          String? description,
          String? specifications,
          String? imageUrls,
          bool? isActive,
          int? stockLevel,
          DateTime? lastSyncedAt,
          Value<DateTime?> lastViewedAt = const Value.absent()}) =>
      MaterialProduct(
        id: id ?? this.id,
        code: code ?? this.code,
        name: name ?? this.name,
        category: category ?? this.category,
        unit: unit ?? this.unit,
        basePrice: basePrice ?? this.basePrice,
        priceTiers: priceTiers ?? this.priceTiers,
        description: description ?? this.description,
        specifications: specifications ?? this.specifications,
        imageUrls: imageUrls ?? this.imageUrls,
        isActive: isActive ?? this.isActive,
        stockLevel: stockLevel ?? this.stockLevel,
        lastSyncedAt: lastSyncedAt ?? this.lastSyncedAt,
        lastViewedAt:
            lastViewedAt.present ? lastViewedAt.value : this.lastViewedAt,
      );
  MaterialProduct copyWithCompanion(MaterialProductsCompanion data) {
    return MaterialProduct(
      id: data.id.present ? data.id.value : this.id,
      code: data.code.present ? data.code.value : this.code,
      name: data.name.present ? data.name.value : this.name,
      category: data.category.present ? data.category.value : this.category,
      unit: data.unit.present ? data.unit.value : this.unit,
      basePrice: data.basePrice.present ? data.basePrice.value : this.basePrice,
      priceTiers:
          data.priceTiers.present ? data.priceTiers.value : this.priceTiers,
      description:
          data.description.present ? data.description.value : this.description,
      specifications: data.specifications.present
          ? data.specifications.value
          : this.specifications,
      imageUrls: data.imageUrls.present ? data.imageUrls.value : this.imageUrls,
      isActive: data.isActive.present ? data.isActive.value : this.isActive,
      stockLevel:
          data.stockLevel.present ? data.stockLevel.value : this.stockLevel,
      lastSyncedAt: data.lastSyncedAt.present
          ? data.lastSyncedAt.value
          : this.lastSyncedAt,
      lastViewedAt: data.lastViewedAt.present
          ? data.lastViewedAt.value
          : this.lastViewedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MaterialProduct(')
          ..write('id: $id, ')
          ..write('code: $code, ')
          ..write('name: $name, ')
          ..write('category: $category, ')
          ..write('unit: $unit, ')
          ..write('basePrice: $basePrice, ')
          ..write('priceTiers: $priceTiers, ')
          ..write('description: $description, ')
          ..write('specifications: $specifications, ')
          ..write('imageUrls: $imageUrls, ')
          ..write('isActive: $isActive, ')
          ..write('stockLevel: $stockLevel, ')
          ..write('lastSyncedAt: $lastSyncedAt, ')
          ..write('lastViewedAt: $lastViewedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
      id,
      code,
      name,
      category,
      unit,
      basePrice,
      priceTiers,
      description,
      specifications,
      imageUrls,
      isActive,
      stockLevel,
      lastSyncedAt,
      lastViewedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MaterialProduct &&
          other.id == this.id &&
          other.code == this.code &&
          other.name == this.name &&
          other.category == this.category &&
          other.unit == this.unit &&
          other.basePrice == this.basePrice &&
          other.priceTiers == this.priceTiers &&
          other.description == this.description &&
          other.specifications == this.specifications &&
          other.imageUrls == this.imageUrls &&
          other.isActive == this.isActive &&
          other.stockLevel == this.stockLevel &&
          other.lastSyncedAt == this.lastSyncedAt &&
          other.lastViewedAt == this.lastViewedAt);
}

class MaterialProductsCompanion extends UpdateCompanion<MaterialProduct> {
  final Value<String> id;
  final Value<String> code;
  final Value<String> name;
  final Value<String> category;
  final Value<String> unit;
  final Value<double> basePrice;
  final Value<String> priceTiers;
  final Value<String> description;
  final Value<String> specifications;
  final Value<String> imageUrls;
  final Value<bool> isActive;
  final Value<int> stockLevel;
  final Value<DateTime> lastSyncedAt;
  final Value<DateTime?> lastViewedAt;
  final Value<int> rowid;
  const MaterialProductsCompanion({
    this.id = const Value.absent(),
    this.code = const Value.absent(),
    this.name = const Value.absent(),
    this.category = const Value.absent(),
    this.unit = const Value.absent(),
    this.basePrice = const Value.absent(),
    this.priceTiers = const Value.absent(),
    this.description = const Value.absent(),
    this.specifications = const Value.absent(),
    this.imageUrls = const Value.absent(),
    this.isActive = const Value.absent(),
    this.stockLevel = const Value.absent(),
    this.lastSyncedAt = const Value.absent(),
    this.lastViewedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  MaterialProductsCompanion.insert({
    required String id,
    required String code,
    required String name,
    required String category,
    required String unit,
    required double basePrice,
    required String priceTiers,
    required String description,
    required String specifications,
    required String imageUrls,
    this.isActive = const Value.absent(),
    this.stockLevel = const Value.absent(),
    required DateTime lastSyncedAt,
    this.lastViewedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        code = Value(code),
        name = Value(name),
        category = Value(category),
        unit = Value(unit),
        basePrice = Value(basePrice),
        priceTiers = Value(priceTiers),
        description = Value(description),
        specifications = Value(specifications),
        imageUrls = Value(imageUrls),
        lastSyncedAt = Value(lastSyncedAt);
  static Insertable<MaterialProduct> custom({
    Expression<String>? id,
    Expression<String>? code,
    Expression<String>? name,
    Expression<String>? category,
    Expression<String>? unit,
    Expression<double>? basePrice,
    Expression<String>? priceTiers,
    Expression<String>? description,
    Expression<String>? specifications,
    Expression<String>? imageUrls,
    Expression<bool>? isActive,
    Expression<int>? stockLevel,
    Expression<DateTime>? lastSyncedAt,
    Expression<DateTime>? lastViewedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (code != null) 'code': code,
      if (name != null) 'name': name,
      if (category != null) 'category': category,
      if (unit != null) 'unit': unit,
      if (basePrice != null) 'base_price': basePrice,
      if (priceTiers != null) 'price_tiers': priceTiers,
      if (description != null) 'description': description,
      if (specifications != null) 'specifications': specifications,
      if (imageUrls != null) 'image_urls': imageUrls,
      if (isActive != null) 'is_active': isActive,
      if (stockLevel != null) 'stock_level': stockLevel,
      if (lastSyncedAt != null) 'last_synced_at': lastSyncedAt,
      if (lastViewedAt != null) 'last_viewed_at': lastViewedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  MaterialProductsCompanion copyWith(
      {Value<String>? id,
      Value<String>? code,
      Value<String>? name,
      Value<String>? category,
      Value<String>? unit,
      Value<double>? basePrice,
      Value<String>? priceTiers,
      Value<String>? description,
      Value<String>? specifications,
      Value<String>? imageUrls,
      Value<bool>? isActive,
      Value<int>? stockLevel,
      Value<DateTime>? lastSyncedAt,
      Value<DateTime?>? lastViewedAt,
      Value<int>? rowid}) {
    return MaterialProductsCompanion(
      id: id ?? this.id,
      code: code ?? this.code,
      name: name ?? this.name,
      category: category ?? this.category,
      unit: unit ?? this.unit,
      basePrice: basePrice ?? this.basePrice,
      priceTiers: priceTiers ?? this.priceTiers,
      description: description ?? this.description,
      specifications: specifications ?? this.specifications,
      imageUrls: imageUrls ?? this.imageUrls,
      isActive: isActive ?? this.isActive,
      stockLevel: stockLevel ?? this.stockLevel,
      lastSyncedAt: lastSyncedAt ?? this.lastSyncedAt,
      lastViewedAt: lastViewedAt ?? this.lastViewedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (code.present) {
      map['code'] = Variable<String>(code.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (category.present) {
      map['category'] = Variable<String>(category.value);
    }
    if (unit.present) {
      map['unit'] = Variable<String>(unit.value);
    }
    if (basePrice.present) {
      map['base_price'] = Variable<double>(basePrice.value);
    }
    if (priceTiers.present) {
      map['price_tiers'] = Variable<String>(priceTiers.value);
    }
    if (description.present) {
      map['description'] = Variable<String>(description.value);
    }
    if (specifications.present) {
      map['specifications'] = Variable<String>(specifications.value);
    }
    if (imageUrls.present) {
      map['image_urls'] = Variable<String>(imageUrls.value);
    }
    if (isActive.present) {
      map['is_active'] = Variable<bool>(isActive.value);
    }
    if (stockLevel.present) {
      map['stock_level'] = Variable<int>(stockLevel.value);
    }
    if (lastSyncedAt.present) {
      map['last_synced_at'] = Variable<DateTime>(lastSyncedAt.value);
    }
    if (lastViewedAt.present) {
      map['last_viewed_at'] = Variable<DateTime>(lastViewedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MaterialProductsCompanion(')
          ..write('id: $id, ')
          ..write('code: $code, ')
          ..write('name: $name, ')
          ..write('category: $category, ')
          ..write('unit: $unit, ')
          ..write('basePrice: $basePrice, ')
          ..write('priceTiers: $priceTiers, ')
          ..write('description: $description, ')
          ..write('specifications: $specifications, ')
          ..write('imageUrls: $imageUrls, ')
          ..write('isActive: $isActive, ')
          ..write('stockLevel: $stockLevel, ')
          ..write('lastSyncedAt: $lastSyncedAt, ')
          ..write('lastViewedAt: $lastViewedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $MaterialCategoriesTable extends MaterialCategories
    with TableInfo<$MaterialCategoriesTable, MaterialCategory> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $MaterialCategoriesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
      'name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _parentIdMeta =
      const VerificationMeta('parentId');
  @override
  late final GeneratedColumn<String> parentId = GeneratedColumn<String>(
      'parent_id', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _productCountMeta =
      const VerificationMeta('productCount');
  @override
  late final GeneratedColumn<int> productCount = GeneratedColumn<int>(
      'product_count', aliasedName, false,
      type: DriftSqlType.int, requiredDuringInsert: true);
  static const VerificationMeta _iconNameMeta =
      const VerificationMeta('iconName');
  @override
  late final GeneratedColumn<String> iconName = GeneratedColumn<String>(
      'icon_name', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns =>
      [id, name, parentId, productCount, iconName];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'material_categories';
  @override
  VerificationContext validateIntegrity(Insertable<MaterialCategory> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('name')) {
      context.handle(
          _nameMeta, name.isAcceptableOrUnknown(data['name']!, _nameMeta));
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('parent_id')) {
      context.handle(_parentIdMeta,
          parentId.isAcceptableOrUnknown(data['parent_id']!, _parentIdMeta));
    }
    if (data.containsKey('product_count')) {
      context.handle(
          _productCountMeta,
          productCount.isAcceptableOrUnknown(
              data['product_count']!, _productCountMeta));
    } else if (isInserting) {
      context.missing(_productCountMeta);
    }
    if (data.containsKey('icon_name')) {
      context.handle(_iconNameMeta,
          iconName.isAcceptableOrUnknown(data['icon_name']!, _iconNameMeta));
    } else if (isInserting) {
      context.missing(_iconNameMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  MaterialCategory map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return MaterialCategory(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      name: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}name'])!,
      parentId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}parent_id']),
      productCount: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}product_count'])!,
      iconName: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}icon_name'])!,
    );
  }

  @override
  $MaterialCategoriesTable createAlias(String alias) {
    return $MaterialCategoriesTable(attachedDatabase, alias);
  }
}

class MaterialCategory extends DataClass
    implements Insertable<MaterialCategory> {
  final String id;
  final String name;
  final String? parentId;
  final int productCount;
  final String iconName;
  const MaterialCategory(
      {required this.id,
      required this.name,
      this.parentId,
      required this.productCount,
      required this.iconName});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['name'] = Variable<String>(name);
    if (!nullToAbsent || parentId != null) {
      map['parent_id'] = Variable<String>(parentId);
    }
    map['product_count'] = Variable<int>(productCount);
    map['icon_name'] = Variable<String>(iconName);
    return map;
  }

  MaterialCategoriesCompanion toCompanion(bool nullToAbsent) {
    return MaterialCategoriesCompanion(
      id: Value(id),
      name: Value(name),
      parentId: parentId == null && nullToAbsent
          ? const Value.absent()
          : Value(parentId),
      productCount: Value(productCount),
      iconName: Value(iconName),
    );
  }

  factory MaterialCategory.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return MaterialCategory(
      id: serializer.fromJson<String>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      parentId: serializer.fromJson<String?>(json['parentId']),
      productCount: serializer.fromJson<int>(json['productCount']),
      iconName: serializer.fromJson<String>(json['iconName']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'name': serializer.toJson<String>(name),
      'parentId': serializer.toJson<String?>(parentId),
      'productCount': serializer.toJson<int>(productCount),
      'iconName': serializer.toJson<String>(iconName),
    };
  }

  MaterialCategory copyWith(
          {String? id,
          String? name,
          Value<String?> parentId = const Value.absent(),
          int? productCount,
          String? iconName}) =>
      MaterialCategory(
        id: id ?? this.id,
        name: name ?? this.name,
        parentId: parentId.present ? parentId.value : this.parentId,
        productCount: productCount ?? this.productCount,
        iconName: iconName ?? this.iconName,
      );
  MaterialCategory copyWithCompanion(MaterialCategoriesCompanion data) {
    return MaterialCategory(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      parentId: data.parentId.present ? data.parentId.value : this.parentId,
      productCount: data.productCount.present
          ? data.productCount.value
          : this.productCount,
      iconName: data.iconName.present ? data.iconName.value : this.iconName,
    );
  }

  @override
  String toString() {
    return (StringBuffer('MaterialCategory(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('parentId: $parentId, ')
          ..write('productCount: $productCount, ')
          ..write('iconName: $iconName')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, name, parentId, productCount, iconName);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is MaterialCategory &&
          other.id == this.id &&
          other.name == this.name &&
          other.parentId == this.parentId &&
          other.productCount == this.productCount &&
          other.iconName == this.iconName);
}

class MaterialCategoriesCompanion extends UpdateCompanion<MaterialCategory> {
  final Value<String> id;
  final Value<String> name;
  final Value<String?> parentId;
  final Value<int> productCount;
  final Value<String> iconName;
  final Value<int> rowid;
  const MaterialCategoriesCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.parentId = const Value.absent(),
    this.productCount = const Value.absent(),
    this.iconName = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  MaterialCategoriesCompanion.insert({
    required String id,
    required String name,
    this.parentId = const Value.absent(),
    required int productCount,
    required String iconName,
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        name = Value(name),
        productCount = Value(productCount),
        iconName = Value(iconName);
  static Insertable<MaterialCategory> custom({
    Expression<String>? id,
    Expression<String>? name,
    Expression<String>? parentId,
    Expression<int>? productCount,
    Expression<String>? iconName,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (parentId != null) 'parent_id': parentId,
      if (productCount != null) 'product_count': productCount,
      if (iconName != null) 'icon_name': iconName,
      if (rowid != null) 'rowid': rowid,
    });
  }

  MaterialCategoriesCompanion copyWith(
      {Value<String>? id,
      Value<String>? name,
      Value<String?>? parentId,
      Value<int>? productCount,
      Value<String>? iconName,
      Value<int>? rowid}) {
    return MaterialCategoriesCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      parentId: parentId ?? this.parentId,
      productCount: productCount ?? this.productCount,
      iconName: iconName ?? this.iconName,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (parentId.present) {
      map['parent_id'] = Variable<String>(parentId.value);
    }
    if (productCount.present) {
      map['product_count'] = Variable<int>(productCount.value);
    }
    if (iconName.present) {
      map['icon_name'] = Variable<String>(iconName.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('MaterialCategoriesCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('parentId: $parentId, ')
          ..write('productCount: $productCount, ')
          ..write('iconName: $iconName, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $UsersTable users = $UsersTable(this);
  late final $SyncQueueTable syncQueue = $SyncQueueTable(this);
  late final $DailyReportsTable dailyReports = $DailyReportsTable(this);
  late final $CustomerVisitsTable customerVisits = $CustomerVisitsTable(this);
  late final $DailyPlanningTable dailyPlanning = $DailyPlanningTable(this);
  late final $ProspectCustomersTable prospectCustomers =
      $ProspectCustomersTable(this);
  late final $CanvassingSessionsTable canvassingSessions =
      $CanvassingSessionsTable(this);
  late final $CanvassingPhotosTable canvassingPhotos =
      $CanvassingPhotosTable(this);
  late final $MaterialProductsTable materialProducts =
      $MaterialProductsTable(this);
  late final $MaterialCategoriesTable materialCategories =
      $MaterialCategoriesTable(this);
  late final UsersDao usersDao = UsersDao(this as AppDatabase);
  late final SyncQueueDao syncQueueDao = SyncQueueDao(this as AppDatabase);
  late final DailyReportsDao dailyReportsDao =
      DailyReportsDao(this as AppDatabase);
  late final CanvassingDao canvassingDao = CanvassingDao(this as AppDatabase);
  late final MaterialsDao materialsDao = MaterialsDao(this as AppDatabase);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
        users,
        syncQueue,
        dailyReports,
        customerVisits,
        dailyPlanning,
        prospectCustomers,
        canvassingSessions,
        canvassingPhotos,
        materialProducts,
        materialCategories
      ];
}

typedef $$UsersTableCreateCompanionBuilder = UsersCompanion Function({
  Value<int> id,
  required String externalId,
  required String email,
  required String name,
  Value<String?> phone,
  required String role,
  required String organizationId,
  Value<String?> profileImageUrl,
  Value<bool> isActive,
  Value<DateTime?> lastLoginAt,
  Value<DateTime> createdAt,
  Value<DateTime> updatedAt,
});
typedef $$UsersTableUpdateCompanionBuilder = UsersCompanion Function({
  Value<int> id,
  Value<String> externalId,
  Value<String> email,
  Value<String> name,
  Value<String?> phone,
  Value<String> role,
  Value<String> organizationId,
  Value<String?> profileImageUrl,
  Value<bool> isActive,
  Value<DateTime?> lastLoginAt,
  Value<DateTime> createdAt,
  Value<DateTime> updatedAt,
});

class $$UsersTableFilterComposer extends Composer<_$AppDatabase, $UsersTable> {
  $$UsersTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get externalId => $composableBuilder(
      column: $table.externalId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get email => $composableBuilder(
      column: $table.email, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get phone => $composableBuilder(
      column: $table.phone, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get role => $composableBuilder(
      column: $table.role, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get organizationId => $composableBuilder(
      column: $table.organizationId,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get profileImageUrl => $composableBuilder(
      column: $table.profileImageUrl,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isActive => $composableBuilder(
      column: $table.isActive, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get lastLoginAt => $composableBuilder(
      column: $table.lastLoginAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnFilters(column));
}

class $$UsersTableOrderingComposer
    extends Composer<_$AppDatabase, $UsersTable> {
  $$UsersTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get externalId => $composableBuilder(
      column: $table.externalId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get email => $composableBuilder(
      column: $table.email, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get phone => $composableBuilder(
      column: $table.phone, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get role => $composableBuilder(
      column: $table.role, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get organizationId => $composableBuilder(
      column: $table.organizationId,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get profileImageUrl => $composableBuilder(
      column: $table.profileImageUrl,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isActive => $composableBuilder(
      column: $table.isActive, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get lastLoginAt => $composableBuilder(
      column: $table.lastLoginAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnOrderings(column));
}

class $$UsersTableAnnotationComposer
    extends Composer<_$AppDatabase, $UsersTable> {
  $$UsersTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get externalId => $composableBuilder(
      column: $table.externalId, builder: (column) => column);

  GeneratedColumn<String> get email =>
      $composableBuilder(column: $table.email, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get phone =>
      $composableBuilder(column: $table.phone, builder: (column) => column);

  GeneratedColumn<String> get role =>
      $composableBuilder(column: $table.role, builder: (column) => column);

  GeneratedColumn<String> get organizationId => $composableBuilder(
      column: $table.organizationId, builder: (column) => column);

  GeneratedColumn<String> get profileImageUrl => $composableBuilder(
      column: $table.profileImageUrl, builder: (column) => column);

  GeneratedColumn<bool> get isActive =>
      $composableBuilder(column: $table.isActive, builder: (column) => column);

  GeneratedColumn<DateTime> get lastLoginAt => $composableBuilder(
      column: $table.lastLoginAt, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);
}

class $$UsersTableTableManager extends RootTableManager<
    _$AppDatabase,
    $UsersTable,
    User,
    $$UsersTableFilterComposer,
    $$UsersTableOrderingComposer,
    $$UsersTableAnnotationComposer,
    $$UsersTableCreateCompanionBuilder,
    $$UsersTableUpdateCompanionBuilder,
    (User, BaseReferences<_$AppDatabase, $UsersTable, User>),
    User,
    PrefetchHooks Function()> {
  $$UsersTableTableManager(_$AppDatabase db, $UsersTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$UsersTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$UsersTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$UsersTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> externalId = const Value.absent(),
            Value<String> email = const Value.absent(),
            Value<String> name = const Value.absent(),
            Value<String?> phone = const Value.absent(),
            Value<String> role = const Value.absent(),
            Value<String> organizationId = const Value.absent(),
            Value<String?> profileImageUrl = const Value.absent(),
            Value<bool> isActive = const Value.absent(),
            Value<DateTime?> lastLoginAt = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<DateTime> updatedAt = const Value.absent(),
          }) =>
              UsersCompanion(
            id: id,
            externalId: externalId,
            email: email,
            name: name,
            phone: phone,
            role: role,
            organizationId: organizationId,
            profileImageUrl: profileImageUrl,
            isActive: isActive,
            lastLoginAt: lastLoginAt,
            createdAt: createdAt,
            updatedAt: updatedAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String externalId,
            required String email,
            required String name,
            Value<String?> phone = const Value.absent(),
            required String role,
            required String organizationId,
            Value<String?> profileImageUrl = const Value.absent(),
            Value<bool> isActive = const Value.absent(),
            Value<DateTime?> lastLoginAt = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<DateTime> updatedAt = const Value.absent(),
          }) =>
              UsersCompanion.insert(
            id: id,
            externalId: externalId,
            email: email,
            name: name,
            phone: phone,
            role: role,
            organizationId: organizationId,
            profileImageUrl: profileImageUrl,
            isActive: isActive,
            lastLoginAt: lastLoginAt,
            createdAt: createdAt,
            updatedAt: updatedAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$UsersTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $UsersTable,
    User,
    $$UsersTableFilterComposer,
    $$UsersTableOrderingComposer,
    $$UsersTableAnnotationComposer,
    $$UsersTableCreateCompanionBuilder,
    $$UsersTableUpdateCompanionBuilder,
    (User, BaseReferences<_$AppDatabase, $UsersTable, User>),
    User,
    PrefetchHooks Function()>;
typedef $$SyncQueueTableCreateCompanionBuilder = SyncQueueCompanion Function({
  Value<int> id,
  required String entityType,
  required String entityId,
  required String action,
  required String payload,
  Value<int> retryCount,
  Value<DateTime?> lastAttemptAt,
  Value<String?> lastError,
  Value<bool> isSynced,
  Value<DateTime> createdAt,
  Value<DateTime?> syncedAt,
});
typedef $$SyncQueueTableUpdateCompanionBuilder = SyncQueueCompanion Function({
  Value<int> id,
  Value<String> entityType,
  Value<String> entityId,
  Value<String> action,
  Value<String> payload,
  Value<int> retryCount,
  Value<DateTime?> lastAttemptAt,
  Value<String?> lastError,
  Value<bool> isSynced,
  Value<DateTime> createdAt,
  Value<DateTime?> syncedAt,
});

class $$SyncQueueTableFilterComposer
    extends Composer<_$AppDatabase, $SyncQueueTable> {
  $$SyncQueueTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get entityType => $composableBuilder(
      column: $table.entityType, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get entityId => $composableBuilder(
      column: $table.entityId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get action => $composableBuilder(
      column: $table.action, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get payload => $composableBuilder(
      column: $table.payload, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get retryCount => $composableBuilder(
      column: $table.retryCount, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get lastAttemptAt => $composableBuilder(
      column: $table.lastAttemptAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get lastError => $composableBuilder(
      column: $table.lastError, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get syncedAt => $composableBuilder(
      column: $table.syncedAt, builder: (column) => ColumnFilters(column));
}

class $$SyncQueueTableOrderingComposer
    extends Composer<_$AppDatabase, $SyncQueueTable> {
  $$SyncQueueTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get entityType => $composableBuilder(
      column: $table.entityType, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get entityId => $composableBuilder(
      column: $table.entityId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get action => $composableBuilder(
      column: $table.action, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get payload => $composableBuilder(
      column: $table.payload, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get retryCount => $composableBuilder(
      column: $table.retryCount, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get lastAttemptAt => $composableBuilder(
      column: $table.lastAttemptAt,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get lastError => $composableBuilder(
      column: $table.lastError, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get syncedAt => $composableBuilder(
      column: $table.syncedAt, builder: (column) => ColumnOrderings(column));
}

class $$SyncQueueTableAnnotationComposer
    extends Composer<_$AppDatabase, $SyncQueueTable> {
  $$SyncQueueTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get entityType => $composableBuilder(
      column: $table.entityType, builder: (column) => column);

  GeneratedColumn<String> get entityId =>
      $composableBuilder(column: $table.entityId, builder: (column) => column);

  GeneratedColumn<String> get action =>
      $composableBuilder(column: $table.action, builder: (column) => column);

  GeneratedColumn<String> get payload =>
      $composableBuilder(column: $table.payload, builder: (column) => column);

  GeneratedColumn<int> get retryCount => $composableBuilder(
      column: $table.retryCount, builder: (column) => column);

  GeneratedColumn<DateTime> get lastAttemptAt => $composableBuilder(
      column: $table.lastAttemptAt, builder: (column) => column);

  GeneratedColumn<String> get lastError =>
      $composableBuilder(column: $table.lastError, builder: (column) => column);

  GeneratedColumn<bool> get isSynced =>
      $composableBuilder(column: $table.isSynced, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get syncedAt =>
      $composableBuilder(column: $table.syncedAt, builder: (column) => column);
}

class $$SyncQueueTableTableManager extends RootTableManager<
    _$AppDatabase,
    $SyncQueueTable,
    SyncQueueData,
    $$SyncQueueTableFilterComposer,
    $$SyncQueueTableOrderingComposer,
    $$SyncQueueTableAnnotationComposer,
    $$SyncQueueTableCreateCompanionBuilder,
    $$SyncQueueTableUpdateCompanionBuilder,
    (
      SyncQueueData,
      BaseReferences<_$AppDatabase, $SyncQueueTable, SyncQueueData>
    ),
    SyncQueueData,
    PrefetchHooks Function()> {
  $$SyncQueueTableTableManager(_$AppDatabase db, $SyncQueueTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$SyncQueueTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$SyncQueueTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$SyncQueueTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> entityType = const Value.absent(),
            Value<String> entityId = const Value.absent(),
            Value<String> action = const Value.absent(),
            Value<String> payload = const Value.absent(),
            Value<int> retryCount = const Value.absent(),
            Value<DateTime?> lastAttemptAt = const Value.absent(),
            Value<String?> lastError = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<DateTime?> syncedAt = const Value.absent(),
          }) =>
              SyncQueueCompanion(
            id: id,
            entityType: entityType,
            entityId: entityId,
            action: action,
            payload: payload,
            retryCount: retryCount,
            lastAttemptAt: lastAttemptAt,
            lastError: lastError,
            isSynced: isSynced,
            createdAt: createdAt,
            syncedAt: syncedAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String entityType,
            required String entityId,
            required String action,
            required String payload,
            Value<int> retryCount = const Value.absent(),
            Value<DateTime?> lastAttemptAt = const Value.absent(),
            Value<String?> lastError = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<DateTime?> syncedAt = const Value.absent(),
          }) =>
              SyncQueueCompanion.insert(
            id: id,
            entityType: entityType,
            entityId: entityId,
            action: action,
            payload: payload,
            retryCount: retryCount,
            lastAttemptAt: lastAttemptAt,
            lastError: lastError,
            isSynced: isSynced,
            createdAt: createdAt,
            syncedAt: syncedAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$SyncQueueTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $SyncQueueTable,
    SyncQueueData,
    $$SyncQueueTableFilterComposer,
    $$SyncQueueTableOrderingComposer,
    $$SyncQueueTableAnnotationComposer,
    $$SyncQueueTableCreateCompanionBuilder,
    $$SyncQueueTableUpdateCompanionBuilder,
    (
      SyncQueueData,
      BaseReferences<_$AppDatabase, $SyncQueueTable, SyncQueueData>
    ),
    SyncQueueData,
    PrefetchHooks Function()>;
typedef $$DailyReportsTableCreateCompanionBuilder = DailyReportsCompanion
    Function({
  required String id,
  required String userId,
  required DateTime reportDate,
  required String visitSummary,
  Value<int> totalVisits,
  Value<int> totalCalls,
  Value<int> proposalsSent,
  required String status,
  Value<bool> isSynced,
  required DateTime createdAt,
  required DateTime updatedAt,
  Value<int> rowid,
});
typedef $$DailyReportsTableUpdateCompanionBuilder = DailyReportsCompanion
    Function({
  Value<String> id,
  Value<String> userId,
  Value<DateTime> reportDate,
  Value<String> visitSummary,
  Value<int> totalVisits,
  Value<int> totalCalls,
  Value<int> proposalsSent,
  Value<String> status,
  Value<bool> isSynced,
  Value<DateTime> createdAt,
  Value<DateTime> updatedAt,
  Value<int> rowid,
});

final class $$DailyReportsTableReferences
    extends BaseReferences<_$AppDatabase, $DailyReportsTable, DailyReportData> {
  $$DailyReportsTableReferences(super.$_db, super.$_table, super.$_typedResult);

  static MultiTypedResultKey<$CustomerVisitsTable, List<CustomerVisitData>>
      _customerVisitsRefsTable(_$AppDatabase db) =>
          MultiTypedResultKey.fromTable(db.customerVisits,
              aliasName: $_aliasNameGenerator(
                  db.dailyReports.id, db.customerVisits.reportId));

  $$CustomerVisitsTableProcessedTableManager get customerVisitsRefs {
    final manager = $$CustomerVisitsTableTableManager($_db, $_db.customerVisits)
        .filter((f) => f.reportId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(_customerVisitsRefsTable($_db));
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: cache));
  }

  static MultiTypedResultKey<$DailyPlanningTable, List<PlanningItemData>>
      _dailyPlanningRefsTable(_$AppDatabase db) =>
          MultiTypedResultKey.fromTable(db.dailyPlanning,
              aliasName: $_aliasNameGenerator(
                  db.dailyReports.id, db.dailyPlanning.reportId));

  $$DailyPlanningTableProcessedTableManager get dailyPlanningRefs {
    final manager = $$DailyPlanningTableTableManager($_db, $_db.dailyPlanning)
        .filter((f) => f.reportId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache = $_typedResult.readTableOrNull(_dailyPlanningRefsTable($_db));
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: cache));
  }
}

class $$DailyReportsTableFilterComposer
    extends Composer<_$AppDatabase, $DailyReportsTable> {
  $$DailyReportsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get userId => $composableBuilder(
      column: $table.userId, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get reportDate => $composableBuilder(
      column: $table.reportDate, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get visitSummary => $composableBuilder(
      column: $table.visitSummary, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get totalVisits => $composableBuilder(
      column: $table.totalVisits, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get totalCalls => $composableBuilder(
      column: $table.totalCalls, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get proposalsSent => $composableBuilder(
      column: $table.proposalsSent, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnFilters(column));

  Expression<bool> customerVisitsRefs(
      Expression<bool> Function($$CustomerVisitsTableFilterComposer f) f) {
    final $$CustomerVisitsTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.id,
        referencedTable: $db.customerVisits,
        getReferencedColumn: (t) => t.reportId,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$CustomerVisitsTableFilterComposer(
              $db: $db,
              $table: $db.customerVisits,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return f(composer);
  }

  Expression<bool> dailyPlanningRefs(
      Expression<bool> Function($$DailyPlanningTableFilterComposer f) f) {
    final $$DailyPlanningTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.id,
        referencedTable: $db.dailyPlanning,
        getReferencedColumn: (t) => t.reportId,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$DailyPlanningTableFilterComposer(
              $db: $db,
              $table: $db.dailyPlanning,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return f(composer);
  }
}

class $$DailyReportsTableOrderingComposer
    extends Composer<_$AppDatabase, $DailyReportsTable> {
  $$DailyReportsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get userId => $composableBuilder(
      column: $table.userId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get reportDate => $composableBuilder(
      column: $table.reportDate, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get visitSummary => $composableBuilder(
      column: $table.visitSummary,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get totalVisits => $composableBuilder(
      column: $table.totalVisits, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get totalCalls => $composableBuilder(
      column: $table.totalCalls, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get proposalsSent => $composableBuilder(
      column: $table.proposalsSent,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnOrderings(column));
}

class $$DailyReportsTableAnnotationComposer
    extends Composer<_$AppDatabase, $DailyReportsTable> {
  $$DailyReportsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get userId =>
      $composableBuilder(column: $table.userId, builder: (column) => column);

  GeneratedColumn<DateTime> get reportDate => $composableBuilder(
      column: $table.reportDate, builder: (column) => column);

  GeneratedColumn<String> get visitSummary => $composableBuilder(
      column: $table.visitSummary, builder: (column) => column);

  GeneratedColumn<int> get totalVisits => $composableBuilder(
      column: $table.totalVisits, builder: (column) => column);

  GeneratedColumn<int> get totalCalls => $composableBuilder(
      column: $table.totalCalls, builder: (column) => column);

  GeneratedColumn<int> get proposalsSent => $composableBuilder(
      column: $table.proposalsSent, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<bool> get isSynced =>
      $composableBuilder(column: $table.isSynced, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  Expression<T> customerVisitsRefs<T extends Object>(
      Expression<T> Function($$CustomerVisitsTableAnnotationComposer a) f) {
    final $$CustomerVisitsTableAnnotationComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.id,
        referencedTable: $db.customerVisits,
        getReferencedColumn: (t) => t.reportId,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$CustomerVisitsTableAnnotationComposer(
              $db: $db,
              $table: $db.customerVisits,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return f(composer);
  }

  Expression<T> dailyPlanningRefs<T extends Object>(
      Expression<T> Function($$DailyPlanningTableAnnotationComposer a) f) {
    final $$DailyPlanningTableAnnotationComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.id,
        referencedTable: $db.dailyPlanning,
        getReferencedColumn: (t) => t.reportId,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$DailyPlanningTableAnnotationComposer(
              $db: $db,
              $table: $db.dailyPlanning,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return f(composer);
  }
}

class $$DailyReportsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $DailyReportsTable,
    DailyReportData,
    $$DailyReportsTableFilterComposer,
    $$DailyReportsTableOrderingComposer,
    $$DailyReportsTableAnnotationComposer,
    $$DailyReportsTableCreateCompanionBuilder,
    $$DailyReportsTableUpdateCompanionBuilder,
    (DailyReportData, $$DailyReportsTableReferences),
    DailyReportData,
    PrefetchHooks Function({bool customerVisitsRefs, bool dailyPlanningRefs})> {
  $$DailyReportsTableTableManager(_$AppDatabase db, $DailyReportsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DailyReportsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DailyReportsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DailyReportsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> userId = const Value.absent(),
            Value<DateTime> reportDate = const Value.absent(),
            Value<String> visitSummary = const Value.absent(),
            Value<int> totalVisits = const Value.absent(),
            Value<int> totalCalls = const Value.absent(),
            Value<int> proposalsSent = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<DateTime> updatedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              DailyReportsCompanion(
            id: id,
            userId: userId,
            reportDate: reportDate,
            visitSummary: visitSummary,
            totalVisits: totalVisits,
            totalCalls: totalCalls,
            proposalsSent: proposalsSent,
            status: status,
            isSynced: isSynced,
            createdAt: createdAt,
            updatedAt: updatedAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String userId,
            required DateTime reportDate,
            required String visitSummary,
            Value<int> totalVisits = const Value.absent(),
            Value<int> totalCalls = const Value.absent(),
            Value<int> proposalsSent = const Value.absent(),
            required String status,
            Value<bool> isSynced = const Value.absent(),
            required DateTime createdAt,
            required DateTime updatedAt,
            Value<int> rowid = const Value.absent(),
          }) =>
              DailyReportsCompanion.insert(
            id: id,
            userId: userId,
            reportDate: reportDate,
            visitSummary: visitSummary,
            totalVisits: totalVisits,
            totalCalls: totalCalls,
            proposalsSent: proposalsSent,
            status: status,
            isSynced: isSynced,
            createdAt: createdAt,
            updatedAt: updatedAt,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (
                    e.readTable(table),
                    $$DailyReportsTableReferences(db, table, e)
                  ))
              .toList(),
          prefetchHooksCallback: (
              {customerVisitsRefs = false, dailyPlanningRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [
                if (customerVisitsRefs) db.customerVisits,
                if (dailyPlanningRefs) db.dailyPlanning
              ],
              addJoins: null,
              getPrefetchedDataCallback: (items) async {
                return [
                  if (customerVisitsRefs)
                    await $_getPrefetchedData<DailyReportData,
                            $DailyReportsTable, CustomerVisitData>(
                        currentTable: table,
                        referencedTable: $$DailyReportsTableReferences
                            ._customerVisitsRefsTable(db),
                        managerFromTypedResult: (p0) =>
                            $$DailyReportsTableReferences(db, table, p0)
                                .customerVisitsRefs,
                        referencedItemsForCurrentItem: (item,
                                referencedItems) =>
                            referencedItems.where((e) => e.reportId == item.id),
                        typedResults: items),
                  if (dailyPlanningRefs)
                    await $_getPrefetchedData<DailyReportData,
                            $DailyReportsTable, PlanningItemData>(
                        currentTable: table,
                        referencedTable: $$DailyReportsTableReferences
                            ._dailyPlanningRefsTable(db),
                        managerFromTypedResult: (p0) =>
                            $$DailyReportsTableReferences(db, table, p0)
                                .dailyPlanningRefs,
                        referencedItemsForCurrentItem: (item,
                                referencedItems) =>
                            referencedItems.where((e) => e.reportId == item.id),
                        typedResults: items)
                ];
              },
            );
          },
        ));
}

typedef $$DailyReportsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $DailyReportsTable,
    DailyReportData,
    $$DailyReportsTableFilterComposer,
    $$DailyReportsTableOrderingComposer,
    $$DailyReportsTableAnnotationComposer,
    $$DailyReportsTableCreateCompanionBuilder,
    $$DailyReportsTableUpdateCompanionBuilder,
    (DailyReportData, $$DailyReportsTableReferences),
    DailyReportData,
    PrefetchHooks Function({bool customerVisitsRefs, bool dailyPlanningRefs})>;
typedef $$CustomerVisitsTableCreateCompanionBuilder = CustomerVisitsCompanion
    Function({
  required String id,
  required String reportId,
  required String customerId,
  required String customerName,
  required DateTime visitTime,
  required String visitOutcome,
  Value<String?> notes,
  Value<String?> nextAction,
  Value<DateTime?> followUpDate,
  Value<bool> isSynced,
  required DateTime createdAt,
  required DateTime updatedAt,
  Value<int> rowid,
});
typedef $$CustomerVisitsTableUpdateCompanionBuilder = CustomerVisitsCompanion
    Function({
  Value<String> id,
  Value<String> reportId,
  Value<String> customerId,
  Value<String> customerName,
  Value<DateTime> visitTime,
  Value<String> visitOutcome,
  Value<String?> notes,
  Value<String?> nextAction,
  Value<DateTime?> followUpDate,
  Value<bool> isSynced,
  Value<DateTime> createdAt,
  Value<DateTime> updatedAt,
  Value<int> rowid,
});

final class $$CustomerVisitsTableReferences extends BaseReferences<
    _$AppDatabase, $CustomerVisitsTable, CustomerVisitData> {
  $$CustomerVisitsTableReferences(
      super.$_db, super.$_table, super.$_typedResult);

  static $DailyReportsTable _reportIdTable(_$AppDatabase db) =>
      db.dailyReports.createAlias(
          $_aliasNameGenerator(db.customerVisits.reportId, db.dailyReports.id));

  $$DailyReportsTableProcessedTableManager get reportId {
    final $_column = $_itemColumn<String>('report_id')!;

    final manager = $$DailyReportsTableTableManager($_db, $_db.dailyReports)
        .filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_reportIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: [item]));
  }
}

class $$CustomerVisitsTableFilterComposer
    extends Composer<_$AppDatabase, $CustomerVisitsTable> {
  $$CustomerVisitsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerName => $composableBuilder(
      column: $table.customerName, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get visitTime => $composableBuilder(
      column: $table.visitTime, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get visitOutcome => $composableBuilder(
      column: $table.visitOutcome, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get notes => $composableBuilder(
      column: $table.notes, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get nextAction => $composableBuilder(
      column: $table.nextAction, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get followUpDate => $composableBuilder(
      column: $table.followUpDate, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnFilters(column));

  $$DailyReportsTableFilterComposer get reportId {
    final $$DailyReportsTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.reportId,
        referencedTable: $db.dailyReports,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$DailyReportsTableFilterComposer(
              $db: $db,
              $table: $db.dailyReports,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$CustomerVisitsTableOrderingComposer
    extends Composer<_$AppDatabase, $CustomerVisitsTable> {
  $$CustomerVisitsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerName => $composableBuilder(
      column: $table.customerName,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get visitTime => $composableBuilder(
      column: $table.visitTime, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get visitOutcome => $composableBuilder(
      column: $table.visitOutcome,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get notes => $composableBuilder(
      column: $table.notes, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get nextAction => $composableBuilder(
      column: $table.nextAction, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get followUpDate => $composableBuilder(
      column: $table.followUpDate,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnOrderings(column));

  $$DailyReportsTableOrderingComposer get reportId {
    final $$DailyReportsTableOrderingComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.reportId,
        referencedTable: $db.dailyReports,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$DailyReportsTableOrderingComposer(
              $db: $db,
              $table: $db.dailyReports,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$CustomerVisitsTableAnnotationComposer
    extends Composer<_$AppDatabase, $CustomerVisitsTable> {
  $$CustomerVisitsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => column);

  GeneratedColumn<String> get customerName => $composableBuilder(
      column: $table.customerName, builder: (column) => column);

  GeneratedColumn<DateTime> get visitTime =>
      $composableBuilder(column: $table.visitTime, builder: (column) => column);

  GeneratedColumn<String> get visitOutcome => $composableBuilder(
      column: $table.visitOutcome, builder: (column) => column);

  GeneratedColumn<String> get notes =>
      $composableBuilder(column: $table.notes, builder: (column) => column);

  GeneratedColumn<String> get nextAction => $composableBuilder(
      column: $table.nextAction, builder: (column) => column);

  GeneratedColumn<DateTime> get followUpDate => $composableBuilder(
      column: $table.followUpDate, builder: (column) => column);

  GeneratedColumn<bool> get isSynced =>
      $composableBuilder(column: $table.isSynced, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  $$DailyReportsTableAnnotationComposer get reportId {
    final $$DailyReportsTableAnnotationComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.reportId,
        referencedTable: $db.dailyReports,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$DailyReportsTableAnnotationComposer(
              $db: $db,
              $table: $db.dailyReports,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$CustomerVisitsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CustomerVisitsTable,
    CustomerVisitData,
    $$CustomerVisitsTableFilterComposer,
    $$CustomerVisitsTableOrderingComposer,
    $$CustomerVisitsTableAnnotationComposer,
    $$CustomerVisitsTableCreateCompanionBuilder,
    $$CustomerVisitsTableUpdateCompanionBuilder,
    (CustomerVisitData, $$CustomerVisitsTableReferences),
    CustomerVisitData,
    PrefetchHooks Function({bool reportId})> {
  $$CustomerVisitsTableTableManager(
      _$AppDatabase db, $CustomerVisitsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$CustomerVisitsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$CustomerVisitsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$CustomerVisitsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> reportId = const Value.absent(),
            Value<String> customerId = const Value.absent(),
            Value<String> customerName = const Value.absent(),
            Value<DateTime> visitTime = const Value.absent(),
            Value<String> visitOutcome = const Value.absent(),
            Value<String?> notes = const Value.absent(),
            Value<String?> nextAction = const Value.absent(),
            Value<DateTime?> followUpDate = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<DateTime> updatedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CustomerVisitsCompanion(
            id: id,
            reportId: reportId,
            customerId: customerId,
            customerName: customerName,
            visitTime: visitTime,
            visitOutcome: visitOutcome,
            notes: notes,
            nextAction: nextAction,
            followUpDate: followUpDate,
            isSynced: isSynced,
            createdAt: createdAt,
            updatedAt: updatedAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String reportId,
            required String customerId,
            required String customerName,
            required DateTime visitTime,
            required String visitOutcome,
            Value<String?> notes = const Value.absent(),
            Value<String?> nextAction = const Value.absent(),
            Value<DateTime?> followUpDate = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            required DateTime createdAt,
            required DateTime updatedAt,
            Value<int> rowid = const Value.absent(),
          }) =>
              CustomerVisitsCompanion.insert(
            id: id,
            reportId: reportId,
            customerId: customerId,
            customerName: customerName,
            visitTime: visitTime,
            visitOutcome: visitOutcome,
            notes: notes,
            nextAction: nextAction,
            followUpDate: followUpDate,
            isSynced: isSynced,
            createdAt: createdAt,
            updatedAt: updatedAt,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (
                    e.readTable(table),
                    $$CustomerVisitsTableReferences(db, table, e)
                  ))
              .toList(),
          prefetchHooksCallback: ({reportId = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [],
              addJoins: <
                  T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic>>(state) {
                if (reportId) {
                  state = state.withJoin(
                    currentTable: table,
                    currentColumn: table.reportId,
                    referencedTable:
                        $$CustomerVisitsTableReferences._reportIdTable(db),
                    referencedColumn:
                        $$CustomerVisitsTableReferences._reportIdTable(db).id,
                  ) as T;
                }

                return state;
              },
              getPrefetchedDataCallback: (items) async {
                return [];
              },
            );
          },
        ));
}

typedef $$CustomerVisitsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $CustomerVisitsTable,
    CustomerVisitData,
    $$CustomerVisitsTableFilterComposer,
    $$CustomerVisitsTableOrderingComposer,
    $$CustomerVisitsTableAnnotationComposer,
    $$CustomerVisitsTableCreateCompanionBuilder,
    $$CustomerVisitsTableUpdateCompanionBuilder,
    (CustomerVisitData, $$CustomerVisitsTableReferences),
    CustomerVisitData,
    PrefetchHooks Function({bool reportId})>;
typedef $$DailyPlanningTableCreateCompanionBuilder = DailyPlanningCompanion
    Function({
  required String id,
  required String reportId,
  required String activity,
  required DateTime scheduledDate,
  required String priority,
  Value<String?> customerId,
  Value<String?> customerName,
  Value<String?> notes,
  Value<bool> isCompleted,
  Value<bool> isSynced,
  required DateTime createdAt,
  required DateTime updatedAt,
  Value<int> rowid,
});
typedef $$DailyPlanningTableUpdateCompanionBuilder = DailyPlanningCompanion
    Function({
  Value<String> id,
  Value<String> reportId,
  Value<String> activity,
  Value<DateTime> scheduledDate,
  Value<String> priority,
  Value<String?> customerId,
  Value<String?> customerName,
  Value<String?> notes,
  Value<bool> isCompleted,
  Value<bool> isSynced,
  Value<DateTime> createdAt,
  Value<DateTime> updatedAt,
  Value<int> rowid,
});

final class $$DailyPlanningTableReferences extends BaseReferences<_$AppDatabase,
    $DailyPlanningTable, PlanningItemData> {
  $$DailyPlanningTableReferences(
      super.$_db, super.$_table, super.$_typedResult);

  static $DailyReportsTable _reportIdTable(_$AppDatabase db) =>
      db.dailyReports.createAlias(
          $_aliasNameGenerator(db.dailyPlanning.reportId, db.dailyReports.id));

  $$DailyReportsTableProcessedTableManager get reportId {
    final $_column = $_itemColumn<String>('report_id')!;

    final manager = $$DailyReportsTableTableManager($_db, $_db.dailyReports)
        .filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_reportIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: [item]));
  }
}

class $$DailyPlanningTableFilterComposer
    extends Composer<_$AppDatabase, $DailyPlanningTable> {
  $$DailyPlanningTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get activity => $composableBuilder(
      column: $table.activity, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get scheduledDate => $composableBuilder(
      column: $table.scheduledDate, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get priority => $composableBuilder(
      column: $table.priority, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get customerName => $composableBuilder(
      column: $table.customerName, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get notes => $composableBuilder(
      column: $table.notes, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isCompleted => $composableBuilder(
      column: $table.isCompleted, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnFilters(column));

  $$DailyReportsTableFilterComposer get reportId {
    final $$DailyReportsTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.reportId,
        referencedTable: $db.dailyReports,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$DailyReportsTableFilterComposer(
              $db: $db,
              $table: $db.dailyReports,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$DailyPlanningTableOrderingComposer
    extends Composer<_$AppDatabase, $DailyPlanningTable> {
  $$DailyPlanningTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get activity => $composableBuilder(
      column: $table.activity, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get scheduledDate => $composableBuilder(
      column: $table.scheduledDate,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get priority => $composableBuilder(
      column: $table.priority, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get customerName => $composableBuilder(
      column: $table.customerName,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get notes => $composableBuilder(
      column: $table.notes, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isCompleted => $composableBuilder(
      column: $table.isCompleted, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnOrderings(column));

  $$DailyReportsTableOrderingComposer get reportId {
    final $$DailyReportsTableOrderingComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.reportId,
        referencedTable: $db.dailyReports,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$DailyReportsTableOrderingComposer(
              $db: $db,
              $table: $db.dailyReports,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$DailyPlanningTableAnnotationComposer
    extends Composer<_$AppDatabase, $DailyPlanningTable> {
  $$DailyPlanningTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get activity =>
      $composableBuilder(column: $table.activity, builder: (column) => column);

  GeneratedColumn<DateTime> get scheduledDate => $composableBuilder(
      column: $table.scheduledDate, builder: (column) => column);

  GeneratedColumn<String> get priority =>
      $composableBuilder(column: $table.priority, builder: (column) => column);

  GeneratedColumn<String> get customerId => $composableBuilder(
      column: $table.customerId, builder: (column) => column);

  GeneratedColumn<String> get customerName => $composableBuilder(
      column: $table.customerName, builder: (column) => column);

  GeneratedColumn<String> get notes =>
      $composableBuilder(column: $table.notes, builder: (column) => column);

  GeneratedColumn<bool> get isCompleted => $composableBuilder(
      column: $table.isCompleted, builder: (column) => column);

  GeneratedColumn<bool> get isSynced =>
      $composableBuilder(column: $table.isSynced, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  $$DailyReportsTableAnnotationComposer get reportId {
    final $$DailyReportsTableAnnotationComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.reportId,
        referencedTable: $db.dailyReports,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$DailyReportsTableAnnotationComposer(
              $db: $db,
              $table: $db.dailyReports,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$DailyPlanningTableTableManager extends RootTableManager<
    _$AppDatabase,
    $DailyPlanningTable,
    PlanningItemData,
    $$DailyPlanningTableFilterComposer,
    $$DailyPlanningTableOrderingComposer,
    $$DailyPlanningTableAnnotationComposer,
    $$DailyPlanningTableCreateCompanionBuilder,
    $$DailyPlanningTableUpdateCompanionBuilder,
    (PlanningItemData, $$DailyPlanningTableReferences),
    PlanningItemData,
    PrefetchHooks Function({bool reportId})> {
  $$DailyPlanningTableTableManager(_$AppDatabase db, $DailyPlanningTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$DailyPlanningTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$DailyPlanningTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$DailyPlanningTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> reportId = const Value.absent(),
            Value<String> activity = const Value.absent(),
            Value<DateTime> scheduledDate = const Value.absent(),
            Value<String> priority = const Value.absent(),
            Value<String?> customerId = const Value.absent(),
            Value<String?> customerName = const Value.absent(),
            Value<String?> notes = const Value.absent(),
            Value<bool> isCompleted = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<DateTime> updatedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              DailyPlanningCompanion(
            id: id,
            reportId: reportId,
            activity: activity,
            scheduledDate: scheduledDate,
            priority: priority,
            customerId: customerId,
            customerName: customerName,
            notes: notes,
            isCompleted: isCompleted,
            isSynced: isSynced,
            createdAt: createdAt,
            updatedAt: updatedAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String reportId,
            required String activity,
            required DateTime scheduledDate,
            required String priority,
            Value<String?> customerId = const Value.absent(),
            Value<String?> customerName = const Value.absent(),
            Value<String?> notes = const Value.absent(),
            Value<bool> isCompleted = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            required DateTime createdAt,
            required DateTime updatedAt,
            Value<int> rowid = const Value.absent(),
          }) =>
              DailyPlanningCompanion.insert(
            id: id,
            reportId: reportId,
            activity: activity,
            scheduledDate: scheduledDate,
            priority: priority,
            customerId: customerId,
            customerName: customerName,
            notes: notes,
            isCompleted: isCompleted,
            isSynced: isSynced,
            createdAt: createdAt,
            updatedAt: updatedAt,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (
                    e.readTable(table),
                    $$DailyPlanningTableReferences(db, table, e)
                  ))
              .toList(),
          prefetchHooksCallback: ({reportId = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [],
              addJoins: <
                  T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic>>(state) {
                if (reportId) {
                  state = state.withJoin(
                    currentTable: table,
                    currentColumn: table.reportId,
                    referencedTable:
                        $$DailyPlanningTableReferences._reportIdTable(db),
                    referencedColumn:
                        $$DailyPlanningTableReferences._reportIdTable(db).id,
                  ) as T;
                }

                return state;
              },
              getPrefetchedDataCallback: (items) async {
                return [];
              },
            );
          },
        ));
}

typedef $$DailyPlanningTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $DailyPlanningTable,
    PlanningItemData,
    $$DailyPlanningTableFilterComposer,
    $$DailyPlanningTableOrderingComposer,
    $$DailyPlanningTableAnnotationComposer,
    $$DailyPlanningTableCreateCompanionBuilder,
    $$DailyPlanningTableUpdateCompanionBuilder,
    (PlanningItemData, $$DailyPlanningTableReferences),
    PlanningItemData,
    PrefetchHooks Function({bool reportId})>;
typedef $$ProspectCustomersTableCreateCompanionBuilder
    = ProspectCustomersCompanion Function({
  required String id,
  required String companyName,
  required String address,
  required double latitude,
  required double longitude,
  required String businessType,
  required double potentialAreaSqm,
  required double potentialValueIdr,
  Value<String?> notes,
  required String contacts,
  Value<DateTime> createdAt,
  Value<DateTime> updatedAt,
  Value<bool> isSynced,
  Value<int> rowid,
});
typedef $$ProspectCustomersTableUpdateCompanionBuilder
    = ProspectCustomersCompanion Function({
  Value<String> id,
  Value<String> companyName,
  Value<String> address,
  Value<double> latitude,
  Value<double> longitude,
  Value<String> businessType,
  Value<double> potentialAreaSqm,
  Value<double> potentialValueIdr,
  Value<String?> notes,
  Value<String> contacts,
  Value<DateTime> createdAt,
  Value<DateTime> updatedAt,
  Value<bool> isSynced,
  Value<int> rowid,
});

final class $$ProspectCustomersTableReferences extends BaseReferences<
    _$AppDatabase, $ProspectCustomersTable, ProspectCustomer> {
  $$ProspectCustomersTableReferences(
      super.$_db, super.$_table, super.$_typedResult);

  static MultiTypedResultKey<$CanvassingSessionsTable, List<CanvassingSession>>
      _canvassingSessionsRefsTable(_$AppDatabase db) =>
          MultiTypedResultKey.fromTable(db.canvassingSessions,
              aliasName: $_aliasNameGenerator(
                  db.prospectCustomers.id, db.canvassingSessions.prospectId));

  $$CanvassingSessionsTableProcessedTableManager get canvassingSessionsRefs {
    final manager = $$CanvassingSessionsTableTableManager(
            $_db, $_db.canvassingSessions)
        .filter((f) => f.prospectId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache =
        $_typedResult.readTableOrNull(_canvassingSessionsRefsTable($_db));
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: cache));
  }
}

class $$ProspectCustomersTableFilterComposer
    extends Composer<_$AppDatabase, $ProspectCustomersTable> {
  $$ProspectCustomersTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get companyName => $composableBuilder(
      column: $table.companyName, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get address => $composableBuilder(
      column: $table.address, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get businessType => $composableBuilder(
      column: $table.businessType, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get potentialAreaSqm => $composableBuilder(
      column: $table.potentialAreaSqm,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get potentialValueIdr => $composableBuilder(
      column: $table.potentialValueIdr,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get notes => $composableBuilder(
      column: $table.notes, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get contacts => $composableBuilder(
      column: $table.contacts, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnFilters(column));

  Expression<bool> canvassingSessionsRefs(
      Expression<bool> Function($$CanvassingSessionsTableFilterComposer f) f) {
    final $$CanvassingSessionsTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.id,
        referencedTable: $db.canvassingSessions,
        getReferencedColumn: (t) => t.prospectId,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$CanvassingSessionsTableFilterComposer(
              $db: $db,
              $table: $db.canvassingSessions,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return f(composer);
  }
}

class $$ProspectCustomersTableOrderingComposer
    extends Composer<_$AppDatabase, $ProspectCustomersTable> {
  $$ProspectCustomersTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get companyName => $composableBuilder(
      column: $table.companyName, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get address => $composableBuilder(
      column: $table.address, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get latitude => $composableBuilder(
      column: $table.latitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get longitude => $composableBuilder(
      column: $table.longitude, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get businessType => $composableBuilder(
      column: $table.businessType,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get potentialAreaSqm => $composableBuilder(
      column: $table.potentialAreaSqm,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get potentialValueIdr => $composableBuilder(
      column: $table.potentialValueIdr,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get notes => $composableBuilder(
      column: $table.notes, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get contacts => $composableBuilder(
      column: $table.contacts, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get updatedAt => $composableBuilder(
      column: $table.updatedAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnOrderings(column));
}

class $$ProspectCustomersTableAnnotationComposer
    extends Composer<_$AppDatabase, $ProspectCustomersTable> {
  $$ProspectCustomersTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get companyName => $composableBuilder(
      column: $table.companyName, builder: (column) => column);

  GeneratedColumn<String> get address =>
      $composableBuilder(column: $table.address, builder: (column) => column);

  GeneratedColumn<double> get latitude =>
      $composableBuilder(column: $table.latitude, builder: (column) => column);

  GeneratedColumn<double> get longitude =>
      $composableBuilder(column: $table.longitude, builder: (column) => column);

  GeneratedColumn<String> get businessType => $composableBuilder(
      column: $table.businessType, builder: (column) => column);

  GeneratedColumn<double> get potentialAreaSqm => $composableBuilder(
      column: $table.potentialAreaSqm, builder: (column) => column);

  GeneratedColumn<double> get potentialValueIdr => $composableBuilder(
      column: $table.potentialValueIdr, builder: (column) => column);

  GeneratedColumn<String> get notes =>
      $composableBuilder(column: $table.notes, builder: (column) => column);

  GeneratedColumn<String> get contacts =>
      $composableBuilder(column: $table.contacts, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<DateTime> get updatedAt =>
      $composableBuilder(column: $table.updatedAt, builder: (column) => column);

  GeneratedColumn<bool> get isSynced =>
      $composableBuilder(column: $table.isSynced, builder: (column) => column);

  Expression<T> canvassingSessionsRefs<T extends Object>(
      Expression<T> Function($$CanvassingSessionsTableAnnotationComposer a) f) {
    final $$CanvassingSessionsTableAnnotationComposer composer =
        $composerBuilder(
            composer: this,
            getCurrentColumn: (t) => t.id,
            referencedTable: $db.canvassingSessions,
            getReferencedColumn: (t) => t.prospectId,
            builder: (joinBuilder,
                    {$addJoinBuilderToRootComposer,
                    $removeJoinBuilderFromRootComposer}) =>
                $$CanvassingSessionsTableAnnotationComposer(
                  $db: $db,
                  $table: $db.canvassingSessions,
                  $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                  joinBuilder: joinBuilder,
                  $removeJoinBuilderFromRootComposer:
                      $removeJoinBuilderFromRootComposer,
                ));
    return f(composer);
  }
}

class $$ProspectCustomersTableTableManager extends RootTableManager<
    _$AppDatabase,
    $ProspectCustomersTable,
    ProspectCustomer,
    $$ProspectCustomersTableFilterComposer,
    $$ProspectCustomersTableOrderingComposer,
    $$ProspectCustomersTableAnnotationComposer,
    $$ProspectCustomersTableCreateCompanionBuilder,
    $$ProspectCustomersTableUpdateCompanionBuilder,
    (ProspectCustomer, $$ProspectCustomersTableReferences),
    ProspectCustomer,
    PrefetchHooks Function({bool canvassingSessionsRefs})> {
  $$ProspectCustomersTableTableManager(
      _$AppDatabase db, $ProspectCustomersTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$ProspectCustomersTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$ProspectCustomersTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$ProspectCustomersTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> companyName = const Value.absent(),
            Value<String> address = const Value.absent(),
            Value<double> latitude = const Value.absent(),
            Value<double> longitude = const Value.absent(),
            Value<String> businessType = const Value.absent(),
            Value<double> potentialAreaSqm = const Value.absent(),
            Value<double> potentialValueIdr = const Value.absent(),
            Value<String?> notes = const Value.absent(),
            Value<String> contacts = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<DateTime> updatedAt = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ProspectCustomersCompanion(
            id: id,
            companyName: companyName,
            address: address,
            latitude: latitude,
            longitude: longitude,
            businessType: businessType,
            potentialAreaSqm: potentialAreaSqm,
            potentialValueIdr: potentialValueIdr,
            notes: notes,
            contacts: contacts,
            createdAt: createdAt,
            updatedAt: updatedAt,
            isSynced: isSynced,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String companyName,
            required String address,
            required double latitude,
            required double longitude,
            required String businessType,
            required double potentialAreaSqm,
            required double potentialValueIdr,
            Value<String?> notes = const Value.absent(),
            required String contacts,
            Value<DateTime> createdAt = const Value.absent(),
            Value<DateTime> updatedAt = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              ProspectCustomersCompanion.insert(
            id: id,
            companyName: companyName,
            address: address,
            latitude: latitude,
            longitude: longitude,
            businessType: businessType,
            potentialAreaSqm: potentialAreaSqm,
            potentialValueIdr: potentialValueIdr,
            notes: notes,
            contacts: contacts,
            createdAt: createdAt,
            updatedAt: updatedAt,
            isSynced: isSynced,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (
                    e.readTable(table),
                    $$ProspectCustomersTableReferences(db, table, e)
                  ))
              .toList(),
          prefetchHooksCallback: ({canvassingSessionsRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [
                if (canvassingSessionsRefs) db.canvassingSessions
              ],
              addJoins: null,
              getPrefetchedDataCallback: (items) async {
                return [
                  if (canvassingSessionsRefs)
                    await $_getPrefetchedData<ProspectCustomer,
                            $ProspectCustomersTable, CanvassingSession>(
                        currentTable: table,
                        referencedTable: $$ProspectCustomersTableReferences
                            ._canvassingSessionsRefsTable(db),
                        managerFromTypedResult: (p0) =>
                            $$ProspectCustomersTableReferences(db, table, p0)
                                .canvassingSessionsRefs,
                        referencedItemsForCurrentItem:
                            (item, referencedItems) => referencedItems
                                .where((e) => e.prospectId == item.id),
                        typedResults: items)
                ];
              },
            );
          },
        ));
}

typedef $$ProspectCustomersTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $ProspectCustomersTable,
    ProspectCustomer,
    $$ProspectCustomersTableFilterComposer,
    $$ProspectCustomersTableOrderingComposer,
    $$ProspectCustomersTableAnnotationComposer,
    $$ProspectCustomersTableCreateCompanionBuilder,
    $$ProspectCustomersTableUpdateCompanionBuilder,
    (ProspectCustomer, $$ProspectCustomersTableReferences),
    ProspectCustomer,
    PrefetchHooks Function({bool canvassingSessionsRefs})>;
typedef $$CanvassingSessionsTableCreateCompanionBuilder
    = CanvassingSessionsCompanion Function({
  required String id,
  required String prospectId,
  required DateTime visitDate,
  required String outcome,
  required String visitNotes,
  Value<DateTime?> followUpDate,
  Value<String> photoIds,
  required int visitDurationMs,
  Value<bool> isSynced,
  Value<DateTime> createdAt,
  Value<int> rowid,
});
typedef $$CanvassingSessionsTableUpdateCompanionBuilder
    = CanvassingSessionsCompanion Function({
  Value<String> id,
  Value<String> prospectId,
  Value<DateTime> visitDate,
  Value<String> outcome,
  Value<String> visitNotes,
  Value<DateTime?> followUpDate,
  Value<String> photoIds,
  Value<int> visitDurationMs,
  Value<bool> isSynced,
  Value<DateTime> createdAt,
  Value<int> rowid,
});

final class $$CanvassingSessionsTableReferences extends BaseReferences<
    _$AppDatabase, $CanvassingSessionsTable, CanvassingSession> {
  $$CanvassingSessionsTableReferences(
      super.$_db, super.$_table, super.$_typedResult);

  static $ProspectCustomersTable _prospectIdTable(_$AppDatabase db) =>
      db.prospectCustomers.createAlias($_aliasNameGenerator(
          db.canvassingSessions.prospectId, db.prospectCustomers.id));

  $$ProspectCustomersTableProcessedTableManager get prospectId {
    final $_column = $_itemColumn<String>('prospect_id')!;

    final manager =
        $$ProspectCustomersTableTableManager($_db, $_db.prospectCustomers)
            .filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_prospectIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: [item]));
  }

  static MultiTypedResultKey<$CanvassingPhotosTable, List<CanvassingPhoto>>
      _canvassingPhotosRefsTable(_$AppDatabase db) =>
          MultiTypedResultKey.fromTable(db.canvassingPhotos,
              aliasName: $_aliasNameGenerator(
                  db.canvassingSessions.id, db.canvassingPhotos.sessionId));

  $$CanvassingPhotosTableProcessedTableManager get canvassingPhotosRefs {
    final manager = $$CanvassingPhotosTableTableManager(
            $_db, $_db.canvassingPhotos)
        .filter((f) => f.sessionId.id.sqlEquals($_itemColumn<String>('id')!));

    final cache =
        $_typedResult.readTableOrNull(_canvassingPhotosRefsTable($_db));
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: cache));
  }
}

class $$CanvassingSessionsTableFilterComposer
    extends Composer<_$AppDatabase, $CanvassingSessionsTable> {
  $$CanvassingSessionsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get visitDate => $composableBuilder(
      column: $table.visitDate, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get outcome => $composableBuilder(
      column: $table.outcome, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get visitNotes => $composableBuilder(
      column: $table.visitNotes, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get followUpDate => $composableBuilder(
      column: $table.followUpDate, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get photoIds => $composableBuilder(
      column: $table.photoIds, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get visitDurationMs => $composableBuilder(
      column: $table.visitDurationMs,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));

  $$ProspectCustomersTableFilterComposer get prospectId {
    final $$ProspectCustomersTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.prospectId,
        referencedTable: $db.prospectCustomers,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$ProspectCustomersTableFilterComposer(
              $db: $db,
              $table: $db.prospectCustomers,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }

  Expression<bool> canvassingPhotosRefs(
      Expression<bool> Function($$CanvassingPhotosTableFilterComposer f) f) {
    final $$CanvassingPhotosTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.id,
        referencedTable: $db.canvassingPhotos,
        getReferencedColumn: (t) => t.sessionId,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$CanvassingPhotosTableFilterComposer(
              $db: $db,
              $table: $db.canvassingPhotos,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return f(composer);
  }
}

class $$CanvassingSessionsTableOrderingComposer
    extends Composer<_$AppDatabase, $CanvassingSessionsTable> {
  $$CanvassingSessionsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get visitDate => $composableBuilder(
      column: $table.visitDate, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get outcome => $composableBuilder(
      column: $table.outcome, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get visitNotes => $composableBuilder(
      column: $table.visitNotes, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get followUpDate => $composableBuilder(
      column: $table.followUpDate,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get photoIds => $composableBuilder(
      column: $table.photoIds, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get visitDurationMs => $composableBuilder(
      column: $table.visitDurationMs,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));

  $$ProspectCustomersTableOrderingComposer get prospectId {
    final $$ProspectCustomersTableOrderingComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.prospectId,
        referencedTable: $db.prospectCustomers,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$ProspectCustomersTableOrderingComposer(
              $db: $db,
              $table: $db.prospectCustomers,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$CanvassingSessionsTableAnnotationComposer
    extends Composer<_$AppDatabase, $CanvassingSessionsTable> {
  $$CanvassingSessionsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<DateTime> get visitDate =>
      $composableBuilder(column: $table.visitDate, builder: (column) => column);

  GeneratedColumn<String> get outcome =>
      $composableBuilder(column: $table.outcome, builder: (column) => column);

  GeneratedColumn<String> get visitNotes => $composableBuilder(
      column: $table.visitNotes, builder: (column) => column);

  GeneratedColumn<DateTime> get followUpDate => $composableBuilder(
      column: $table.followUpDate, builder: (column) => column);

  GeneratedColumn<String> get photoIds =>
      $composableBuilder(column: $table.photoIds, builder: (column) => column);

  GeneratedColumn<int> get visitDurationMs => $composableBuilder(
      column: $table.visitDurationMs, builder: (column) => column);

  GeneratedColumn<bool> get isSynced =>
      $composableBuilder(column: $table.isSynced, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  $$ProspectCustomersTableAnnotationComposer get prospectId {
    final $$ProspectCustomersTableAnnotationComposer composer =
        $composerBuilder(
            composer: this,
            getCurrentColumn: (t) => t.prospectId,
            referencedTable: $db.prospectCustomers,
            getReferencedColumn: (t) => t.id,
            builder: (joinBuilder,
                    {$addJoinBuilderToRootComposer,
                    $removeJoinBuilderFromRootComposer}) =>
                $$ProspectCustomersTableAnnotationComposer(
                  $db: $db,
                  $table: $db.prospectCustomers,
                  $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                  joinBuilder: joinBuilder,
                  $removeJoinBuilderFromRootComposer:
                      $removeJoinBuilderFromRootComposer,
                ));
    return composer;
  }

  Expression<T> canvassingPhotosRefs<T extends Object>(
      Expression<T> Function($$CanvassingPhotosTableAnnotationComposer a) f) {
    final $$CanvassingPhotosTableAnnotationComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.id,
        referencedTable: $db.canvassingPhotos,
        getReferencedColumn: (t) => t.sessionId,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$CanvassingPhotosTableAnnotationComposer(
              $db: $db,
              $table: $db.canvassingPhotos,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return f(composer);
  }
}

class $$CanvassingSessionsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CanvassingSessionsTable,
    CanvassingSession,
    $$CanvassingSessionsTableFilterComposer,
    $$CanvassingSessionsTableOrderingComposer,
    $$CanvassingSessionsTableAnnotationComposer,
    $$CanvassingSessionsTableCreateCompanionBuilder,
    $$CanvassingSessionsTableUpdateCompanionBuilder,
    (CanvassingSession, $$CanvassingSessionsTableReferences),
    CanvassingSession,
    PrefetchHooks Function({bool prospectId, bool canvassingPhotosRefs})> {
  $$CanvassingSessionsTableTableManager(
      _$AppDatabase db, $CanvassingSessionsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$CanvassingSessionsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$CanvassingSessionsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$CanvassingSessionsTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> prospectId = const Value.absent(),
            Value<DateTime> visitDate = const Value.absent(),
            Value<String> outcome = const Value.absent(),
            Value<String> visitNotes = const Value.absent(),
            Value<DateTime?> followUpDate = const Value.absent(),
            Value<String> photoIds = const Value.absent(),
            Value<int> visitDurationMs = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CanvassingSessionsCompanion(
            id: id,
            prospectId: prospectId,
            visitDate: visitDate,
            outcome: outcome,
            visitNotes: visitNotes,
            followUpDate: followUpDate,
            photoIds: photoIds,
            visitDurationMs: visitDurationMs,
            isSynced: isSynced,
            createdAt: createdAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String prospectId,
            required DateTime visitDate,
            required String outcome,
            required String visitNotes,
            Value<DateTime?> followUpDate = const Value.absent(),
            Value<String> photoIds = const Value.absent(),
            required int visitDurationMs,
            Value<bool> isSynced = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CanvassingSessionsCompanion.insert(
            id: id,
            prospectId: prospectId,
            visitDate: visitDate,
            outcome: outcome,
            visitNotes: visitNotes,
            followUpDate: followUpDate,
            photoIds: photoIds,
            visitDurationMs: visitDurationMs,
            isSynced: isSynced,
            createdAt: createdAt,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (
                    e.readTable(table),
                    $$CanvassingSessionsTableReferences(db, table, e)
                  ))
              .toList(),
          prefetchHooksCallback: (
              {prospectId = false, canvassingPhotosRefs = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [
                if (canvassingPhotosRefs) db.canvassingPhotos
              ],
              addJoins: <
                  T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic>>(state) {
                if (prospectId) {
                  state = state.withJoin(
                    currentTable: table,
                    currentColumn: table.prospectId,
                    referencedTable: $$CanvassingSessionsTableReferences
                        ._prospectIdTable(db),
                    referencedColumn: $$CanvassingSessionsTableReferences
                        ._prospectIdTable(db)
                        .id,
                  ) as T;
                }

                return state;
              },
              getPrefetchedDataCallback: (items) async {
                return [
                  if (canvassingPhotosRefs)
                    await $_getPrefetchedData<CanvassingSession,
                            $CanvassingSessionsTable, CanvassingPhoto>(
                        currentTable: table,
                        referencedTable: $$CanvassingSessionsTableReferences
                            ._canvassingPhotosRefsTable(db),
                        managerFromTypedResult: (p0) =>
                            $$CanvassingSessionsTableReferences(db, table, p0)
                                .canvassingPhotosRefs,
                        referencedItemsForCurrentItem:
                            (item, referencedItems) => referencedItems
                                .where((e) => e.sessionId == item.id),
                        typedResults: items)
                ];
              },
            );
          },
        ));
}

typedef $$CanvassingSessionsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $CanvassingSessionsTable,
    CanvassingSession,
    $$CanvassingSessionsTableFilterComposer,
    $$CanvassingSessionsTableOrderingComposer,
    $$CanvassingSessionsTableAnnotationComposer,
    $$CanvassingSessionsTableCreateCompanionBuilder,
    $$CanvassingSessionsTableUpdateCompanionBuilder,
    (CanvassingSession, $$CanvassingSessionsTableReferences),
    CanvassingSession,
    PrefetchHooks Function({bool prospectId, bool canvassingPhotosRefs})>;
typedef $$CanvassingPhotosTableCreateCompanionBuilder
    = CanvassingPhotosCompanion Function({
  required String id,
  required String sessionId,
  required String filePath,
  required int fileSizeBytes,
  required DateTime capturedAt,
  Value<String?> caption,
  Value<bool> isSynced,
  Value<String?> syncedUrl,
  Value<DateTime> createdAt,
  Value<int> rowid,
});
typedef $$CanvassingPhotosTableUpdateCompanionBuilder
    = CanvassingPhotosCompanion Function({
  Value<String> id,
  Value<String> sessionId,
  Value<String> filePath,
  Value<int> fileSizeBytes,
  Value<DateTime> capturedAt,
  Value<String?> caption,
  Value<bool> isSynced,
  Value<String?> syncedUrl,
  Value<DateTime> createdAt,
  Value<int> rowid,
});

final class $$CanvassingPhotosTableReferences extends BaseReferences<
    _$AppDatabase, $CanvassingPhotosTable, CanvassingPhoto> {
  $$CanvassingPhotosTableReferences(
      super.$_db, super.$_table, super.$_typedResult);

  static $CanvassingSessionsTable _sessionIdTable(_$AppDatabase db) =>
      db.canvassingSessions.createAlias($_aliasNameGenerator(
          db.canvassingPhotos.sessionId, db.canvassingSessions.id));

  $$CanvassingSessionsTableProcessedTableManager get sessionId {
    final $_column = $_itemColumn<String>('session_id')!;

    final manager =
        $$CanvassingSessionsTableTableManager($_db, $_db.canvassingSessions)
            .filter((f) => f.id.sqlEquals($_column));
    final item = $_typedResult.readTableOrNull(_sessionIdTable($_db));
    if (item == null) return manager;
    return ProcessedTableManager(
        manager.$state.copyWith(prefetchedData: [item]));
  }
}

class $$CanvassingPhotosTableFilterComposer
    extends Composer<_$AppDatabase, $CanvassingPhotosTable> {
  $$CanvassingPhotosTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get filePath => $composableBuilder(
      column: $table.filePath, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get fileSizeBytes => $composableBuilder(
      column: $table.fileSizeBytes, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get capturedAt => $composableBuilder(
      column: $table.capturedAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get caption => $composableBuilder(
      column: $table.caption, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get syncedUrl => $composableBuilder(
      column: $table.syncedUrl, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));

  $$CanvassingSessionsTableFilterComposer get sessionId {
    final $$CanvassingSessionsTableFilterComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.sessionId,
        referencedTable: $db.canvassingSessions,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$CanvassingSessionsTableFilterComposer(
              $db: $db,
              $table: $db.canvassingSessions,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$CanvassingPhotosTableOrderingComposer
    extends Composer<_$AppDatabase, $CanvassingPhotosTable> {
  $$CanvassingPhotosTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get filePath => $composableBuilder(
      column: $table.filePath, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get fileSizeBytes => $composableBuilder(
      column: $table.fileSizeBytes,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get capturedAt => $composableBuilder(
      column: $table.capturedAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get caption => $composableBuilder(
      column: $table.caption, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isSynced => $composableBuilder(
      column: $table.isSynced, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get syncedUrl => $composableBuilder(
      column: $table.syncedUrl, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));

  $$CanvassingSessionsTableOrderingComposer get sessionId {
    final $$CanvassingSessionsTableOrderingComposer composer = $composerBuilder(
        composer: this,
        getCurrentColumn: (t) => t.sessionId,
        referencedTable: $db.canvassingSessions,
        getReferencedColumn: (t) => t.id,
        builder: (joinBuilder,
                {$addJoinBuilderToRootComposer,
                $removeJoinBuilderFromRootComposer}) =>
            $$CanvassingSessionsTableOrderingComposer(
              $db: $db,
              $table: $db.canvassingSessions,
              $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
              joinBuilder: joinBuilder,
              $removeJoinBuilderFromRootComposer:
                  $removeJoinBuilderFromRootComposer,
            ));
    return composer;
  }
}

class $$CanvassingPhotosTableAnnotationComposer
    extends Composer<_$AppDatabase, $CanvassingPhotosTable> {
  $$CanvassingPhotosTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get filePath =>
      $composableBuilder(column: $table.filePath, builder: (column) => column);

  GeneratedColumn<int> get fileSizeBytes => $composableBuilder(
      column: $table.fileSizeBytes, builder: (column) => column);

  GeneratedColumn<DateTime> get capturedAt => $composableBuilder(
      column: $table.capturedAt, builder: (column) => column);

  GeneratedColumn<String> get caption =>
      $composableBuilder(column: $table.caption, builder: (column) => column);

  GeneratedColumn<bool> get isSynced =>
      $composableBuilder(column: $table.isSynced, builder: (column) => column);

  GeneratedColumn<String> get syncedUrl =>
      $composableBuilder(column: $table.syncedUrl, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  $$CanvassingSessionsTableAnnotationComposer get sessionId {
    final $$CanvassingSessionsTableAnnotationComposer composer =
        $composerBuilder(
            composer: this,
            getCurrentColumn: (t) => t.sessionId,
            referencedTable: $db.canvassingSessions,
            getReferencedColumn: (t) => t.id,
            builder: (joinBuilder,
                    {$addJoinBuilderToRootComposer,
                    $removeJoinBuilderFromRootComposer}) =>
                $$CanvassingSessionsTableAnnotationComposer(
                  $db: $db,
                  $table: $db.canvassingSessions,
                  $addJoinBuilderToRootComposer: $addJoinBuilderToRootComposer,
                  joinBuilder: joinBuilder,
                  $removeJoinBuilderFromRootComposer:
                      $removeJoinBuilderFromRootComposer,
                ));
    return composer;
  }
}

class $$CanvassingPhotosTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CanvassingPhotosTable,
    CanvassingPhoto,
    $$CanvassingPhotosTableFilterComposer,
    $$CanvassingPhotosTableOrderingComposer,
    $$CanvassingPhotosTableAnnotationComposer,
    $$CanvassingPhotosTableCreateCompanionBuilder,
    $$CanvassingPhotosTableUpdateCompanionBuilder,
    (CanvassingPhoto, $$CanvassingPhotosTableReferences),
    CanvassingPhoto,
    PrefetchHooks Function({bool sessionId})> {
  $$CanvassingPhotosTableTableManager(
      _$AppDatabase db, $CanvassingPhotosTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$CanvassingPhotosTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$CanvassingPhotosTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$CanvassingPhotosTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> sessionId = const Value.absent(),
            Value<String> filePath = const Value.absent(),
            Value<int> fileSizeBytes = const Value.absent(),
            Value<DateTime> capturedAt = const Value.absent(),
            Value<String?> caption = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            Value<String?> syncedUrl = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CanvassingPhotosCompanion(
            id: id,
            sessionId: sessionId,
            filePath: filePath,
            fileSizeBytes: fileSizeBytes,
            capturedAt: capturedAt,
            caption: caption,
            isSynced: isSynced,
            syncedUrl: syncedUrl,
            createdAt: createdAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String sessionId,
            required String filePath,
            required int fileSizeBytes,
            required DateTime capturedAt,
            Value<String?> caption = const Value.absent(),
            Value<bool> isSynced = const Value.absent(),
            Value<String?> syncedUrl = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CanvassingPhotosCompanion.insert(
            id: id,
            sessionId: sessionId,
            filePath: filePath,
            fileSizeBytes: fileSizeBytes,
            capturedAt: capturedAt,
            caption: caption,
            isSynced: isSynced,
            syncedUrl: syncedUrl,
            createdAt: createdAt,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (
                    e.readTable(table),
                    $$CanvassingPhotosTableReferences(db, table, e)
                  ))
              .toList(),
          prefetchHooksCallback: ({sessionId = false}) {
            return PrefetchHooks(
              db: db,
              explicitlyWatchedTables: [],
              addJoins: <
                  T extends TableManagerState<
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic,
                      dynamic>>(state) {
                if (sessionId) {
                  state = state.withJoin(
                    currentTable: table,
                    currentColumn: table.sessionId,
                    referencedTable:
                        $$CanvassingPhotosTableReferences._sessionIdTable(db),
                    referencedColumn: $$CanvassingPhotosTableReferences
                        ._sessionIdTable(db)
                        .id,
                  ) as T;
                }

                return state;
              },
              getPrefetchedDataCallback: (items) async {
                return [];
              },
            );
          },
        ));
}

typedef $$CanvassingPhotosTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $CanvassingPhotosTable,
    CanvassingPhoto,
    $$CanvassingPhotosTableFilterComposer,
    $$CanvassingPhotosTableOrderingComposer,
    $$CanvassingPhotosTableAnnotationComposer,
    $$CanvassingPhotosTableCreateCompanionBuilder,
    $$CanvassingPhotosTableUpdateCompanionBuilder,
    (CanvassingPhoto, $$CanvassingPhotosTableReferences),
    CanvassingPhoto,
    PrefetchHooks Function({bool sessionId})>;
typedef $$MaterialProductsTableCreateCompanionBuilder
    = MaterialProductsCompanion Function({
  required String id,
  required String code,
  required String name,
  required String category,
  required String unit,
  required double basePrice,
  required String priceTiers,
  required String description,
  required String specifications,
  required String imageUrls,
  Value<bool> isActive,
  Value<int> stockLevel,
  required DateTime lastSyncedAt,
  Value<DateTime?> lastViewedAt,
  Value<int> rowid,
});
typedef $$MaterialProductsTableUpdateCompanionBuilder
    = MaterialProductsCompanion Function({
  Value<String> id,
  Value<String> code,
  Value<String> name,
  Value<String> category,
  Value<String> unit,
  Value<double> basePrice,
  Value<String> priceTiers,
  Value<String> description,
  Value<String> specifications,
  Value<String> imageUrls,
  Value<bool> isActive,
  Value<int> stockLevel,
  Value<DateTime> lastSyncedAt,
  Value<DateTime?> lastViewedAt,
  Value<int> rowid,
});

class $$MaterialProductsTableFilterComposer
    extends Composer<_$AppDatabase, $MaterialProductsTable> {
  $$MaterialProductsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get code => $composableBuilder(
      column: $table.code, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get category => $composableBuilder(
      column: $table.category, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get unit => $composableBuilder(
      column: $table.unit, builder: (column) => ColumnFilters(column));

  ColumnFilters<double> get basePrice => $composableBuilder(
      column: $table.basePrice, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get priceTiers => $composableBuilder(
      column: $table.priceTiers, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get description => $composableBuilder(
      column: $table.description, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get specifications => $composableBuilder(
      column: $table.specifications,
      builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get imageUrls => $composableBuilder(
      column: $table.imageUrls, builder: (column) => ColumnFilters(column));

  ColumnFilters<bool> get isActive => $composableBuilder(
      column: $table.isActive, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get stockLevel => $composableBuilder(
      column: $table.stockLevel, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get lastSyncedAt => $composableBuilder(
      column: $table.lastSyncedAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get lastViewedAt => $composableBuilder(
      column: $table.lastViewedAt, builder: (column) => ColumnFilters(column));
}

class $$MaterialProductsTableOrderingComposer
    extends Composer<_$AppDatabase, $MaterialProductsTable> {
  $$MaterialProductsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get code => $composableBuilder(
      column: $table.code, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get category => $composableBuilder(
      column: $table.category, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get unit => $composableBuilder(
      column: $table.unit, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<double> get basePrice => $composableBuilder(
      column: $table.basePrice, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get priceTiers => $composableBuilder(
      column: $table.priceTiers, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get description => $composableBuilder(
      column: $table.description, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get specifications => $composableBuilder(
      column: $table.specifications,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get imageUrls => $composableBuilder(
      column: $table.imageUrls, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<bool> get isActive => $composableBuilder(
      column: $table.isActive, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get stockLevel => $composableBuilder(
      column: $table.stockLevel, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get lastSyncedAt => $composableBuilder(
      column: $table.lastSyncedAt,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get lastViewedAt => $composableBuilder(
      column: $table.lastViewedAt,
      builder: (column) => ColumnOrderings(column));
}

class $$MaterialProductsTableAnnotationComposer
    extends Composer<_$AppDatabase, $MaterialProductsTable> {
  $$MaterialProductsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get code =>
      $composableBuilder(column: $table.code, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get category =>
      $composableBuilder(column: $table.category, builder: (column) => column);

  GeneratedColumn<String> get unit =>
      $composableBuilder(column: $table.unit, builder: (column) => column);

  GeneratedColumn<double> get basePrice =>
      $composableBuilder(column: $table.basePrice, builder: (column) => column);

  GeneratedColumn<String> get priceTiers => $composableBuilder(
      column: $table.priceTiers, builder: (column) => column);

  GeneratedColumn<String> get description => $composableBuilder(
      column: $table.description, builder: (column) => column);

  GeneratedColumn<String> get specifications => $composableBuilder(
      column: $table.specifications, builder: (column) => column);

  GeneratedColumn<String> get imageUrls =>
      $composableBuilder(column: $table.imageUrls, builder: (column) => column);

  GeneratedColumn<bool> get isActive =>
      $composableBuilder(column: $table.isActive, builder: (column) => column);

  GeneratedColumn<int> get stockLevel => $composableBuilder(
      column: $table.stockLevel, builder: (column) => column);

  GeneratedColumn<DateTime> get lastSyncedAt => $composableBuilder(
      column: $table.lastSyncedAt, builder: (column) => column);

  GeneratedColumn<DateTime> get lastViewedAt => $composableBuilder(
      column: $table.lastViewedAt, builder: (column) => column);
}

class $$MaterialProductsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $MaterialProductsTable,
    MaterialProduct,
    $$MaterialProductsTableFilterComposer,
    $$MaterialProductsTableOrderingComposer,
    $$MaterialProductsTableAnnotationComposer,
    $$MaterialProductsTableCreateCompanionBuilder,
    $$MaterialProductsTableUpdateCompanionBuilder,
    (
      MaterialProduct,
      BaseReferences<_$AppDatabase, $MaterialProductsTable, MaterialProduct>
    ),
    MaterialProduct,
    PrefetchHooks Function()> {
  $$MaterialProductsTableTableManager(
      _$AppDatabase db, $MaterialProductsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MaterialProductsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MaterialProductsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MaterialProductsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> code = const Value.absent(),
            Value<String> name = const Value.absent(),
            Value<String> category = const Value.absent(),
            Value<String> unit = const Value.absent(),
            Value<double> basePrice = const Value.absent(),
            Value<String> priceTiers = const Value.absent(),
            Value<String> description = const Value.absent(),
            Value<String> specifications = const Value.absent(),
            Value<String> imageUrls = const Value.absent(),
            Value<bool> isActive = const Value.absent(),
            Value<int> stockLevel = const Value.absent(),
            Value<DateTime> lastSyncedAt = const Value.absent(),
            Value<DateTime?> lastViewedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              MaterialProductsCompanion(
            id: id,
            code: code,
            name: name,
            category: category,
            unit: unit,
            basePrice: basePrice,
            priceTiers: priceTiers,
            description: description,
            specifications: specifications,
            imageUrls: imageUrls,
            isActive: isActive,
            stockLevel: stockLevel,
            lastSyncedAt: lastSyncedAt,
            lastViewedAt: lastViewedAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String code,
            required String name,
            required String category,
            required String unit,
            required double basePrice,
            required String priceTiers,
            required String description,
            required String specifications,
            required String imageUrls,
            Value<bool> isActive = const Value.absent(),
            Value<int> stockLevel = const Value.absent(),
            required DateTime lastSyncedAt,
            Value<DateTime?> lastViewedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              MaterialProductsCompanion.insert(
            id: id,
            code: code,
            name: name,
            category: category,
            unit: unit,
            basePrice: basePrice,
            priceTiers: priceTiers,
            description: description,
            specifications: specifications,
            imageUrls: imageUrls,
            isActive: isActive,
            stockLevel: stockLevel,
            lastSyncedAt: lastSyncedAt,
            lastViewedAt: lastViewedAt,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$MaterialProductsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $MaterialProductsTable,
    MaterialProduct,
    $$MaterialProductsTableFilterComposer,
    $$MaterialProductsTableOrderingComposer,
    $$MaterialProductsTableAnnotationComposer,
    $$MaterialProductsTableCreateCompanionBuilder,
    $$MaterialProductsTableUpdateCompanionBuilder,
    (
      MaterialProduct,
      BaseReferences<_$AppDatabase, $MaterialProductsTable, MaterialProduct>
    ),
    MaterialProduct,
    PrefetchHooks Function()>;
typedef $$MaterialCategoriesTableCreateCompanionBuilder
    = MaterialCategoriesCompanion Function({
  required String id,
  required String name,
  Value<String?> parentId,
  required int productCount,
  required String iconName,
  Value<int> rowid,
});
typedef $$MaterialCategoriesTableUpdateCompanionBuilder
    = MaterialCategoriesCompanion Function({
  Value<String> id,
  Value<String> name,
  Value<String?> parentId,
  Value<int> productCount,
  Value<String> iconName,
  Value<int> rowid,
});

class $$MaterialCategoriesTableFilterComposer
    extends Composer<_$AppDatabase, $MaterialCategoriesTable> {
  $$MaterialCategoriesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get parentId => $composableBuilder(
      column: $table.parentId, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get productCount => $composableBuilder(
      column: $table.productCount, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get iconName => $composableBuilder(
      column: $table.iconName, builder: (column) => ColumnFilters(column));
}

class $$MaterialCategoriesTableOrderingComposer
    extends Composer<_$AppDatabase, $MaterialCategoriesTable> {
  $$MaterialCategoriesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get name => $composableBuilder(
      column: $table.name, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get parentId => $composableBuilder(
      column: $table.parentId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get productCount => $composableBuilder(
      column: $table.productCount,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get iconName => $composableBuilder(
      column: $table.iconName, builder: (column) => ColumnOrderings(column));
}

class $$MaterialCategoriesTableAnnotationComposer
    extends Composer<_$AppDatabase, $MaterialCategoriesTable> {
  $$MaterialCategoriesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get parentId =>
      $composableBuilder(column: $table.parentId, builder: (column) => column);

  GeneratedColumn<int> get productCount => $composableBuilder(
      column: $table.productCount, builder: (column) => column);

  GeneratedColumn<String> get iconName =>
      $composableBuilder(column: $table.iconName, builder: (column) => column);
}

class $$MaterialCategoriesTableTableManager extends RootTableManager<
    _$AppDatabase,
    $MaterialCategoriesTable,
    MaterialCategory,
    $$MaterialCategoriesTableFilterComposer,
    $$MaterialCategoriesTableOrderingComposer,
    $$MaterialCategoriesTableAnnotationComposer,
    $$MaterialCategoriesTableCreateCompanionBuilder,
    $$MaterialCategoriesTableUpdateCompanionBuilder,
    (
      MaterialCategory,
      BaseReferences<_$AppDatabase, $MaterialCategoriesTable, MaterialCategory>
    ),
    MaterialCategory,
    PrefetchHooks Function()> {
  $$MaterialCategoriesTableTableManager(
      _$AppDatabase db, $MaterialCategoriesTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$MaterialCategoriesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$MaterialCategoriesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$MaterialCategoriesTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> name = const Value.absent(),
            Value<String?> parentId = const Value.absent(),
            Value<int> productCount = const Value.absent(),
            Value<String> iconName = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              MaterialCategoriesCompanion(
            id: id,
            name: name,
            parentId: parentId,
            productCount: productCount,
            iconName: iconName,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String name,
            Value<String?> parentId = const Value.absent(),
            required int productCount,
            required String iconName,
            Value<int> rowid = const Value.absent(),
          }) =>
              MaterialCategoriesCompanion.insert(
            id: id,
            name: name,
            parentId: parentId,
            productCount: productCount,
            iconName: iconName,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$MaterialCategoriesTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $MaterialCategoriesTable,
    MaterialCategory,
    $$MaterialCategoriesTableFilterComposer,
    $$MaterialCategoriesTableOrderingComposer,
    $$MaterialCategoriesTableAnnotationComposer,
    $$MaterialCategoriesTableCreateCompanionBuilder,
    $$MaterialCategoriesTableUpdateCompanionBuilder,
    (
      MaterialCategory,
      BaseReferences<_$AppDatabase, $MaterialCategoriesTable, MaterialCategory>
    ),
    MaterialCategory,
    PrefetchHooks Function()>;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$UsersTableTableManager get users =>
      $$UsersTableTableManager(_db, _db.users);
  $$SyncQueueTableTableManager get syncQueue =>
      $$SyncQueueTableTableManager(_db, _db.syncQueue);
  $$DailyReportsTableTableManager get dailyReports =>
      $$DailyReportsTableTableManager(_db, _db.dailyReports);
  $$CustomerVisitsTableTableManager get customerVisits =>
      $$CustomerVisitsTableTableManager(_db, _db.customerVisits);
  $$DailyPlanningTableTableManager get dailyPlanning =>
      $$DailyPlanningTableTableManager(_db, _db.dailyPlanning);
  $$ProspectCustomersTableTableManager get prospectCustomers =>
      $$ProspectCustomersTableTableManager(_db, _db.prospectCustomers);
  $$CanvassingSessionsTableTableManager get canvassingSessions =>
      $$CanvassingSessionsTableTableManager(_db, _db.canvassingSessions);
  $$CanvassingPhotosTableTableManager get canvassingPhotos =>
      $$CanvassingPhotosTableTableManager(_db, _db.canvassingPhotos);
  $$MaterialProductsTableTableManager get materialProducts =>
      $$MaterialProductsTableTableManager(_db, _db.materialProducts);
  $$MaterialCategoriesTableTableManager get materialCategories =>
      $$MaterialCategoriesTableTableManager(_db, _db.materialCategories);
}
