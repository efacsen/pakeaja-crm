// Force logout script - run this in browser console if needed
(() => {
  console.log('🔄 Force logout initiated...');
  
  // Clear all localStorage
  localStorage.clear();
  
  // Clear all sessionStorage
  sessionStorage.clear();
  
  // Clear all cookies for localhost
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  console.log('✅ Local storage cleared');
  console.log('✅ Session storage cleared');
  console.log('✅ Cookies cleared');
  console.log('🔄 Redirecting to login...');
  
  // Force redirect to login
  window.location.href = '/login';
})();