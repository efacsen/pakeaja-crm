/// Validation rules and patterns for form inputs
class ValidationRules {
  // Private constructor to prevent instantiation
  ValidationRules._();
  
  // Regular Expression Patterns
  static final RegExp emailPattern = RegExp(
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  );
  
  static final RegExp phonePattern = RegExp(
    r'^\+?[0-9]{10,15}$',
  );
  
  static final RegExp indonesianPhonePattern = RegExp(
    r'^(\+62|62|0)8[1-9][0-9]{7,11}$',
  );
  
  static final RegExp urlPattern = RegExp(
    r'^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$',
  );
  
  static final RegExp alphaOnly = RegExp(r'^[a-zA-Z]+$');
  
  static final RegExp alphaNumeric = RegExp(r'^[a-zA-Z0-9]+$');
  
  static final RegExp alphaNumericSpace = RegExp(r'^[a-zA-Z0-9\s]+$');
  
  static final RegExp numericOnly = RegExp(r'^[0-9]+$');
  
  static final RegExp decimalPattern = RegExp(r'^\d+\.?\d{0,2}$');
  
  static final RegExp currencyPattern = RegExp(r'^\d{1,3}(,\d{3})*(\.\d{0,2})?$');
  
  static final RegExp passwordPattern = RegExp(
    r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$',
  );
  
  static final RegExp usernamePattern = RegExp(
    r'^[a-zA-Z0-9_]{3,20}$',
  );
  
  static final RegExp indonesianNIKPattern = RegExp(
    r'^\d{16}$',
  );
  
  static final RegExp indonesianNPWPPattern = RegExp(
    r'^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$',
  );
  
  static final RegExp postalCodePattern = RegExp(r'^\d{5}$');
  
  static final RegExp creditCardPattern = RegExp(
    r'^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$',
  );
  
  static final RegExp datePattern = RegExp(
    r'^\d{4}-\d{2}-\d{2}$', // YYYY-MM-DD
  );
  
  static final RegExp timePattern = RegExp(
    r'^([01]?[0-9]|2[0-3]):[0-5][0-9]$', // HH:MM
  );
  
  // Length Constraints
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 128;
  static const int minUsernameLength = 3;
  static const int maxUsernameLength = 20;
  static const int minNameLength = 2;
  static const int maxNameLength = 50;
  static const int maxEmailLength = 254;
  static const int maxPhoneLength = 15;
  static const int maxAddressLength = 200;
  static const int maxDescriptionLength = 500;
  static const int maxNotesLength = 1000;
  static const int nikLength = 16;
  static const int postalCodeLength = 5;
  
  // Numeric Constraints
  static const double minPrice = 0;
  static const double maxPrice = 999999999.99;
  static const int minQuantity = 0;
  static const int maxQuantity = 999999;
  static const double minDiscount = 0;
  static const double maxDiscount = 100;
  static const double minTax = 0;
  static const double maxTax = 100;
  
