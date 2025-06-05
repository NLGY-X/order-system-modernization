<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <!-- Navigation -->
    <div class="max-w-2xl mx-auto mb-8">
      <div class="flex justify-between items-center">
        <NuxtLink 
          to="/"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/70 rounded-lg shadow-sm transition-all duration-200 backdrop-blur-sm border border-gray-700"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </NuxtLink>
        
        <NuxtLink 
          to="/order"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-300 bg-blue-900/30 hover:bg-blue-800/50 rounded-lg transition-all duration-200 backdrop-blur-sm border border-blue-500/30"
        >
          Partner Login
        </NuxtLink>
      </div>
    </div>

    <div class="max-w-2xl mx-auto">
      <div class="bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 py-8 px-4 sm:px-10">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-white mb-2">
            Apply for Partnership
          </h2>
          <p class="text-gray-300">
            Join the certificates.dev Partner Program for bulk pricing and exclusive benefits
          </p>
        </div>

        <!-- Success Message -->
        <div v-if="submitted" class="mb-6 bg-green-900/20 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-300">Application Submitted Successfully!</h3>
              <p class="mt-1 text-sm text-green-400">
                Thank you for your interest in becoming a partner. Our team will review your application and contact you within 2-3 business days.
              </p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form v-if="!submitted" @submit.prevent="submitApplication" class="space-y-6">
          <!-- Organization Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-white">Organization Information</h3>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="organization_name" class="block text-sm font-medium text-gray-300 mb-2">Organization Name *</label>
                <input
                  id="organization_name"
                  v-model="form.organization_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your company or institution name"
                />
              </div>

              <div>
                <label for="organization_type" class="block text-sm font-medium text-gray-300 mb-2">Organization Type *</label>
                <select
                  id="organization_type"
                  v-model="form.organization_type"
                  required
                  class="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="" class="bg-gray-800">Select type</option>
                  <option value="Training Provider" class="bg-gray-800">Training Provider</option>
                  <option value="Bootcamp" class="bg-gray-800">Bootcamp</option>
                  <option value="University" class="bg-gray-800">University</option>
                  <option value="Corporate Training" class="bg-gray-800">Corporate Training</option>
                  <option value="Online Platform" class="bg-gray-800">Online Platform</option>
                  <option value="Consultant" class="bg-gray-800">Consultant</option>
                  <option value="Other" class="bg-gray-800">Other</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="website" class="block text-sm font-medium text-gray-300 mb-2">Website</label>
                <input
                  id="website"
                  v-model="form.website"
                  type="url"
                  class="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div>
                <label for="country" class="block text-sm font-medium text-gray-300 mb-2">Country *</label>
                <select
                  id="country"
                  v-model="form.country"
                  required
                  class="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="" class="bg-gray-800">Select country</option>
                  <option value="United States" class="bg-gray-800">United States</option>
                  <option value="United Kingdom" class="bg-gray-800">United Kingdom</option>
                  <option value="Canada" class="bg-gray-800">Canada</option>
                  <option value="Germany" class="bg-gray-800">Germany</option>
                  <option value="France" class="bg-gray-800">France</option>
                  <option value="India" class="bg-gray-800">India</option>
                  <option value="Brazil" class="bg-gray-800">Brazil</option>
                  <option value="Australia" class="bg-gray-800">Australia</option>
                  <option value="Other" class="bg-gray-800">Other</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-white">Contact Information</h3>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="contact_name" class="block text-sm font-medium text-gray-300 mb-2">Contact Name *</label>
                <input
                  id="contact_name"
                  v-model="form.contact_name"
                  type="text"
                  required
                  class="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label for="job_title" class="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
                <input
                  id="job_title"
                  v-model="form.job_title"
                  type="text"
                  required
                  class="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your role/position"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          <!-- Partnership Details -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-white">Partnership Details</h3>
            
            <div>
              <label for="expected_volume" class="block text-sm font-medium text-gray-300 mb-2">Expected Monthly Volume *</label>
              <select
                id="expected_volume"
                v-model="form.expected_volume"
                required
                class="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" class="bg-gray-800">Select expected volume</option>
                <option value="1-50" class="bg-gray-800">1-50 certificates/month</option>
                <option value="51-100" class="bg-gray-800">51-100 certificates/month</option>
                <option value="101-250" class="bg-gray-800">101-250 certificates/month</option>
                <option value="251-500" class="bg-gray-800">251-500 certificates/month</option>
                <option value="500+" class="bg-gray-800">500+ certificates/month</option>
              </select>
              <p class="mt-1 text-xs text-gray-400">Higher volumes qualify for better pricing tiers</p>
            </div>

            <div>
              <label for="certifications_interest" class="block text-sm font-medium text-gray-300 mb-3">Certification Interests</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <label v-for="cert in certificationOptions" :key="cert" class="flex items-center p-3 bg-gray-800/30 hover:bg-gray-700/40 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 cursor-pointer group">
                  <input
                    type="checkbox"
                    :value="cert"
                    v-model="form.certifications_interest"
                    class="rounded border-gray-600 bg-gray-900/50 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
                  />
                  <span class="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors duration-200">{{ cert }}</span>
                </label>
              </div>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-300 mb-2">Tell us about your training programs</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                class="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Describe your training programs, target audience, and how you plan to use certificates.dev certifications..."
              ></textarea>
            </div>
          </div>

          <!-- Submit -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Application...
              </span>
              <span v-else>Submit Partner Application</span>
            </button>
          </div>
        </form>

        <!-- Help Section -->
        <div class="mt-8 pt-6 border-t border-gray-700/50">
          <div class="text-center space-y-4">
            <p class="text-gray-400 text-sm">
              Questions about our Partner Program?
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="mailto:partnerships@certificates.dev"
                class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-lg transition-all duration-200"
              >
                Contact Partnership Team
              </a>
              <NuxtLink 
                to="/order"
                class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-300 bg-blue-900/30 hover:bg-blue-800/50 border border-blue-500/30 rounded-lg transition-all duration-200"
              >
                Existing Partner Login
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Set page metadata
useHead({
  title: 'Partner Program Application - certificates.dev',
  meta: [
    { name: 'description', content: 'Apply to become a certificates.dev partner and get access to bulk pricing for developer certifications.' }
  ]
})

// Data
const submitted = ref(false)
const submitting = ref(false)

const certificationOptions = [
  'Vue.js Certifications',
  'JavaScript Certifications', 
  'Angular Certifications',
  'Nuxt.js Certifications',
  'React Certifications (Future)',
  'Node.js Certifications (Future)'
]

const form = ref({
  organization_name: '',
  organization_type: '',
  contact_name: '',
  job_title: '',
  email: '',
  phone: '',
  website: '',
  country: '',
  expected_volume: '',
  certifications_interest: [],
  description: ''
})

// Submit application
const submitApplication = async () => {
  try {
    submitting.value = true
    
    const response = await fetch('/api/submit-partner-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to submit application')
    }

    submitted.value = true
    
    // Reset form
    form.value = {
      organization_name: '',
      organization_type: '',
      contact_name: '',
      job_title: '',
      email: '',
      phone: '',
      website: '',
      country: '',
      expected_volume: '',
      certifications_interest: [],
      description: ''
    }
    
  } catch (error) {
    console.error('Error submitting application:', error)
    alert(error.message || 'Failed to submit application. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script> 