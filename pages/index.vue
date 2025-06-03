<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation -->
    <nav class="border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <div class="w-8 h-8 bg-blue-500 rounded-lg mr-3 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xl font-bold text-white">certificates.dev</span>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a href="#features" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</a>
              <a href="#pricing" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</a>
              <a href="#contact" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</a>
              <NuxtLink to="/order" class="text-blue-300 hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-blue-500/30 bg-blue-900/20">
                Partner Login
              </NuxtLink>
              <NuxtLink to="/admin/login" class="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-red-500 shadow-lg">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Admin
              </NuxtLink>
              <button @click="openDemo" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Request Demo</button>
            </div>
          </div>
          <!-- Mobile menu button and admin link -->
          <div class="md:hidden flex items-center space-x-2">
            <NuxtLink to="/order" class="text-blue-300 hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-blue-500/30 bg-blue-900/20">
              Partner
            </NuxtLink>
            <NuxtLink to="/admin/login" class="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-red-500 shadow-lg">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-20 sm:py-32">
      <div class="absolute inset-0 bg-blue-500/5 backdrop-blur-3xl"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div class="text-center lg:text-left">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Join the certificates.dev
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 block">
                Partner Program
              </span>
            </h1>
            <p class="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Partner with certificates.dev to offer industry-trusted developer certifications through your training programs. Enjoy exclusive volume pricing and premium support for your students.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NuxtLink to="/signup" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg">
                Apply for Partnership
              </NuxtLink>
              <a href="#features" class="border border-gray-600 text-white hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 text-center">
                Learn More
              </a>
            </div>
            <div class="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-400">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Up to 40% partner discounts
              </div>
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Same trusted certificates
              </div>
            </div>
          </div>
          <div class="mt-16 lg:mt-0">
            <div class="relative">
              <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
                <div class="bg-gray-900 rounded-xl p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-white font-semibold">Partner Order Summary</h3>
                    <div class="flex space-x-2">
                      <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span class="text-white text-xs font-bold">JS</span>
                      </div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-400">Vue.js Developer (x50)</span>
                      <span class="text-white">$2,500</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-400">React Developer (x30)</span>
                      <span class="text-white">$1,500</span>
                    </div>
                    <div class="border-t border-gray-700 pt-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-400">Volume Discount (25%)</span>
                        <span class="text-green-400">-$1,000</span>
                      </div>
                      <div class="flex justify-between font-bold text-white">
                        <span>Total</span>
                        <span>$3,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Training Providers Choose 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Our Partner Program
            </span>
          </h2>
          <p class="text-xl text-gray-400 max-w-3xl mx-auto">
            Get the same industry-trusted certificates.dev certifications your students want, with partner pricing and dedicated support.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Partner Discounts</h3>
            <p class="text-gray-400">Save up to 40% with our partner program. The more certificates you offer, the better your margins become while providing value to your students.</p>
          </div>

          <div class="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Trusted Partner Brand</h3>
            <p class="text-gray-400">Leverage the established reputation of certificates.dev. Your students get the exact same certifications recognized by top employers.</p>
          </div>

          <div class="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Partner Support</h3>
            <p class="text-gray-400">Digital certificates delivered instantly with dedicated partner support. Start offering certifications to your students immediately.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Available Certifications -->
    <section class="py-20 bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            Available Developer Certifications
          </h2>
          <p class="text-xl text-gray-400 max-w-3xl mx-auto">
            Official certifications developed in partnership with framework creators and industry experts. Available exclusively through our partner program.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Vue.js -->
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-white">Vue.js</h3>
                <p class="text-green-400 text-sm">In partnership with Evan You</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm mb-4">
              Official certification developed with the Creator of Vue.js and Core Team members. Senior level available.
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Developer Level</span>
              <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Senior Level</span>
            </div>
          </div>

          <!-- JavaScript -->
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                <span class="text-black font-bold text-lg">JS</span>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-white">JavaScript</h3>
                <p class="text-yellow-400 text-sm">Modern JS Development</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm mb-4">
              Validate expertise in modern JavaScript through rigorous assessments designed by top industry experts.
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Developer Level</span>
              <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Senior Level</span>
            </div>
          </div>

          <!-- Angular -->
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-colors">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-white">Angular</h3>
                <p class="text-red-400 text-sm">Google Developer Experts</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm mb-4">
              Developed and reviewed by Google Developer Experts. Three certification levels available.
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Junior Level</span>
              <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Mid Level</span>
              <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Senior Level</span>
            </div>
          </div>

          <!-- Nuxt -->
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-400 transition-colors">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center mr-4">
                <span class="text-black font-bold text-lg">N</span>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-white">Nuxt</h3>
                <p class="text-green-400 text-sm">In partnership with Sébastien Chopin</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm mb-4">
              Official certification developed with Nuxt creator. Covers routing, SSR, and code splitting.
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Developer Level</span>
              <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Senior Level</span>
            </div>
          </div>

          <!-- React -->
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-400 transition-colors">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-white">React</h3>
                <p class="text-blue-400 text-sm">Coming Soon</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm mb-4">
              Comprehensive React exams curated by industry professionals. Developer and Senior levels planned.
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Early Access</span>
            </div>
          </div>

          <!-- TypeScript -->
          <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <span class="text-white font-bold text-lg">TS</span>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-white">TypeScript</h3>
                <p class="text-blue-400 text-sm">Coming Soon</p>
              </div>
            </div>
            <p class="text-gray-400 text-sm mb-4">
              Professional TypeScript assessments from top experts. Developer and Senior certification paths.
            </p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Early Access</span>
            </div>
          </div>
        </div>

        <div class="mt-12 text-center">
          <p class="text-gray-400 mb-6">
            All certifications include rigorous examinations with real-world coding challenges, preparation materials, and expert validation.
          </p>
          <NuxtLink to="/signup" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg">
            Join Partner Program
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Credibility & Partnerships -->
    <section class="py-20 bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Developers Worldwide
          </h2>
          <p class="text-xl text-gray-400 max-w-3xl mx-auto">
            Built in collaboration with framework creators and backed by research showing clear demand for developer certification.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          <div class="text-center">
            <div class="text-4xl font-bold text-blue-400 mb-2">2,500+</div>
            <div class="text-gray-300">Survey Responses</div>
            <div class="text-gray-500 text-sm">Pre-launch developer interest</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-green-400 mb-2">82%</div>
            <div class="text-gray-300">Validate Skills</div>
            <div class="text-gray-500 text-sm">Look to certification for validation</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-purple-400 mb-2">96%</div>
            <div class="text-gray-300">Enhanced Credibility</div>
            <div class="text-gray-500 text-sm">Believe certification enhances credibility</div>
          </div>
        </div>

        <div class="bg-gray-900 rounded-2xl p-8 border border-gray-700">
          <h3 class="text-2xl font-bold text-white text-center mb-8">Official Partnerships</h3>
          <div class="grid md:grid-cols-2 gap-8">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-2xl">V</span>
              </div>
              <div>
                <h4 class="text-white font-semibold">Vue.js Partnership</h4>
                <p class="text-gray-400 text-sm">Developed with Evan You, Creator of Vue.js</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-green-400 rounded-xl flex items-center justify-center">
                <span class="text-black font-bold text-2xl">N</span>
              </div>
              <div>
                <h4 class="text-white font-semibold">Nuxt Partnership</h4>
                <p class="text-gray-400 text-sm">Created with Sébastien Chopin, Creator of Nuxt</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-2xl">A</span>
              </div>
              <div>
                <h4 class="text-white font-semibold">Angular Experts</h4>
                <p class="text-gray-400 text-sm">Reviewed by Google Developer Experts</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-2xl">★</span>
              </div>
              <div>
                <h4 class="text-white font-semibold">Industry Experts</h4>
                <p class="text-gray-400 text-sm">Curated by top professionals in each field</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof -->
    <section class="py-16 bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl font-bold text-white mb-4">Trusted by Leading Training Providers</h2>
          <p class="text-gray-400">Join hundreds of organizations offering certificates.dev certifications through our partner program</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
          <div class="text-center">
            <div class="h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <span class="text-gray-400 font-semibold">TechBootcamp</span>
            </div>
          </div>
          <div class="text-center">
            <div class="h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <span class="text-gray-400 font-semibold">CodeAcademy Plus</span>
            </div>
          </div>
          <div class="text-center">
            <div class="h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <span class="text-gray-400 font-semibold">DevInstitute</span>
            </div>
          </div>
          <div class="text-center">
            <div class="h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <span class="text-gray-400 font-semibold">SkillForge</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-20 bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p class="text-xl text-gray-400 max-w-3xl mx-auto">
            Apply for partnership and start offering industry-trusted credentials to your students today.
          </p>
        </div>

        <div class="max-w-2xl mx-auto text-center">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
            <div class="bg-gray-900 rounded-xl p-8">
              <h3 class="text-2xl font-bold text-white mb-4">Apply for Partnership</h3>
              <p class="text-gray-300 mb-6">
                Join our partner program to access exclusive pricing and offer certificates.dev credentials to your students.
              </p>
              <NuxtLink to="/signup" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg">
                Apply Now
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          Start Offering Industry-Trusted Certifications Today
        </h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join the certificates.dev partner program for exclusive pricing and dedicated support. Get the credentials your students want at prices that work for your business.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/signup" class="bg-white hover:bg-gray-100 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg">
            Apply for Partnership
          </NuxtLink>
          <NuxtLink to="/order" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg border-2 border-blue-400">
            Partner Login & Orders
          </NuxtLink>
        </div>
        <p class="text-blue-200 text-sm mt-4">
          Already a partner? <NuxtLink to="/order" class="underline hover:text-white">Access your order system here</NuxtLink>
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-blue-500 rounded-lg mr-3 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xl font-bold text-white">certificates.dev</span>
            </div>
            <p class="text-gray-400">Professional developer certifications for the modern world.</p>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Product</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#features" class="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" class="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Company</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">About</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Support</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#contact" class="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-12 pt-8 text-center">
          <p class="text-gray-400">© 2025 certificates.dev. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- Demo Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" @click="closeModal">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" aria-hidden="true"></div>
        <div class="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-2xl" @click.stop>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-white">Schedule a Demo</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="submitDemo" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input v-model="demoForm.name" type="text" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input v-model="demoForm.email" type="email" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Company</label>
              <input v-model="demoForm.company" type="text" required class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Message (Optional)</label>
              <textarea v-model="demoForm.message" rows="3" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors">
              Schedule Demo
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Set page metadata
useHead({
  title: 'certificates.dev - Industry-Leading Developer Certifications for Training Programs',
  meta: [
    { name: 'description', content: 'Offer industry-leading developer certifications with your training programs. Validate skills, boost engagement, and deliver measurable career outcomes.' }
  ]
})

// Modal state
const showModal = ref(false)

// Demo form data
const demoForm = reactive({
  name: '',
  email: '',
  company: '',
  message: ''
})

// Modal functions
const openDemo = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitDemo = () => {
  // Here you would typically send the form data to your backend
  console.log('Demo request submitted:', demoForm)
  alert('Thank you! We\'ll be in touch within 24 hours to schedule your demo.')
  closeModal()
  
  // Reset form
  Object.keys(demoForm).forEach(key => {
    demoForm[key] = ''
  })
}

const startTrial = () => {
  // Redirect to trial signup or open trial modal
  alert('Free trial signup coming soon!')
}
</script> 