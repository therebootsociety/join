import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, Loader2, User, Mail, Instagram, Globe } from 'lucide-react';
import { ClientData, FormStatus } from '../types';

const JoinForm: React.FC = () => {
  const [formData, setFormData] = useState<Omit<ClientData, 'timestamp'>>({
    name: '',
    email: '',
    instagram: '',
    country: ''
  });

  const [status, setStatus] = useState<FormStatus>({
    submitted: false,
    submitting: false,
    error: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const exportToCSV = (data: ClientData) => {
    // Simulate database storage by generating a CSV file
    const headers = ['Name,Email,Instagram,Country,Timestamp'];
    const row = [`"${data.name}","${data.email}","${data.instagram}","${data.country}","${data.timestamp}"`];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join('\n') + '\n' + row.join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `client_${data.name.replace(/\s+/g, '_')}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ submitted: false, submitting: true, error: null });

    // Validate
    if (!formData.name || !formData.email || !formData.country) {
      setStatus({ submitted: false, submitting: false, error: 'Please fill in all required fields.' });
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const finalData: ClientData = {
        ...formData,
        timestamp: new Date().toISOString()
      };

      // "Store" the data (Client side simulation: Export to CSV)
      exportToCSV(finalData);

      setStatus({ submitted: true, submitting: false, error: null });
      setFormData({ name: '', email: '', instagram: '', country: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({ ...prev, submitted: false }));
      }, 5000);

    } catch (err) {
      setStatus({ submitted: false, submitting: false, error: 'An unexpected error occurred.' });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      <AnimatePresence>
        {status.submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-8 rounded-2xl bg-green-500/10 backdrop-blur-md border border-green-500/30 text-center"
          >
            <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
              <Check className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">Welcome Aboard</h3>
            <p className="text-green-200">Your data has been secured. The CSV record has been downloaded.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
                Join the List
              </h2>
              <p className="text-gray-400 mt-2 text-sm font-light">
                Secure your spot in the cosmic journey.
              </p>
            </div>

            <div className="space-y-4">
              {/* Name Input */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>

              {/* Instagram Input */}
              <div className="relative group">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="text"
                  name="instagram"
                  placeholder="Instagram Handle"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>

              {/* Country Input */}
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            {status.error && (
              <div className="mt-4 text-red-400 text-sm text-center">
                {status.error}
              </div>
            )}

            <button
              type="submit"
              disabled={status.submitting}
              className="mt-8 w-full group relative overflow-hidden rounded-xl bg-white text-black font-bold py-4 px-6 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                {status.submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>JOIN THE COSMOS</span>
                    <Download className="w-4 h-4" />
                  </>
                )}
              </div>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JoinForm;