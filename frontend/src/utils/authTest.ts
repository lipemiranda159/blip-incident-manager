/**
 * Utility for testing JWT authentication flow
 * This file can be used to verify that the JWT token system is working correctly
 */

import { apiClient } from '../services';

export const testAuthFlow = async () => {
  console.log('🔐 Testing JWT Authentication Flow...');
  
  try {
    // Test 1: Check if token is properly cleared initially
    console.log('1. Clearing any existing tokens...');
    apiClient.clearAuthToken();
    console.log('✅ Token cleared');
    
    // Test 2: Attempt to access protected endpoint without token (should fail)
    console.log('2. Testing protected endpoint without token...');
    try {
      await apiClient.incidents.getIncidents();
      console.log('❌ ERROR: Protected endpoint accessible without token!');
    } catch (error) {
      console.log('✅ Protected endpoint correctly rejected unauthorized request');
    }
    
    // Test 3: Login and verify token is stored
    console.log('3. Testing login flow...');
    // Note: Replace with actual test credentials
    const loginResult = await apiClient.auth.login({
      email: 'test@example.com',
      password: 'password123'
    });
    
    if (loginResult.status === 200 && loginResult.data.token) {
      console.log('✅ Login successful, token received:', loginResult.data.token.substring(0, 20) + '...');
      
      // Test 4: Verify token is stored in localStorage
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        console.log('✅ Token properly stored in localStorage');
      } else {
        console.log('❌ ERROR: Token not stored in localStorage');
      }
      
      // Test 5: Test protected endpoint with token
      console.log('4. Testing protected endpoint with token...');
      try {
        const incidents = await apiClient.incidents.getIncidents();
        console.log('✅ Protected endpoint accessible with token, received', incidents.data?.items?.length || 0, 'incidents');
      } catch (error) {
        console.log('❌ ERROR: Protected endpoint failed with token:', error);
      }
      
    } else {
      console.log('❌ ERROR: Login failed or no token received');
    }
    
    // Test 6: Test logout
    console.log('5. Testing logout...');
    apiClient.auth.logout();
    const tokenAfterLogout = localStorage.getItem('authToken');
    if (!tokenAfterLogout) {
      console.log('✅ Token properly cleared after logout');
    } else {
      console.log('❌ ERROR: Token not cleared after logout');
    }
    
    console.log('🎉 JWT Authentication test completed!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
  }
};

// Export for manual testing in browser console
(window as any).testAuthFlow = testAuthFlow;
