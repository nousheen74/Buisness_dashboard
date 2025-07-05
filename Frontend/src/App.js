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
      errors: {}
    };

    this.API_BASE_URL = 'http://localhost:5001';

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRegenerateHeadline = this.handleRegenerateHeadline.bind(this);
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
    if (!this.validateForm()) {
      return;
    }
    this.setState({ loading: true });
    try {
      const response = await fetch(`${this.API_BASE_URL}/business-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.formData),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch business data');
      }
      const data = await response.json();
      this.setState({ businessData: data });
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch business data. Please try again.');
    } finally {
      this.setState({ loading: false });
    }
  }

  // Regenerate SEO headline
  async handleRegenerateHeadline() {
    this.setState({ loading: true });
    
    try {
      const { formData } = this.state;
      const response = await fetch(
        `${this.API_BASE_URL}/regenerate-headline?name=${encodeURIComponent(formData.businessName)}&location=${encodeURIComponent(formData.location)}`
      );

      if (!response.ok) {
        throw new Error('Failed to regenerate headline');
      }

      const data = await response.json();
      this.setState(prevState => ({
        businessData: {
          ...prevState.businessData,
          headline: data.headline
        }
      }));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to regenerate headline. Please try again.');
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { formData, businessData, loading, errors } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Business Dashboard
            </h1>
            <p className="text-gray-600">
              View your business SEO data and Google Business insights
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Enter Business Details
            </h2>
            
            <form onSubmit={this.handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={this.handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.businessName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Cake & Co"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                )}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={this.handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mumbai"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  'Get Business Data'
                )}
              </button>
            </form>
          </div>

          {/* Business Data Display */}
          {businessData && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Business Insights
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Google Rating Card */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Google Rating</h3>
                    <div className="text-2xl font-bold">{businessData.rating}★</div>
                  </div>
                  <p className="text-yellow-100">{businessData.reviews} reviews</p>
                </div>

                {/* SEO Headline Card */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">AI-Generated SEO Headline</h3>
                  <p className="text-sm mb-4 leading-relaxed">{businessData.headline}</p>
                  <button
                    onClick={this.handleRegenerateHeadline}
                    disabled={loading}
                    className="bg-white text-purple-600 py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600 mr-2"></div>
                        Regenerating...
                      </div>
                    ) : (
                      'Regenerate SEO Headline'
                    )}
                  </button>
                </div>
              </div>

              {/* Business Info Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Business Summary
                </h3>
                <p className="text-gray-600">
                  <span className="font-medium">{formData.businessName}</span> in{' '}
                  <span className="font-medium">{formData.location}</span> has a strong online presence 
                  with excellent customer ratings and AI-optimized content for better search visibility.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App; 