  // File Constraints
  static const int maxFileSize = 10 * 1024 * 1024; // 10MB
  static const int maxImageSize = 5 * 1024 * 1024; // 5MB
  static const int maxDocumentSize = 10 * 1024 * 1024; // 10MB
  static const List<String> allowedImageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
  ];
  static const List<String> allowedDocumentExtensions = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
  ];
  
  // Validation Methods
  static bool isValidEmail(String email) {
    return emailPattern.hasMatch(email) && email.length <= maxEmailLength;
  }
  
  static bool isValidPhone(String phone) {
    return phonePattern.hasMatch(phone) || indonesianPhonePattern.hasMatch(phone);
  }
  
  static bool isValidIndonesianPhone(String phone) {
    return indonesianPhonePattern.hasMatch(phone);
  }
  
  static bool isValidUrl(String url) {
    return urlPattern.hasMatch(url);
  }
  
  static bool isValidPassword(String password) {
    return password.length >= minPasswordLength &&
        password.length <= maxPasswordLength &&
        passwordPattern.hasMatch(password);
  }
  
  static bool isValidUsername(String username) {
    return username.length >= minUsernameLength &&
        username.length <= maxUsernameLength &&
        usernamePattern.hasMatch(username);
  }
  
  static bool isValidNIK(String nik) {
    return indonesianNIKPattern.hasMatch(nik);
  }
  
  static bool isValidNPWP(String npwp) {
    return indonesianNPWPPattern.hasMatch(npwp);
  }
  
  static bool isValidPostalCode(String postalCode) {
    return postalCodePattern.hasMatch(postalCode);
  }
  
  static bool isValidCreditCard(String creditCard) {
    final cleaned = creditCard.replaceAll(RegExp(r'[\s-]'), '');
    if (!RegExp(r'^\d{16}$').hasMatch(cleaned)) return false;
    
    // Luhn algorithm validation
    int sum = 0;
    bool alternate = false;
    for (int i = cleaned.length - 1; i >= 0; i--) {
      int digit = int.parse(cleaned[i]);
      if (alternate) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      alternate = !alternate;
    }
    return sum % 10 == 0;
  }
  
  static bool isValidDate(String date) {
    if (!datePattern.hasMatch(date)) return false;
    
    try {
      final parts = date.split('-');
      final year = int.parse(parts[0]);
      final month = int.parse(parts[1]);
      final day = int.parse(parts[2]);
      
      final dateTime = DateTime(year, month, day);
      return dateTime.year == year &&
          dateTime.month == month &&
          dateTime.day == day;
    } catch (e) {
      return false;
    }
  }
  
  static bool isValidTime(String time) {
    return timePattern.hasMatch(time);
  }
  
  static bool isValidCurrency(String value) {
    return currencyPattern.hasMatch(value);
  }
  
  static bool isValidDecimal(String value, {int? maxDecimals = 2}) {
    final pattern = RegExp('^\\d+\\.?\\d{0,$maxDecimals}\$');
    return pattern.hasMatch(value);
  }
  
  // Helper Methods
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }
    return null;
  }
  
  static String? validateMinLength(String? value, int minLength, String fieldName) {
    if (value == null || value.length < minLength) {
      return '$fieldName must be at least $minLength characters';
    }
    return null;
  }
  
  static String? validateMaxLength(String? value, int maxLength, String fieldName) {
    if (value != null && value.length > maxLength) {
      return '$fieldName must be no more than $maxLength characters';
    }
    return null;
  }
  
  static String? validateLength(
    String? value,
    int minLength,
    int maxLength,
    String fieldName,
  ) {
    if (value == null || value.length < minLength) {
      return '$fieldName must be at least $minLength characters';
    }
    if (value.length > maxLength) {
      return '$fieldName must be no more than $maxLength characters';
    }
    return null;
  }
  
  static String? validateRange(
    num? value,
    num min,
    num max,
    String fieldName,
  ) {
    if (value == null) {
      return '$fieldName is required';
    }
    if (value < min) {
      return '$fieldName must be at least $min';
    }
    if (value > max) {
      return '$fieldName must be no more than $max';
    }
    return null;
  }
  
  static String? validatePattern(
    String? value,
    RegExp pattern,
    String fieldName,
    String errorMessage,
  ) {
    if (value == null || !pattern.hasMatch(value)) {
      return errorMessage;
    }
    return null;
  }
  
  // Sanitization Methods
  static String sanitizePhone(String phone) {
    // Remove all non-numeric characters
    String cleaned = phone.replaceAll(RegExp(r'[^0-9+]'), '');
    
    // Convert Indonesian format
    if (cleaned.startsWith('0')) {
      cleaned = '+62${cleaned.substring(1)}';
    } else if (cleaned.startsWith('62')) {
      cleaned = '+$cleaned';
    }
    
    return cleaned;
  }
  
  static String sanitizeCurrency(String value) {
    // Remove all non-numeric characters except decimal point
    return value.replaceAll(RegExp(r'[^0-9.]'), '');
  }
  
  static String sanitizeNPWP(String npwp) {
    // Remove all formatting and keep only numbers
    return npwp.replaceAll(RegExp(r'[^0-9]'), '');
  }
  
  static String formatNPWP(String npwp) {
    final cleaned = sanitizeNPWP(npwp);
    if (cleaned.length != 15) return npwp;
    
    return '${cleaned.substring(0, 2)}.'
        '${cleaned.substring(2, 5)}.'
        '${cleaned.substring(5, 8)}.'
        '${cleaned.substring(8, 9)}-'
        '${cleaned.substring(9, 12)}.'
        '${cleaned.substring(12, 15)}';
  }
}