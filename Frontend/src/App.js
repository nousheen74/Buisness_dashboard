import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        businessName: '',
        location: ''
      },
      businessData: null,
      loading: false,
      errors: {},
      currentPage: 'form' // 'form' or 'results'
    };

    this.API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003';

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRegenerateHeadline = this.handleRegenerateHeadline.bind(this);
    this.goBackToForm = this.goBackToForm.bind(this);
  }

  validateForm() {
    const { formData } = this.state;
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    this.setState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  }

  handleInputChange(e) {
    const { name, value } = e.target;

    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      },
      errors: {
        ...prevState.errors,
        [name]: ''
      }
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (!this.validateForm()) return;

    this.setState({ loading: true });

    try {
      console.log('Sending request to:', `${this.API_BASE_URL}/business-data`);
      console.log('Request data:', this.state.formData);

      const response = await fetch(`${this.API_BASE_URL}/business-data`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: this.state.formData.businessName,
          location: this.state.formData.location
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      this.setState({ 
        businessData: data,
        currentPage: 'results' // Navigate to results page
      });
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Failed to fetch business data: ${error.message}`);
    } finally {
      this.setState({ loading: false });
    }
  }

  async handleRegenerateHeadline() {
    this.setState({ loading: true });

    try {
      const { formData } = this.state;
      const url = `${this.API_BASE_URL}/regenerate-headline?name=${encodeURIComponent(formData.businessName)}&location=${encodeURIComponent(formData.location)}`;
      
      console.log('Regenerating headline from:', url);
      
      const response = await fetch(url, {
        headers: { 
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Regenerate response:', data);

      this.setState(prevState => ({
        businessData: {
          ...prevState.businessData,
          headline: data.headline
        }
      }));
    } catch (error) {
      console.error('Regenerate error:', error);
      alert(`Failed to regenerate headline: ${error.message}`);
    } finally {
      this.setState({ loading: false });
    }
  }

  goBackToForm() {
    this.setState({ currentPage: 'form' });
  }

  render() {
    const { formData, businessData, loading, errors, currentPage } = this.state;

    if (currentPage === 'results' && businessData) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-['Inter']">
          <div className="max-w-5xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text mb-4">
                Business Insights
              </h1>
              <p className="text-xl text-gray-300">
                Your business analysis results
              </p>
            </div>

            {/* Back Button */}
            <div className="mb-8">
              <button
                onClick={this.goBackToForm}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg"
              >
                ← Back to Dashboard
              </button>
            </div>

            {/* Business Data Display */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-8 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {formData.businessName}
                </h2>
                <p className="text-lg text-gray-300">📍 {formData.location}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Rating Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">⭐ Google Rating</h3>
                  <div className="text-4xl font-bold mb-3">{businessData.rating}★</div>
                  <p className="text-lg text-blue-100 mb-4">{businessData.reviews.toLocaleString()} reviews</p>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-1000"
                      style={{width: `${(businessData.rating / 5) * 100}%`}}
                    ></div>
                  </div>
                </div>

                {/* SEO Headline Card */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">🚀 SEO Headline</h3>
                  <p className="text-base leading-relaxed mb-4">{businessData.headline}</p>
                  <button
                    onClick={this.handleRegenerateHeadline}
                    disabled={loading}
                    className="w-full bg-white/20 text-white font-medium py-3 px-4 rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Regenerating...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        <span className="mr-2">🔄</span>
                        Regenerate Headline
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Business Summary */}
              <div className="mt-8 p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-white/10 rounded-xl">
                <h3 className="text-xl font-bold mb-3 text-white">
                  📊 Business Summary
                </h3>
                <p className="text-gray-200 leading-relaxed">
                  <span className="font-semibold text-blue-300">{formData.businessName}</span> in{' '}
                  <span className="font-semibold text-emerald-300">{formData.location}</span> shows strong 
                  market potential with excellent customer engagement and optimized content for search visibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Form Page
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-['Inter']">
        <div className="max-w-3xl mx-auto py-16 px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text mb-4">
              Business SEO Dashboard
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Transform your business with AI-powered insights
            </p>
            <p className="text-lg text-gray-400">
              Get instant SEO analysis and Google Business data
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text mb-2">
                Enter Business Details
              </h2>
              <p className="text-gray-300">Let's discover your business potential</p>
            </div>

            <form onSubmit={this.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="businessName" className="block text-lg font-semibold text-gray-200 mb-3">
                  🏢 Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={this.handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 ${
                    errors.businessName ? 'border-red-400' : 'border-white/30 focus:border-blue-400/50'
                  }`}
                  placeholder="e.g., Pixel Bakery"
                />
                {errors.businessName && (
                  <p className="text-red-400 text-sm mt-2">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-lg font-semibold text-gray-200 mb-3">
                  📍 Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={this.handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 ${
                    errors.location ? 'border-red-400' : 'border-white/30 focus:border-blue-400/50'
                  }`}
                  placeholder="e.g., Bangalore"
                />
                {errors.location && (
                  <p className="text-red-400 text-sm mt-2">{errors.location}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-lg text-white font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>Analyzing your business...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🔍</span>
                    Get Business Insights
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
