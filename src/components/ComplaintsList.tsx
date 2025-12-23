import { useEffect, useState } from 'react';
import { supabase, Complaint } from '../lib/supabase';
import { AlertCircle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComplaints(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();

    const channel = supabase
      .channel('complaints-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, () => {
        fetchComplaints();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technical':
        return '⚙️';
      case 'billing':
        return '💳';
      case 'service':
        return '🛎️';
      case 'product':
        return '📦';
      case 'shipping':
        return '🚚';
      case 'account':
        return '👤';
      default:
        return '📋';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Clock className="w-4 h-4" />;
      case 'in progress':
        return <TrendingUp className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No complaints yet. Submit one above to see AI analysis in action!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Complaints</h2>
      {complaints.map((complaint) => (
        <div
          key={complaint.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getCategoryIcon(complaint.category)}</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{complaint.category}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(complaint.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(complaint.urgency)}`}>
                {complaint.urgency}
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-4 leading-relaxed">{complaint.complaint_text}</p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Priority:</span>
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-6 rounded ${
                          i < complaint.priority_score
                            ? complaint.priority_score >= 8
                              ? 'bg-red-500'
                              : complaint.priority_score >= 5
                              ? 'bg-orange-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-bold text-gray-800">
                    {complaint.priority_score}/10
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              {getStatusIcon(complaint.status)}
              <span className="font-medium">{complaint.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
