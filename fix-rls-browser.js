// Run this in your browser dev tools on your Vercel site
// This will disable RLS on the orders table temporarily

async function fixRLS() {
  try {
    const response = await fetch('/api/fix-rls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.text();
    console.log('RLS Fix Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run this function
fixRLS(); 