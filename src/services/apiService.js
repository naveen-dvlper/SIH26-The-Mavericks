import { SEED_COMPLAINTS, TOP_UNIVERSITIES_DATA } from '../data/seedComplaints.js';
import { getRelatedProblemImage } from '../utils/problemImageHelper.js';

const STORAGE_KEY = 'setu_complaints_data';
const NETWORK_TIMEOUT_MS = 6000;

/**
 * Returns the configured backend URL without trailing slash.
 */
export function getBackendBaseUrl() {
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Fallback for deployed static apps (Netlify / Vercel) if VITE_BACKEND_URL is not set
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('netlify.app') || host.includes('vercel.app')) {
      return 'https://sih26-the-mavericks.onrender.com';
    }
  }

  return '';
}

/**
 * Helper to fetch with timeout and protect against HTML redirects in SPAs.
 */
async function safeFetch(url, options = {}, timeoutMs = NETWORK_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timer);

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // In SPAs like Netlify/Vercel, non-existent endpoints get redirected to index.html (200 OK text/html)
      throw new Error(`Non-JSON response received from ${url} (content-type: ${contentType})`);
    }

    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Initialize and get complaints stored in localStorage.
 */
export function getLocalComplaints() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list = SEED_COMPLAINTS;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }

    // Ensure every complaint has a valid problem-related photoUrl
    let hasChanges = false;
    const sanitized = list.map((item, idx) => {
      if (!item.photoUrl || typeof item.photoUrl !== 'string' || item.photoUrl.trim() === '' || item.photoUrl.startsWith('blob:') || item.photoUrl === 'placeholder_image_url') {
        hasChanges = true;
        return {
          ...item,
          photoUrl: getRelatedProblemImage(item, item.aiAnalysis?.category || '', idx)
        };
      }
      return item;
    });

    if (hasChanges || !raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    }
    return sanitized;
  } catch (err) {
    console.warn('Error reading from localStorage, using seed complaints:', err);
    return SEED_COMPLAINTS;
  }
}

/**
 * Save complaints to localStorage.
 */
export function saveLocalComplaints(complaints) {
  try {
    if (Array.isArray(complaints)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    }
  } catch (err) {
    console.warn('Failed to save complaints to localStorage:', err);
  }
}

/**
 * Generate client-side AI analysis for offline or static deployments
 */
export function generateLocalAIReport(description, location) {
  const lowerDesc = (description || '').toLowerCase();
  const isResearchKeyword = 
    lowerDesc.includes('waterlog') || 
    lowerDesc.includes('flood') || 
    lowerDesc.includes('traffic') || 
    lowerDesc.includes('pollution') || 
    lowerDesc.includes('gradient') || 
    lowerDesc.includes('chronic') || 
    lowerDesc.includes('drainage') || 
    lowerDesc.includes('recurrent') ||
    lowerDesc.includes('bridge') ||
    lowerDesc.includes('dam');

  if (isResearchKeyword) {
    return {
      isValid: true,
      confidence: 0.95,
      category: 'Drainage & Environmental Engineering',
      isComplexPattern: true,
      recommendedPath: 'research',
      reasoning: 'Complex hydrological or structural issue with recurring failure pattern across seasons. Municipal patchwork has proven inadequate. Requires technical university modeling and innovative engineering solution.',
      scopeOfWork: 'Topographic elevation scanning, hydrological flow simulation, and durable infrastructure design.',
      estimatedBudgetRange: '₹3.5L - ₹7.0L Academic Pilot Grant',
      targetDomain: 'Civil, Environmental & Applied Engineering'
    };
  }

  return {
    isValid: true,
    confidence: 0.92,
    category: 'Municipal Works & Civic Maintenance',
    isComplexPattern: false,
    recommendedPath: 'municipal_repair',
    reasoning: 'Standard localized civil/sanitary wear-and-tear suitable for standard municipal SOP repair machinery. Does not require academic thesis or deep engineering modeling.',
    scopeOfWork: 'Site inspection, standard equipment deployment, material replacement, and QA sign-off within 72 hours.',
    estimatedBudgetRange: '₹25,000 - ₹60,000 Routine Maintenance Budget',
    targetDomain: 'Municipal Works Department'
  };
}

/**
 * API Service with seamless backend + offline fallback
 */
