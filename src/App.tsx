import { useState } from 'react';
import { Brain } from 'lucide-react';
import ComplaintForm from './components/ComplaintForm';
import ComplaintsList from './components/ComplaintsList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmitSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              AI Smart Complaint Analyzer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Submit your complaints and let AI automatically categorize them and assess their urgency and priority level
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Submit Complaint</h2>
            <ComplaintForm onSubmitSuccess={handleSubmitSuccess} />
          </div>

          <div>
            <ComplaintsList key={refreshKey} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">1. Submit</h4>
              <p className="text-sm text-gray-600">Describe your issue in detail</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🤖</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">2. AI Analysis</h4>
              <p className="text-sm text-gray-600">AI detects category and urgency</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">3. Priority Set</h4>
              <p className="text-sm text-gray-600">Get instant priority assessment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
