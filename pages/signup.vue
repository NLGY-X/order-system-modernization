<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-2xl">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Header -->
        <div class="sm:mx-auto sm:w-full sm:max-w-md mb-8">
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Apply for Partnership
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Join the certificates.dev Partner Program for bulk pricing and exclusive benefits
          </p>
        </div>

        <!-- Success Message -->
        <div v-if="submitted" class="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Application Submitted Successfully!</h3>
              <p class="mt-1 text-sm text-green-700">
                Thank you for your interest in becoming a partner. Our team will review your application and contact you within 2-3 business days.
              </p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form v-if="!submitted" @submit.prevent="submitApplication" class="space-y-6">
          <!-- Organization Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Organization Information</h3>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="organization_name" class="block text-sm font-medium text-gray-700">Organization Name *</label>
                <input
                  id="organization_name"
                  v-model="form.organization_name"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your company or institution name"
                />
              </div>

              <div>
                <label for="organization_type" class="block text-sm font-medium text-gray-700">Organization Type *</label>
                <select
                  id="organization_type"
                  v-model="form.organization_type"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="Training Provider">Training Provider</option>
                  <option value="Bootcamp">Bootcamp</option>
                  <option value="University">University</option>
                  <option value="Corporate Training">Corporate Training</option>
                  <option value="Online Platform">Online Platform</option>
                  <option value="Consultant">Consultant</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
                <input
                  id="website"
                  v-model="form.website"
                  type="url"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div>
                <label for="country" class="block text-sm font-medium text-gray-700">Country *</label>
                <select
                  id="country"
                  v-model="form.country"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="India">India</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Contact Information</h3>
            
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="contact_name" class="block text-sm font-medium text-gray-700">Contact Name *</label>
                <input
                  id="contact_name"
                  v-model="form.contact_name"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label for="job_title" class="block text-sm font-medium text-gray-700">Job Title *</label>
                <input
                  id="job_title"
                  v-model="form.job_title"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your role/position"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email Address *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          <!-- Partnership Details -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Partnership Details</h3>
            
            <div>
              <label for="expected_volume" class="block text-sm font-medium text-gray-700">Expected Monthly Volume *</label>
              <select
                id="expected_volume"
                v-model="form.expected_volume"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select expected volume</option>
                <option value="1-50">1-50 certificates/month</option>
                <option value="51-100">51-100 certificates/month</option>
                <option value="101-250">101-250 certificates/month</option>
                <option value="251-500">251-500 certificates/month</option>
                <option value="500+">500+ certificates/month</option>
              </select>
              <p class="mt-1 text-xs text-gray-500">Higher volumes qualify for better pricing tiers</p>
            </div>

            <div>
              <label for="certifications_interest" class="block text-sm font-medium text-gray-700">Certification Interests</label>
              <div class="mt-2 space-y-2">
                <label v-for="cert in certificationOptions" :key="cert" class="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    :value="cert"
                    v-model="form.certifications_interest"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ cert }}</span>
                </label>
              </div>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Tell us about your training programs</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your training programs, target audience, and how you plan to use certificates.dev certifications..."
              ></textarea>
            </div>
          </div>

          <!-- Submit -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="submitting"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ submitting ? 'Submitting Application...' : 'Submit Partner Application' }}
            </button>
          </div>
        </form>

        <!-- Back to Homepage -->
        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-blue-600 hover:text-blue-500">
            ← Back to Homepage
          </NuxtLink>
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