// Default seed complaints for SETU Civic Problem Resolution Network
// Provides seamless offline / static deployment fallback on Netlify and Vercel
export const SEED_COMPLAINTS = [
  {
    id: 'JH-26-09A4F',
    location: 'Sector 4, Bokaro Steel City',
    description: 'Chronic monsoon waterlogging due to blocked arterial stormwater culvert with reverse hydrological gradient. Causes recurrent flooding of 3 housing sectors and critical hospital approach roads during rains.',
    status: 'research_invitations_sent',
    photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    submittedAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    aiAnalysis: {
      isValid: true,
      category: 'Drainage & Stormwater Engineering',
      confidence: 0.96,
      isComplexPattern: true,
      recommendedPath: 'research',
      reasoning: 'Underground natural runoff topography has changed significantly due to heavy industrial sediment settling. A standard municipal dredge fails every season. Requires hydrodynamic modeling and hydraulic gradient recalculation.',
      scopeOfWork: 'Hydrological watershed mapping, culvert re-engineering simulation, low-impact urban drainage (SUDs) design.',
      estimatedBudgetRange: '₹4.5L - ₹8.0L Research & Pilot Grant',
      targetDomain: 'Civil Engineering / Hydrology / Environmental Fluid Dynamics'
    },
    universityRoute: {
      invitedUniversities: [
        'Birla Institute of Technology (BIT) Mesra',
        'IIT (ISM) Dhanbad',
        'NIT Jamshedpur',
        'IIT Kharagpur',
        'IIT Roorkee',
        'IIT Kanpur',
        'IIT Delhi',
        'IISc Bangalore',
        'IIT Bombay',
        'IIT Madras'
      ],
      invitationSentAt: new Date(Date.now() - 10 * 3600000).toISOString(),
      interests: [
        {
          id: 'INT-BITM-01',
          universityName: 'Birla Institute of Technology (BIT) Mesra',
          department: 'Department of Civil & Environmental Engineering',
          nodalOfficer: 'Dr. Ananya Sen',
          contactEmail: 'nodal@bitmesra.ac.in',
          whyThisUniversity: 'Our department has an established regional GIS hydrological lab in Ranchi with 12-year local rainfall dataset and 3 active Ph.D. scholars in urban stormwater modeling in Chota Nagpur plateau.',
          availableResources: 'Bentley FlowMaster, SWMM 5.2 watershed simulator, ultrasonic depth sensors, drone-based LiDAR terrain scanner.',
          expectedTimelineWeeks: 8,
          submittedAt: new Date(Date.now() - 7 * 3600000).toISOString(),
          aiFitScore: 94,
          aiRank: 1,
          aiRankingReason: 'Immediate geographic proximity allows continuous on-site sediment testing. Possesses specialized regional SWMM watershed models and field drone LiDAR.'
        },
        {
          id: 'INT-IITISM-02',
          universityName: 'IIT (ISM) Dhanbad',
          department: 'Department of Mining & Geotechnical Engineering',
          nodalOfficer: 'Prof. R. K. Mukherjee',
          contactEmail: 'research@iitism.ac.in',
          whyThisUniversity: 'Extensive track record handling industrial slurry runoffs, coal-belt subterranean water movement, and structural culvert subsidence.',
          availableResources: 'Soil mechanics lab, acoustic groundwater tracer array, FLAC3D finite element simulation software.',
          expectedTimelineWeeks: 12,
          submittedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
          aiFitScore: 88,
          aiRank: 2,
          aiRankingReason: 'World-class geological testing capabilities and robust soil mechanics lab; slightly longer timeline than BIT Mesra.'
        },
        {
          id: 'INT-NITJSR-03',
          universityName: 'NIT Jamshedpur',
          department: 'Civil Infrastructure Research Group',
          nodalOfficer: 'Dr. Vivek Verma',
          contactEmail: 'projects@nitjsr.ac.in',
          whyThisUniversity: 'Proximity to industrial steel belt civil structures and experience in reinforced culvert rehabilitation.',
          availableResources: 'Concrete durability testing bay, total station topographic scanners, student research cohort of 6 M.Tech scholars.',
          expectedTimelineWeeks: 10,
          submittedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
          aiFitScore: 83,
          aiRank: 3,
          aiRankingReason: 'Strong structural civil expertise, ready cohort of scholars, good regional equipment.'
        }
      ]
    }
  },
  {
    id: 'JH-26-09B21',
    location: 'Albert Ekka Chowk, Main Road, Ranchi',
    description: 'Dangerous pothole cluster and damaged asphalt carpet right at the central pedestrian intersection. Water ponding has eroded the sub-base.',
    status: 'pending_govt_approval',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    submittedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    aiAnalysis: {
      isValid: true,
      category: 'Municipal Pavement & Pothole Repair',
      confidence: 0.98,
      isComplexPattern: false,
      recommendedPath: 'municipal_repair',
      reasoning: 'Direct wear-and-tear of bituminous wearing coat. No deep structural subsidence detected. Can be rectified within 48-72 hours by Ranchi Municipal Corporation road maintenance division.',
      scopeOfWork: 'Cold mix asphalt patch repair, pneumatic compaction, and surface seal coat.',
      estimatedBudgetRange: '₹35,000 - ₹50,000 Routine Maintenance',
      targetDomain: 'Municipal Road Maintenance'
    }
  },
  {
    id: 'JH-26-08C19',
    location: 'Saraikela Iron Ore & Crushing Belt',
    description: 'High particulate matter suspension (PM2.5 / PM10) and groundwater effluent runoff exceeding safe biological limits near 18 stone-crushing units.',
    status: 'in_research',
    photoUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    submittedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    aiAnalysis: {
      isValid: true,
      category: 'Environmental & Airborne Industrial Hazard',
      confidence: 0.95,
      isComplexPattern: true,
      recommendedPath: 'research',
      reasoning: 'Exceeds standard municipal purview; requires specialized aerosol dispersion modeling, electrostatic dust suppression analysis, and water treatment chemistry.',
      scopeOfWork: 'Micro-climate particulate dispersion mapping and low-cost bio-filtration prototype.',
      estimatedBudgetRange: '₹6.0L State Research Grant',
      targetDomain: 'Environmental Engineering & Atmospheric Physics'
    },
    universityRoute: {
      invitedUniversities: ['IIT (ISM) Dhanbad', 'BIT Mesra', 'IIT Kharagpur'],
      selectedUniversity: 'IIT (ISM) Dhanbad',
      assignedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      portalLoginAccount: {
        email: 'research@iitism.ac.in',
        tempPass: 'ISM@jharkhand2026',
        institutionalCode: 'UNIV-IITISM-01'
      },
      workspaceUpdates: [
        {
          id: 'UPD-01',
          title: 'Baseline Air & Heavy Metal Sampling Completed',
          stage: 'Field Prototyping & Sampling',
          author: 'Prof. R. K. Mukherjee, Lead Investigator',
          timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
          note: 'Captured 48-hour continuous gravimetric air samples across 6 buffer zones around the crushing units. High levels of silica particulate identified.',
          attachmentName: 'Saraikela_Ambient_Air_Baseline_v1.pdf'
        },
        {
          id: 'UPD-02',
          title: 'High-Pressure Fogger Prototype Calibration',
          stage: 'Feasibility & Lab Testing',
          author: 'Dr. Priya Sharma, Post-Doctoral Fellow',
          timestamp: new Date(Date.now() - 18 * 3600000).toISOString(),
          note: 'Lab-scale mist nozzle setup demonstrated 73% particulate knockdown with 80% recycled slurry water.',
          attachmentName: 'MistKnockdown_Lab_Trial_Summary.pdf'
        }
      ]
    }
  },
  {
    id: 'JH-26-07D02',
    location: 'Patratu Valley Dam Approach Road, Ramgarh',
    description: 'Cracked retaining culvert wall with localized silt accumulation blocking normal discharge flow into the reservoir spillway channel.',
    status: 'municipal_repair_assigned',
    photoUrl: 'https://images.unsplash.com/photo-1584463699039-3c8106292271?auto=format&fit=crop&w=800&q=80',
    submittedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    aiAnalysis: {
      isValid: true,
      category: 'Drainage & Culvert Maintenance',
      confidence: 0.94,
      isComplexPattern: false,
      recommendedPath: 'municipal_repair',
      reasoning: 'Standard silt deposit with superficial masonry cracking along the exterior wingwall. Suitable for routine departmental repair machinery.',
      scopeOfWork: 'Mechanical desilting and high-strength mortar grouting of retaining face.',
      estimatedBudgetRange: '₹40,000 - ₹75,000 Municipal Division Budget',
      targetDomain: 'Road Construction & Urban Works'
    },
    municipalDetails: {
      assignedMunicipality: 'Ramgarh Municipal Council',
      wardNumber: 'Ward 08 (Valley Division)',
      actionRequired: 'Mechanical desilting and high-strength mortar grouting of retaining face.',
      dispatchedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      dispatchedEmail: 'works@ramgarhmunicipalcouncil.gov.in',
      status: 'dispatched'
    }
  }
];

