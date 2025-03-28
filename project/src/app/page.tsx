import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-red-500">
      {/* Header */}
      <header className="bg-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 50 L40 70 L80 30" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="30" r="8" fill="white" />
                <circle cx="80" cy="70" r="8" fill="white" />
              </svg>
            </div>
            <span className="ml-2 text-xl font-bold text-white">AgTrial</span>
          </div>
          <div>
            <Link
              href="/auth/signin"
              className="inline-block px-4 py-2 border border-white text-white hover:bg-white hover:text-primary rounded-md transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="bg-gradient-to-b from-primary-light to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-8">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Agricultural Trial Plot Planning & Data Collection
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Streamline your field trials with our comprehensive platform for planning, 
                navigating, and collecting data from experimental agricultural plots.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/auth/signin"
                  className="btn-primary text-center"
                >
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="btn-outline text-center"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-96 bg-primary-light rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center p-8">
                <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
                  <path d="M20 50 L40 70 L80 30" stroke="#2a9d8f" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="30" r="8" fill="#2a9d8f" />
                  <circle cx="80" cy="70" r="8" fill="#2a9d8f" />
                </svg>
                <h3 className="text-xl font-bold text-primary">Optimize Your Field Trials</h3>
                <p className="text-gray-700 mt-2">Plan, navigate, and collect data efficiently</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trial Design & Management</h3>
              <p className="text-gray-600">
                Create and manage complex field trials with multiple treatments, replications, and plot layouts.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Field Navigation</h3>
              <p className="text-gray-600">
                Optimize routes between plots for efficient field work with GPS guidance and mapping.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Data Collection</h3>
              <p className="text-gray-600">
                Capture observations with custom forms, photos, and automated measurements with offline capabilities.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-secondary-light rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analysis & Reporting</h3>
              <p className="text-gray-600">
                Visualize data with charts, heatmaps, and statistical analysis to gain insights from your trials.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-secondary-light rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Weather Integration</h3>
              <p className="text-gray-600">
                Track and correlate weather data with trial performance for comprehensive analysis.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-12 w-12 bg-secondary-light rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Equipment Integration</h3>
              <p className="text-gray-600">
                Connect with field equipment for automated data collection and measurements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your agricultural research?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Join researchers worldwide who are using our platform to improve efficiency 
            and accuracy in their field trials.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-white text-primary font-bold rounded-md hover:bg-gray-100 transition"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 50 L40 70 L80 30" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="20" cy="30" r="8" fill="white" />
                    <circle cx="80" cy="70" r="8" fill="white" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold">AgTrial</span>
              </div>
              <p className="text-gray-400">
                Empowering agricultural research with innovative technology solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Trial Design</a></li>
                <li><a href="#" className="hover:text-white">Field Navigation</a></li>
                <li><a href="#" className="hover:text-white">Data Collection</a></li>
                <li><a href="#" className="hover:text-white">Analysis & Reporting</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AgTrial. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}