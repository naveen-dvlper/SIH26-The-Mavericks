export type ProblemStatus =
  | 'submitted'
  | 'ai_analyzed'
  | 'pending_govt_approval'
  | 'municipal_repair_assigned'
  | 'research_invitations_sent'
  | 'university_assigned'
  | 'in_research'
  | 'output_submitted'
  | 'resolved';

export interface AIAnalysisReport {
  isValid: boolean;
  category: string;
  confidence: number;
  isComplexPattern: boolean;
  recommendedPath: 'municipal_repair' | 'research';
  reasoning: string;
  scopeOfWork?: string;
  estimatedBudgetRange?: string;
  targetDomain?: string;
}

export interface UniversityInterest {
  id: string;
  universityName: string;
  department: string;
  nodalOfficer: string;
  contactEmail: string;
  whyThisUniversity: string;
  availableResources: string;
  expectedTimelineWeeks: number;
  submittedAt: string;
  aiFitScore?: number; // 0 - 100
  aiRankingReason?: string;
  aiRank?: number;
}

export interface UniversityWorkspaceUpdate {
  id: string;
  title: string;
  note: string;
  stage: 'Literature & Problem Definition' | 'Field Prototyping & Sampling' | 'Feasibility & Lab Testing' | 'Final Solution Synthesis';
  author: string;
  timestamp: string;
  attachmentName?: string;
}

export interface FinalOutputReport {
  submittedAt: string;
  executiveSummary: string;
  deliverableType: 'Engineering Blueprint' | 'Policy Framework' | 'Working Prototype' | 'Pilot Implementation Plan';
  keyFindings: string;
  recommendations: string;
  fileLink?: string;
}

export interface CivicComplaint {
  id: string;
  location: string;
  description: string;
  photoUrl?: string;
  status: ProblemStatus;
  submittedAt: string;
  aiAnalysis?: AIAnalysisReport;
  
  // Municipal Route
  municipalDetails?: {
    assignedMunicipality: string;
    wardNumber?: string;
    actionRequired: string;
    dispatchedAt?: string;
    status: 'dispatched' | 'in_progress' | 'completed';
  };

  // University Route
  universityRoute?: {
    invitedUniversities: string[];
    invitationSentAt?: string;
    interests: UniversityInterest[];
    selectedUniversity?: string;
    assignedAt?: string;
    portalLoginAccount?: {
      email: string;
      tempPass: string;
      institutionalCode: string;
    };
    workspaceUpdates?: UniversityWorkspaceUpdate[];
    finalOutput?: FinalOutputReport;
  };
}