export const TOP_UNIVERSITIES_DATA = [
  { name: "Birla Institute of Technology (BIT) Mesra", code: "BITM", email: "nodal@bitmesra.ac.in", city: "Ranchi", state: "Jharkhand", domain: "Civil, Hydrology, Environmental & IoT" },
  { name: "IIT (ISM) Dhanbad", code: "IITISM", email: "research@iitism.ac.in", city: "Dhanbad", state: "Jharkhand", domain: "Mining, Geo-hazards, Water & Pollution Control" },
  { name: "NIT Jamshedpur", code: "NITJSR", email: "projects@nitjsr.ac.in", city: "Jamshedpur", state: "Jharkhand", domain: "Transportation, Structural & Metallurgy" },
  { name: "IIT Kharagpur", code: "IITKGP", email: "civic.lab@iitkgp.ac.in", city: "Kharagpur", state: "West Bengal", domain: "Urban Planning, Water Resources & Civil Infrastructure" },
  { name: "IIT Kanpur", code: "IITK", email: "dean.rnd@iitk.ac.in", city: "Kanpur", state: "Uttar Pradesh", domain: "Sensor Networks, Environmental & Civil Engineering" },
  { name: "IIT Delhi", code: "IITD", email: "urban.research@iitd.ac.in", city: "New Delhi", state: "Delhi", domain: "Traffic Management, Air Quality & Infrastructure" },
  { name: "IISc Bangalore", code: "IISC", email: "civic.innovation@iisc.ac.in", city: "Bengaluru", state: "Karnataka", domain: "Computational Hydrology & Deep Tech" },
  { name: "IIT Roorkee", code: "IITR", email: "water.center@iitr.ac.in", city: "Roorkee", state: "Uttarakhand", domain: "Water Resources, Irrigation & Dam Safety" },
  { name: "IIT Bombay", code: "IITB", email: "ctara@iitb.ac.in", city: "Mumbai", state: "Maharashtra", domain: "Rural & Municipal Technology Interventions" },
  { name: "IIT Madras", code: "IITM", email: "infrastructure@iitm.ac.in", city: "Chennai", state: "Tamil Nadu", domain: "Smart Cities, Traffic & Pavement Technologies" }
];
