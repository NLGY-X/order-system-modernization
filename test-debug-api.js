// Test the debug API to see exactly what's happening with Supabase
async function testDebugAPI() {
  try {
    console.log('Testing debug API...')
    
    const response = await fetch('http://localhost:3002/api/debug-supabase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const result = await response.json()
    
    console.log('\n=== DEBUG API RESULTS ===')
    console.log('Success:', result.success)
    
    if (result.config) {
      console.log('\n--- Configuration ---')
      console.log('Supabase URL:', result.config.supabaseUrl?.substring(0, 30) + '...')
      console.log('Has Anon Key:', result.config.hasAnonKey)
      console.log('Has Service Key:', result.config.hasServiceKey)
    }
    
    if (result.results) {
      console.log('\n--- Anon Client Test ---')
      console.log('Data:', result.results.anonClient.data ? 'Success' : 'Failed')
      console.log('Error:', result.results.anonClient.error)
      
      console.log('\n--- Service Client Test ---')
      console.log('Data:', result.results.serviceClient.data ? 'Success' : 'Failed')
      console.log('Error:', result.results.serviceClient.error)
    }
    
    if (result.error) {
      console.log('\n--- API Error ---')
      console.log('Error:', result.error)
    }
    
  } catch (error) {
    console.error('Failed to call debug API:', error.message)
  }
}

testDebugAPI() 