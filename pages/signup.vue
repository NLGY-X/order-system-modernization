<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Back to Home Link - moved outside the hero section -->
      <div class="mb-8">
        <NuxtLink 
          to="/"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/70 rounded-lg shadow-sm transition-all duration-200 backdrop-blur-sm border border-gray-700"
          title="Back to Home"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </NuxtLink>
      </div>

      <!-- Header -->
      <div class="text-center mb-12">
        <div class="mb-8">
          <h1 class="text-5xl font-bold text-white mb-6">
            Apply for the 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              certificates.dev Partner Program
            </span>
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join our exclusive partner program to offer industry-trusted developer certifications through your training organization with special pricing and dedicated support.
          </p>
        </div>
      </div>

      <!-- Success State -->
      <div v-if="submitted" class="max-w-2xl mx-auto">
        <div class="bg-green-900/20 border border-green-500/30 rounded-2xl p-8 backdrop-blur-sm text-center">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white mb-4">Application Submitted!</h2>
          <p class="text-gray-300 mb-6">
            Thank you for your interest in the certificates.dev partner program. Our team will review your application and send you access credentials within 24 hours.
          </p>
          <div class="space-y-4">
            <p class="text-sm text-gray-400">
              <strong>Next steps:</strong>
            </p>
            <ul class="text-sm text-gray-400 space-y-2">
              <li>• We'll verify your organization details</li>
              <li>• You'll receive login credentials via email</li>
              <li>• Access to our bulk ordering system with volume pricing</li>
            </ul>
          </div>
          <div class="mt-8">
            <NuxtLink 
              to="/"
              class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Return to Home
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Signup Form -->
      <div v-else class="max-w-3xl mx-auto">
        <div class="bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8">
          <div class="mb-8 text-center">
            <h2 class="text-2xl font-bold text-white mb-2">Apply for Partnership</h2>
            <p class="text-gray-400">Please provide information about your organization and training programs</p>
          </div>

          <!-- Submission Status -->
          <div v-if="submissionStatus === 'error'" class="mb-6">
            <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 class="text-red-300 font-medium text-sm">Submission Error</h3>
                  <p class="text-red-400 text-xs mt-1">{{ errorMessage || 'Please check your information and try again.' }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Organization Details -->
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Organization Name *
                </label>
                <input
                  v-model="form.organizationName"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your company or institution name"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Organization Type *
                </label>
                <select
                  v-model="form.organizationType"
                  required
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select organization type</option>
                  <option value="training-provider">Training Provider</option>
                  <option value="bootcamp">Coding Bootcamp</option>
                  <option value="university">University/College</option>
                  <option value="corporate">Corporate Training</option>
                  <option value="consultancy">IT Consultancy</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  v-model="form.contactName"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Job Title *
                </label>
                <input
                  v-model="form.jobTitle"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your role/position"
                />
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Business Email *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@company.com"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <!-- Business Details -->
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Company Website
                </label>
                <input
                  v-model="form.website"
                  type="url"
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://yourcompany.com"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Country/Region *
                </label>
                <input
                  v-model="form.country"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="United States"
                />
              </div>
            </div>

            <!-- Training Details -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Expected Monthly Volume *
              </label>
              <select
                v-model="form.expectedVolume"
                required
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select expected monthly volume</option>
                <option value="10-50">10-50 certificates</option>
                <option value="51-100">51-100 certificates</option>
                <option value="101-500">101-500 certificates</option>
                <option value="501-1000">501-1,000 certificates</option>
                <option value="1000+">1,000+ certificates</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Certifications of Interest
              </label>
              <div class="grid md:grid-cols-2 gap-3">
                <label v-for="cert in certificationOptions" :key="cert" class="flex items-center">
                  <input
                    v-model="form.certifications"
                    :value="cert"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span class="ml-3 text-sm text-gray-300">{{ cert }}</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Tell us about your training programs
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your training programs, target audience, and how you plan to use certificates.dev certifications..."
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="submissionStatus === 'loading' || !isFormValid"
              class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span v-if="submissionStatus === 'loading'" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Application...
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Application
              </span>
            </button>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-20 text-center">
        <div class="border-t border-gray-700/50 pt-12">
          <p class="text-gray-400 mb-8 text-lg">
            Questions about our partner program? Contact our partnerships team.
          </p>
          
          <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a 
              href="mailto:partnerships@certificates.dev" 
              class="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-lg transition-all duration-200 backdrop-blur-sm min-w-[160px]"
            >
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.93a1.78 1.78 0 001.76 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Partnerships
            </a>
            
            <a 
              href="https://certificates.dev" 
              target="_blank"
              class="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-300 bg-blue-900/30 hover:bg-blue-800/50 border border-blue-500/30 rounded-lg transition-all duration-200 backdrop-blur-sm min-w-[160px]"
            >
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit Main Site
            </a>
          </div>
          
          <div class="mt-8 pt-8 border-t border-gray-800/50">
            <p class="text-gray-500 text-sm">
              © 2025 Certificates.dev - Professional Developer Certifications
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Set page metadata
useHead({
  title: 'Apply for Bulk Access - Certificates.dev',
  meta: [
    { name: 'description', content: 'Apply for bulk access to order developer certifications at volume discounts for your training organization.' }
  ]
})

// Form data
const form = ref({
  organizationName: '',
  organizationType: '',
  contactName: '',
  jobTitle: '',
  email: '',
  phone: '',
  website: '',
  country: '',
  expectedVolume: '',
  certifications: [],
  description: ''
})

// Submission state
const submissionStatus = ref('idle')
const errorMessage = ref('')
const submitted = ref(false)

// Certification options
const certificationOptions = [
  'Vue.js Developer',
  'Vue.js Senior',
  'JavaScript Developer', 
  'JavaScript Senior',
  'Angular Developer',
  'Angular Senior',
  'Nuxt Developer',
  'Nuxt Senior',
  'React (Coming Soon)',
  'TypeScript (Coming Soon)'
]

// Form validation
const isFormValid = computed(() => {
  return form.value.organizationName && 
         form.value.organizationType && 
         form.value.contactName && 
         form.value.jobTitle && 
         form.value.email && 
         form.value.country && 
         form.value.expectedVolume &&
         isValidEmail(form.value.email)
})

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Form submission
const handleSubmit = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill in all required fields correctly'
    submissionStatus.value = 'error'
    return
  }

  submissionStatus.value = 'loading'
  errorMessage.value = ''

  try {
    const response = await $fetch('/api/signup', {
      method: 'POST',
      body: form.value
    })

    if (response.success) {
      console.log('Signup successful:', response.data)
      submitted.value = true
      submissionStatus.value = 'success'
    } else {
      throw new Error(response.message || 'Submission failed')
    }

  } catch (error) {
    console.error('Signup error:', error)
    
    // Handle different error types
    if (error.statusCode === 400) {
      errorMessage.value = error.data?.message || 'Please check your information and try again.'
    } else if (error.statusCode === 500) {
      errorMessage.value = 'Server error. Please try again later.'
    } else {
      errorMessage.value = 'Failed to submit application. Please try again.'
    }
    
    submissionStatus.value = 'error'
  }
}
</script> 