console.log('🔍 AUTHENTICATION DEBUGGER');
console.log('=========================');

// Check if we're in the browser
if (typeof window !== 'undefined' && window.localStorage) {
  const adminToken = localStorage.getItem('admin_token');
  const adminUser = localStorage.getItem('admin_user');
  
  console.log('\n📊 Current Auth State:');
  console.log('- Admin Token:', adminToken ? `${adminToken.substring(0, 20)}...` : 'NULL');
  console.log('- Admin User:', adminUser ? 'EXISTS' : 'NULL');
  
  if (adminUser) {
    try {
      const user = JSON.parse(adminUser);
      console.log('- User Email:', user.email);
      console.log('- User Role:', user.role);
      console.log('- Expires At:', user.expires_at);
      console.log('- Is Expired:', new Date(user.expires_at) < new Date());
    } catch (error) {
      console.log('- User Data Error:', error.message);
    }
  }
  
  console.log('\n🧪 Testing Auth Functions:');
  
  // Test admin login
  const testLogin = () => {
    console.log('Testing admin login...');
    localStorage.setItem('admin_token', 'test-token-' + Date.now());
    localStorage.setItem('admin_user', JSON.stringify({
      id: 'test-admin',
      email: 'admin@test.com',
      role: 'admin',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }));
    console.log('✅ Test credentials set');
  };
  
  // Test admin logout
  const testLogout = () => {
    console.log('Testing admin logout...');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    console.log('✅ Credentials cleared');
  };
  
  // Add test functions to global scope
  window.testAdminLogin = testLogin;
  window.testAdminLogout = testLogout;
  
  console.log('\n🛠️ Available Commands:');
  console.log('- testAdminLogin() - Set test admin credentials');
  console.log('- testAdminLogout() - Clear all credentials');
  
} else {
  console.log('❌ Not running in browser environment');
}

// For Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  console.log('🖥️ Running in Node.js - Use browser console instead');
} 