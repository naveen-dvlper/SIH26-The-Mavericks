import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Camera, MapPin, Mic, Loader2, Image as ImageIcon, CheckCircle2, ArrowRight } from 'lucide-react'
import { apiService } from '../services/apiService'
import { getRelatedProblemImage, handleProblemImageError } from '../utils/problemImageHelper'

export default function ReportProblemPage() {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);
  
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            setLocation(data.display_name || `${latitude}, ${longitude}`);
            setLocationLoading(false);
          } catch (err) {
            console.error("Geocoding failed", err);
            setLocationError(true);
            setLocationLoading(false);
          }
        },
        (err) => {
          console.error("Geolocation denied or failed", err);
          setLocationError(true);
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError(true);
      setLocationLoading(false);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        return;
      }
      setPhoto(file);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!description || !location) {
      setError("Please describe the problem and specify the location.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      let finalPhotoUrl = null;

      // If citizen selected a local photo, convert to portable base64 data URL
      if (photo) {
        finalPhotoUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(photo);
        });
      }

      // If no photo was attached, automatically assign an appropriate online image related to the problem
      if (!finalPhotoUrl) {
        finalPhotoUrl = getRelatedProblemImage(description, location);
      }
      
      const data = await apiService.createComplaint({
        description,
        location,
        photoUrl: finalPhotoUrl
      });
      
      if (data && data.success) {
        setSuccessData({
          ...data,
          displayPhoto: finalPhotoUrl
        });
      } else {
        setError(data?.error || "Failed to submit complaint.");
      }
    } catch (err) {
      setError("Failed to submit problem report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    const aiReport = successData.aiAnalysis;
    const photoToDisplay = successData.displayPhoto || successData.complaint?.photoUrl || getRelatedProblemImage(description, aiReport?.category);

    return (
      <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto px-6">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#123158] text-center mb-1">Problem Registered & Analyzed by AI</h1>
            <p className="text-slate-600 text-center text-sm mb-6">
              Saved into the state database. AI has generated a detailed triage report and submitted it to the State Portal Admin for routing approval.
            </p>

            {/* Problem Photo Preview */}
            {photoToDisplay && (
              <div className="w-full h-44 bg-slate-100 rounded-lg mb-6 overflow-hidden border border-slate-200">
                <img 
                  src={photoToDisplay} 
                  alt="Registered problem" 
                  onError={(e) => handleProblemImageError(e, aiReport?.category)}
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            
            <div className="bg-slate-50 rounded-lg p-5 mb-6 text-left border border-slate-200 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400">Tracking Reference</p>
                  <p className="text-lg font-bold font-mono text-[#123158]">{successData.complaintId}</p>
                </div>
                <span className="px-3 py-1 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Pending Admin Approval
                </span>
              </div>

              {aiReport && (
                <div className="space-y-3 text-xs">
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <p className="font-bold text-[#123158] mb-1 flex items-center gap-1.5">
                      <span>🤖 AI Triage Report:</span>
                      <span className="text-emerald-700">{aiReport.category}</span>
                    </p>
                    <p className="text-slate-600 leading-relaxed">{aiReport.reasoning}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <p className="text-slate-400 font-semibold">Triage Recommendation</p>
                      <p className="font-bold text-slate-800">
                        {aiReport.recommendedPath === 'research' ? '🔬 Academic Research Required' : '🛠️ Routine Municipal Repair'}
                      </p>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <p className="text-slate-400 font-semibold">Estimated Budget Scope</p>
                      <p className="font-bold text-slate-800">{aiReport.estimatedBudgetRange || 'Standard Dept Allocation'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate(`/track?id=${successData.complaintId}`)}
                className="w-full bg-[#123158] hover:bg-[#0d223f] text-white text-[15px] font-bold py-3 rounded shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                Track Problem Lifecycle <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setSuccessData(null);
                  setPhoto(null);
                  setDescription("");
                }}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-[14px] font-semibold py-2.5 rounded transition cursor-pointer"
              >
                Report Another Citizen Problem
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Breadcrumbs */}
        <div className="text-[13px] text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:underline hover:text-[#123158]">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#123158] font-semibold">Report a Problem</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[34px] font-serif text-[#123158] mb-2 font-bold tracking-tight">Report a Problem</h1>
          <p className="text-[15px] text-slate-600">
            Provide details about the civic issue. Our AI will automatically categorize and route it appropriately.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
          
          {/* Step 1 */}
          <div className="mb-8">
            <label className="block text-[15px] font-medium text-slate-800 mb-3">
              1. Upload Photo <span className="text-red-500">*</span>
            </label>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              ref={cameraInputRef}
              onChange={handleFileChange}
            />
            <div 
              className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-lg p-8 text-center transition flex flex-col items-center justify-center min-h-[200px]"
            >
              {photo ? (
                <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer flex flex-col items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-green-600 mb-3" />
                  <p className="text-green-700 font-bold text-[15px] max-w-[250px] truncate">{photo.name}</p>
                  <p className="text-slate-400 text-[13px] mt-2 hover:text-[#123158] transition underline decoration-dashed">Tap to change image</p>
                </div>
              ) : (
                <>
                  <Camera className="w-8 h-8 text-slate-400 mb-3" />
                  <p className="text-[#123158] font-medium text-[15px] mb-4">Add a photo of the issue</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[300px] justify-center mb-4">
                    <button 
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex-1 bg-[#123158] hover:bg-[#0d223f] text-white py-2.5 px-4 rounded-md text-[14px] font-bold flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <Camera className="w-4 h-4" /> Capture Live
                    </button>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-[#123158] py-2.5 px-4 rounded-md text-[14px] font-bold flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <ImageIcon className="w-4 h-4" /> Select File
                    </button>
                  </div>

                  <p className="text-slate-400 text-[13px]">Supports JPG, PNG (Max 5MB)</p>
                </>
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-8">
            <label className="block text-[15px] font-medium text-slate-800 mb-3">
              2. Confirm Location <span className="text-red-500">*</span>
            </label>
            
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-[#f8f9fa] relative h-[200px] flex flex-col justify-end">
              {/* Dotted map background representation */}
              <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {/* Map Pin */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none pb-8">
                <MapPin className="w-8 h-8 text-red-600 fill-white stroke-[2px]" />
              </div>

              {/* Location Input Strip */}
              <div className="relative z-20 bg-white border border-slate-200 rounded mx-3 mb-3 p-3 flex items-center shadow-sm">
                <input 
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={locationLoading ? "Fetching GPS location..." : "Enter your street address..."}
                  className="w-full text-[14px] text-slate-800 font-medium outline-none bg-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 mt-2.5 px-1">
              <MapPin className={`w-3.5 h-3.5 ${locationError ? 'text-amber-500' : (locationLoading ? 'text-blue-500 animate-pulse' : 'text-emerald-500')}`} />
              <span className={`text-[13px] font-medium ${locationError ? 'text-amber-600' : (locationLoading ? 'text-blue-600' : 'text-slate-500')}`}>
                {locationLoading ? 'Accessing GPS...' : (locationError ? 'GPS access denied/failed. Please type your location manually.' : 'Auto-captured from GPS. You can edit if needed.')}
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-8">
            <label className="block text-[15px] font-medium text-slate-800 mb-3">
              3. Describe the Issue <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea 
                rows="4" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., The road near the main market has severe potholes causing daily traffic jams..." 
                className="w-full text-[14px] p-4 border border-slate-200 rounded-lg outline-none focus:border-[#123158] transition resize-none pr-12"
              ></textarea>
              <button type="button" className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition">
                <Mic className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm font-medium mb-4">{error}</p>}

          {/* Submit Button */}
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#123158] hover:bg-[#0d223f] disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-[16px] font-bold py-4 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : "Submit Complaint"}
          </button>

        </div>
      </div>
    </div>
  )
}
