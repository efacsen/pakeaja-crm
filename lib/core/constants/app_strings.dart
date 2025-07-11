/// Common UI text strings used throughout the app
class AppStrings {
  // Private constructor to prevent instantiation
  AppStrings._();
  
  // App Info
  static const String appName = 'PakeAja CRM';
  static const String appTagline = 'Your Field Sales Companion';
  
  // Common Actions
  static const String save = 'Save';
  static const String cancel = 'Cancel';
  static const String delete = 'Delete';
  static const String edit = 'Edit';
  static const String create = 'Create';
  static const String update = 'Update';
  static const String submit = 'Submit';
  static const String confirm = 'Confirm';
  static const String back = 'Back';
  static const String next = 'Next';
  static const String previous = 'Previous';
  static const String done = 'Done';
  static const String close = 'Close';
  static const String retry = 'Retry';
  static const String refresh = 'Refresh';
  static const String search = 'Search';
  static const String filter = 'Filter';
  static const String sort = 'Sort';
  static const String clear = 'Clear';
  static const String reset = 'Reset';
  static const String apply = 'Apply';
  static const String select = 'Select';
  static const String selectAll = 'Select All';
  static const String deselectAll = 'Deselect All';
  static const String add = 'Add';
  static const String remove = 'Remove';
  static const String upload = 'Upload';
  static const String download = 'Download';
  static const String share = 'Share';
  static const String copy = 'Copy';
  static const String paste = 'Paste';
  static const String cut = 'Cut';
  
  // Common Labels
  static const String name = 'Name';
  static const String email = 'Email';
  static const String phone = 'Phone';
  static const String address = 'Address';
  static const String date = 'Date';
  static const String time = 'Time';
  static const String description = 'Description';
  static const String notes = 'Notes';
  static const String status = 'Status';
  static const String type = 'Type';
  static const String category = 'Category';
  static const String price = 'Price';
  static const String quantity = 'Quantity';
  static const String total = 'Total';
  static const String subtotal = 'Subtotal';
  static const String tax = 'Tax';
  static const String discount = 'Discount';
  static const String id = 'ID';
  static const String code = 'Code';
  static const String title = 'Title';
  static const String message = 'Message';
  
  // Status Messages
  static const String loading = 'Loading...';
  static const String processing = 'Processing...';
  static const String saving = 'Saving...';
  static const String deleting = 'Deleting...';
  static const String updating = 'Updating...';
  static const String submitting = 'Submitting...';
  static const String uploading = 'Uploading...';
  static const String downloading = 'Downloading...';
  static const String syncing = 'Syncing...';
  static const String success = 'Success';
  static const String error = 'Error';
  static const String warning = 'Warning';
  static const String info = 'Info';
  
  // Empty States
  static const String noData = 'No data available';
  static const String noResults = 'No results found';
  static const String noItems = 'No items to display';
  static const String emptyList = 'List is empty';
  static const String nothingHere = 'Nothing here yet';
  static const String getStarted = 'Get started by adding your first item';
  
  // Error Messages
  static const String genericError = 'Something went wrong';
  static const String networkError = 'Network connection error';
  static const String serverError = 'Server error occurred';
  static const String timeoutError = 'Request timed out';
  static const String unknownError = 'Unknown error occurred';
  static const String tryAgain = 'Please try again';
  static const String tryAgainLater = 'Please try again later';
  static const String checkConnection = 'Please check your internet connection';
  static const String offline = 'You are offline';
  static const String offlineMessage = 'Some features may be limited while offline';
  
  // Success Messages
  static const String savedSuccessfully = 'Saved successfully';
  static const String deletedSuccessfully = 'Deleted successfully';
  static const String updatedSuccessfully = 'Updated successfully';
  static const String createdSuccessfully = 'Created successfully';
  static const String submittedSuccessfully = 'Submitted successfully';
  static const String uploadedSuccessfully = 'Uploaded successfully';
  static const String copiedToClipboard = 'Copied to clipboard';
  
  // Confirmation Messages
  static const String areYouSure = 'Are you sure?';
  static const String confirmDelete = 'Are you sure you want to delete this?';
  static const String confirmCancel = 'Are you sure you want to cancel?';
  static const String unsavedChanges = 'You have unsaved changes';
  static const String discardChanges = 'Discard changes?';
  static const String saveChanges = 'Save changes?';
  static const String thisActionCannotBeUndone = 'This action cannot be undone';
  
