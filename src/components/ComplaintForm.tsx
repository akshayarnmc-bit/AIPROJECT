import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ComplaintFormProps {
  onSubmitSuccess: () => void;
}

export default function ComplaintForm({ onSubmitSuccess }: ComplaintFormProps) {
  const [complaintText, setComplaintText] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-complaint`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            complaint_text: complaintText,
            user_email: userEmail || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit complaint');
      }

      setComplaintText('');
      setUserEmail('');
      onSubmitSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div>
        <label htmlFor="complaint" className="block text-sm font-medium text-gray-700 mb-2">
          Describe Your Complaint
        </label>
        <textarea
          id="complaint"
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          required
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Please describe your issue in detail..."
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email (Optional)
        </label>
        <input
          type="email"
          id="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="your.email@example.com"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !complaintText.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing Complaint...
          </>
        ) : (
          'Submit Complaint'
        )}
      </button>
    </form>
  );
}