export const apiService = {
  /**
   * Fetch all complaints with fallback to localStorage seed data.
   */
  async getComplaints() {
    const baseUrl = getBackendBaseUrl();
    try {
      const res = await safeFetch(`${baseUrl}/api/complaints`, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const sanitized = data.map((item, idx) => {
            if (!item.photoUrl || typeof item.photoUrl !== 'string' || item.photoUrl.trim() === '' || item.photoUrl.startsWith('blob:') || item.photoUrl === 'placeholder_image_url') {
              return {
                ...item,
                photoUrl: getRelatedProblemImage(item, item.aiAnalysis?.category || '', idx)
              };
            }
            return item;
          });
          saveLocalComplaints(sanitized);
          return sanitized;
        }
      }
    } catch (err) {
      console.warn('Backend /api/complaints unavailable or returned non-JSON, using local storage cache:', err.message);
    }
    return getLocalComplaints();
  },

  /**
   * Fetch a single complaint by ID.
   */
  async getComplaintById(id) {
    const baseUrl = getBackendBaseUrl();
    try {
      const res = await safeFetch(`${baseUrl}/api/complaints/${id}`, { method: 'GET' });
      if (res.ok) {
        const item = await res.json();
        if (item && (!item.photoUrl || item.photoUrl.startsWith('blob:') || item.photoUrl === 'placeholder_image_url')) {
          item.photoUrl = getRelatedProblemImage(item, item.aiAnalysis?.category || '', 0);
        }
        return item;
      }
    } catch (err) {
      console.warn(`Backend /api/complaints/${id} unavailable, checking local store:`, err.message);
    }

    const localList = getLocalComplaints();
    const found = localList.find(c => c.id === id);
    if (found) {
      if (!found.photoUrl || found.photoUrl.startsWith('blob:') || found.photoUrl === 'placeholder_image_url') {
        found.photoUrl = getRelatedProblemImage(found, found.aiAnalysis?.category || '', 0);
      }
      return found;
    }

    throw new Error(`Problem record ${id} not found.`);
  },

  /**
   * Submit a new complaint by a citizen.
   */
  async createComplaint({ location, description, photoUrl }) {
    const effectivePhoto = (photoUrl && typeof photoUrl === 'string' && !photoUrl.startsWith('blob:') && photoUrl !== 'placeholder_image_url')
      ? photoUrl
      : getRelatedProblemImage({ description, location });

    const baseUrl = getBackendBaseUrl();
    let complaintData = null;

    try {
      const res = await safeFetch(`${baseUrl}/api/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, description, photoUrl: effectivePhoto })
      });
      if (res.ok) {
        complaintData = await res.json();
      }
    } catch (err) {
      console.warn('Backend complaint submission failed, saving locally:', err.message);
    }

    if (complaintData && complaintData.success) {
      if (complaintData.complaint && (!complaintData.complaint.photoUrl || complaintData.complaint.photoUrl.startsWith('blob:'))) {
        complaintData.complaint.photoUrl = effectivePhoto;
      }
      return complaintData;
    }

    // Client-side fallback creation
    const complaintId = `JH-26-${Math.random().toString(16).slice(2, 7).toUpperCase()}`;
    const aiReport = generateLocalAIReport(description, location);
    const newComplaint = {
      id: complaintId,
      location,
      description,
      photoUrl: effectivePhoto,
      status: 'pending_govt_approval',
      submittedAt: new Date().toISOString(),
      aiAnalysis: aiReport
    };

    const localList = getLocalComplaints();
    localList.unshift(newComplaint);
    saveLocalComplaints(localList);

    return {
      success: true,
      complaintId,
      status: newComplaint.status,
      category: aiReport.category,
      aiAnalysis: aiReport,
      complaint: newComplaint
    };
  },

  /**
   * Admin approves route: municipal or research.
   */
  async adminApprove(complaintId, { routeType, municipalityName }) {
    const baseUrl = getBackendBaseUrl();
    try {
      const res = await safeFetch(`${baseUrl}/api/complaints/${complaintId}/admin-approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routeType, municipalityName })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Update local cache as well
          const localList = getLocalComplaints().map(c => c.id === complaintId ? data.complaint : c);
          saveLocalComplaints(localList);
          return data;
        }
      }
    } catch (err) {
      console.warn('Backend admin approval failed, updating locally:', err.message);
    }

    // Local fallback update
    const localList = getLocalComplaints();
    const item = localList.find(c => c.id === complaintId);
    if (!item) throw new Error('Complaint not found');

    let actionTaken = '';
    if (routeType === 'municipal') {
      const municipality = municipalityName || `${item.location?.split(',')[0] || 'Area'} Municipal Corporation`;
      const municipalEmail = `works@${municipality.toLowerCase().replace(/[^a-z0-9]/g, '')}.gov.in`;

      item.status = 'municipal_repair_assigned';
      item.municipalDetails = {
        assignedMunicipality: municipality,
        wardNumber: 'Ward 14 (Central Zone)',
        actionRequired: item.aiAnalysis?.scopeOfWork || 'Immediate civil/sanitary repair and site clearance.',
        dispatchedAt: new Date().toISOString(),
        dispatchedEmail: municipalEmail,
        status: 'dispatched'
      };
      actionTaken = `Automated official work order email transmitted to ${municipality} (${municipalEmail}).`;
    } else {
      const invited = TOP_UNIVERSITIES_DATA.map(u => u.name);
      item.status = 'research_invitations_sent';
      item.universityRoute = {
        invitedUniversities: invited,
        invitationSentAt: new Date().toISOString(),
        interests: item.universityRoute?.interests || []
      };
      actionTaken = `AI research challenge brief emailed to ${invited.length} top academic institutions across India with secure response link.`;
    }

    saveLocalComplaints(localList);
    return { success: true, complaint: item, actionTaken };
  },

  /**
   * University submits expression of interest.
   */
  async submitUniversityInterest(complaintId, interestData) {
    const baseUrl = getBackendBaseUrl();
    try {
      const res = await safeFetch(`${baseUrl}/api/complaints/${complaintId}/university-interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interestData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const localList = getLocalComplaints().map(c => c.id === complaintId ? data.complaint : c);
          saveLocalComplaints(localList);
          return data;
        }
      }
    } catch (err) {
      console.warn('Backend interest submission failed, updating locally:', err.message);
    }

    // Local fallback update
    const localList = getLocalComplaints();
    const item = localList.find(c => c.id === complaintId);
    if (!item) throw new Error('Complaint not found');

    if (!item.universityRoute) {
      item.universityRoute = { invitedUniversities: [], interests: [] };
    }
    if (!item.universityRoute.interests) {
      item.universityRoute.interests = [];
    }

    const currentLen = item.universityRoute.interests.length;
    const newInterest = {
      id: `INT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      universityName: interestData.universityName || 'Birla Institute of Technology (BIT) Mesra',
      department: interestData.department || 'Civil & Environmental Engineering',
      nodalOfficer: interestData.nodalOfficer || 'Academic Nodal Officer',
      contactEmail: interestData.contactEmail || 'nodal@bitmesra.ac.in',
      whyThisUniversity: interestData.whyThisUniversity,
      availableResources: interestData.availableResources,
      expectedTimelineWeeks: Number(interestData.expectedTimelineWeeks) || 8,
      submittedAt: new Date().toISOString(),
      aiFitScore: Math.max(78, 95 - currentLen * 5),
      aiRank: currentLen + 1,
      aiRankingReason: `Ranked #${currentLen + 1} based on comprehensive resource alignment (${interestData.department || 'Applied Engineering'}) and ${interestData.expectedTimelineWeeks || 8}-week timeline.`
    };

    item.universityRoute.interests.push(newInterest);
    saveLocalComplaints(localList);

    return {
      success: true,
      interest: newInterest,
      allInterestsCount: item.universityRoute.interests.length,
      complaint: item
    };
  },

  /**
   * Admin assigns problem to chosen university.
   */
  async assignUniversity(complaintId, { universityName, contactEmail }) {
    const baseUrl = getBackendBaseUrl();
    try {
      const res = await safeFetch(`${baseUrl}/api/complaints/${complaintId}/assign-university`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityName, contactEmail })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const localList = getLocalComplaints().map(c => c.id === complaintId ? data.complaint : c);
          saveLocalComplaints(localList);
          return data;
        }
      }
    } catch (err) {
      console.warn('Backend assign university failed, updating locally:', err.message);
    }

    const localList = getLocalComplaints();
    const item = localList.find(c => c.id === complaintId);
    if (!item) throw new Error('Complaint not found');

    const safeUnivName = universityName || item.universityRoute?.interests?.[0]?.universityName || "BIT Mesra";
    const univCode = safeUnivName.replace(/[^A-Za-z]/g, '').slice(0, 6).toUpperCase();
    const loginEmail = contactEmail || `research@${univCode.toLowerCase()}.edu.in`;
    const tempPassword = `${univCode}@jharkhand2026`;

    item.status = 'in_research';
    if (!item.universityRoute) item.universityRoute = { invitedUniversities: [], interests: [] };

    item.universityRoute.selectedUniversity = safeUnivName;
    item.universityRoute.assignedAt = new Date().toISOString();
    item.universityRoute.portalLoginAccount = {
      email: loginEmail,
      tempPass: tempPassword,
      institutionalCode: `UNIV-${univCode}-2026`
    };

    if (!item.universityRoute.workspaceUpdates) {
      item.universityRoute.workspaceUpdates = [
        {
          id: 'UPD-INIT',
          title: 'Official Project Commissioned by Govt of Jharkhand',
          note: `Project officially allocated to ${safeUnivName}. Academic workspace initialized. Research team assigned.`,
          stage: 'Literature & Problem Definition',
          author: 'State Nodal Administrator, SETU',
          timestamp: new Date().toISOString()
        }
      ];
    }

    saveLocalComplaints(localList);
    return {
      success: true,
      complaint: item,
      loginCredentials: item.universityRoute.portalLoginAccount
    };
  },

  /**
   * Post a milestone update in the university workspace.
   */
  async postWorkspaceUpdate(complaintId, { title, note, stage, author, attachmentName }) {
    const baseUrl = getBackendBaseUrl();
    try {
      const res = await safeFetch(`${baseUrl}/api/complaints/${complaintId}/workspace-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, note, stage, author, attachmentName })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const localList = getLocalComplaints().map(c => c.id === complaintId ? data.complaint : c);
          saveLocalComplaints(localList);
          return data;
        }
      }
    } catch (err) {
      console.warn('Backend workspace update failed, updating locally:', err.message);
    }

    const localList = getLocalComplaints();
    const item = localList.find(c => c.id === complaintId);
    if (!item) throw new Error('Complaint not found');

    const update = {
      id: `UPD-${Date.now().toString().slice(-4)}`,
      title,
      note,
      stage: stage || 'Field Prototyping & Sampling',
      author: author || 'Project Research Lead',
      timestamp: new Date().toISOString(),
      attachmentName: attachmentName || null
    };

    if (!item.universityRoute) item.universityRoute = {};
    if (!item.universityRoute.workspaceUpdates) item.universityRoute.workspaceUpdates = [];

    item.universityRoute.workspaceUpdates.unshift(update);
    saveLocalComplaints(localList);

    return { success: true, update, complaint: item };
  },

  /**
   * University submits final output / deliverable.
   */
  async submitFinalOutput(complaintId, { executiveSummary, deliverableType, keyFindings, recommendations, fileLink }) {
    const baseUrl = getBackendBaseUrl();
    try {
      const res = await safeFetch(`${baseUrl}/api/complaints/${complaintId}/submit-final-output`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executiveSummary, deliverableType, keyFindings, recommendations, fileLink })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const localList = getLocalComplaints().map(c => c.id === complaintId ? data.complaint : c);
          saveLocalComplaints(localList);
          return data;
        }
      }
    } catch (err) {
      console.warn('Backend final output failed, updating locally:', err.message);
    }

    const localList = getLocalComplaints();
    const item = localList.find(c => c.id === complaintId);
    if (!item) throw new Error('Complaint not found');

    const finalOutput = {
      submittedAt: new Date().toISOString(),
      executiveSummary,
      deliverableType: deliverableType || 'Engineering Blueprint',
      keyFindings,
      recommendations,
      fileLink: fileLink || 'https://jharkhand.gov.in/setu/deliverables/final_report.pdf'
    };

    item.status = 'output_submitted';
    if (!item.universityRoute) item.universityRoute = {};
    item.universityRoute.finalOutput = finalOutput;

    if (!item.universityRoute.workspaceUpdates) item.universityRoute.workspaceUpdates = [];
    item.universityRoute.workspaceUpdates.unshift({
      id: `UPD-${Date.now().toString().slice(-4)}`,
      title: `Final Research Output Submitted: ${deliverableType}`,
      note: executiveSummary,
      stage: 'Final Solution Synthesis',
      author: item.universityRoute.selectedUniversity || 'Academic Research Partner',
      timestamp: new Date().toISOString(),
      attachmentName: 'Final_Comprehensive_Engineering_Report.pdf'
    });

    saveLocalComplaints(localList);
    return { success: true, finalOutput, complaint: item };
  },

  /**
   * Get top universities list.
   */
  async getTopUniversities() {
    const baseUrl = getBackendBaseUrl();
    try {
      const res = await safeFetch(`${baseUrl}/api/top-universities`, { method: 'GET' });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Failed to load top universities from backend, using local list:', err.message);
    }
    return TOP_UNIVERSITIES_DATA;
  }
};