  // Validation Messages
  static const String fieldRequired = 'This field is required';
  static const String invalidEmail = 'Please enter a valid email';
  static const String invalidPhone = 'Please enter a valid phone number';
  static const String invalidUrl = 'Please enter a valid URL';
  static const String invalidNumber = 'Please enter a valid number';
  static const String invalidDate = 'Please enter a valid date';
  static const String minLength = 'Minimum length is {0} characters';
  static const String maxLength = 'Maximum length is {0} characters';
  static const String minValue = 'Minimum value is {0}';
  static const String maxValue = 'Maximum value is {0}';
  static const String passwordMismatch = 'Passwords do not match';
  static const String weakPassword = 'Password is too weak';
  
  // Date/Time
  static const String today = 'Today';
  static const String yesterday = 'Yesterday';
  static const String tomorrow = 'Tomorrow';
  static const String thisWeek = 'This Week';
  static const String lastWeek = 'Last Week';
  static const String thisMonth = 'This Month';
  static const String lastMonth = 'Last Month';
  static const String customRange = 'Custom Range';
  static const String startDate = 'Start Date';
  static const String endDate = 'End Date';
  static const String selectDate = 'Select Date';
  static const String selectTime = 'Select Time';
  static const String selectDateRange = 'Select Date Range';
  
  // Search/Filter
  static const String searchPlaceholder = 'Search...';
  static const String noSearchResults = 'No results found for "{0}"';
  static const String clearSearch = 'Clear search';
  static const String filterBy = 'Filter by';
  static const String sortBy = 'Sort by';
  static const String ascending = 'Ascending';
  static const String descending = 'Descending';
  
  // Pagination
  static const String page = 'Page';
  static const String of = 'of';
  static const String showing = 'Showing';
  static const String to = 'to';
  static const String items = 'items';
  static const String itemsPerPage = 'Items per page';
  static const String firstPage = 'First page';
  static const String lastPage = 'Last page';
  static const String previousPage = 'Previous page';
  static const String nextPage = 'Next page';
  
  // File Upload
  static const String selectFile = 'Select file';
  static const String selectImage = 'Select image';
  static const String takePhoto = 'Take photo';
  static const String chooseFromGallery = 'Choose from gallery';
  static const String removeFile = 'Remove file';
  static const String fileSize = 'File size';
  static const String maxFileSize = 'Maximum file size is {0}';
  static const String unsupportedFileType = 'Unsupported file type';
  static const String allowedFileTypes = 'Allowed file types: {0}';
  
  // Accessibility
  static const String loading_a11y = 'Loading content';
  static const String close_a11y = 'Close dialog';
  static const String delete_a11y = 'Delete item';
  static const String edit_a11y = 'Edit item';
  static const String menu_a11y = 'Menu';
  static const String moreOptions_a11y = 'More options';
  static const String back_a11y = 'Go back';
  static const String expand_a11y = 'Expand';
  static const String collapse_a11y = 'Collapse';
  
  // Offline/Sync
  static const String offlineMode = 'Offline Mode';
  static const String syncPending = 'Sync pending';
  static const String syncInProgress = 'Syncing data...';
  static const String syncComplete = 'Sync complete';
  static const String syncFailed = 'Sync failed';
  static const String lastSynced = 'Last synced: {0}';
  static const String dataWillBeSyncedWhenOnline = 'Data will be synced when online';
  
  // Dialog Titles
  static const String confirmation = 'Confirmation';
  static const String information = 'Information';
  static const String warningTitle = 'Warning';
  static const String errorTitle = 'Error';
  static const String successTitle = 'Success';
  
  // Placeholders
  static const String enterText = 'Enter text';
  static const String selectOption = 'Select an option';
  static const String noSelection = 'No selection';
  static const String optional = 'Optional';
  static const String required = 'Required';
  
  // Units
  static const String days = 'days';
  static const String hours = 'hours';
  static const String minutes = 'minutes';
  static const String seconds = 'seconds';
  static const String meters = 'meters';
  static const String kilometers = 'kilometers';
  static const String pieces = 'pieces';
  static const String units = 'units';
  
  // Helper method to replace placeholders
  static String format(String template, List<String> args) {
    String result = template;
    for (int i = 0; i < args.length; i++) {
      result = result.replaceAll('{$i}', args[i]);
    }
    return result;
  }
}