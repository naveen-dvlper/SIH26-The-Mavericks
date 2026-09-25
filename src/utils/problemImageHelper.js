// Problem Image Resolver & Fallback Utility
// Provides high-resolution, problem-related images for civic infrastructure issues

export const PROBLEM_IMAGE_COLLECTIONS = {
  waterlogging: [
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80', // Flooded street / stormwater overflow
    'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80', // Rainwater submerged road
    'https://images.unsplash.com/photo-1562155847-c05f7386b204?auto=format&fit=crop&w=800&q=80'  // Urban drainage canal overflow
  ],
  potholes: [
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80', // Deep asphalt potholes
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80', // Road surface damage & repair
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80'  // Water filled pothole on road
  ],
  pollution: [
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80', // Factory smoke and air pollution
    'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=800&q=80', // Industrial particulate dust plume
    'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?auto=format&fit=crop&w=800&q=80'  // Quarry & industrial dust terrain
  ],
  culvert: [
    'https://images.unsplash.com/photo-1584463699039-3c8106292271?auto=format&fit=crop&w=800&q=80', // Concrete culvert / drainage channel
    'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80', // Dam approach and reservoir retaining structure
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80'  // Concrete retaining wall / bridge abutment
  ],
  waste: [
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80', // Municipal solid waste & plastic heap
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'  // Municipal trash collection site
  ],
  water_supply: [
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80', // Water supply pipeline valve
    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80'  // Water quality treatment & distribution
  ],
  mobility: [
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80', // Rural transit / student transit route
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80'  // Traffic congestion & arterial road
  ],
  education: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80', // Classroom & community learning
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'  // Student education & guidance
  ],
  infrastructure_default: [
    'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80', // Civil engineering site
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80'  // Engineering maintenance inspection
  ]
};

/**
 * Given any problem object, category, or description, resolves the most related image URL.
 */
export function getRelatedProblemImage(problemOrText, category = '', fallbackSeed = 0) {
  let text = '';
  let cat = '';

  if (typeof problemOrText === 'string') {
    text = problemOrText.toLowerCase();
    cat = (category || '').toLowerCase();
  } else if (problemOrText && typeof problemOrText === 'object') {
    // If the problem already has a valid remote or base64 photoUrl, keep it!
    const existing = problemOrText.photoUrl;
    if (existing && typeof existing === 'string') {
      const trimmed = existing.trim();
      if (
        (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) &&
        trimmed !== 'placeholder_image_url' &&
        !trimmed.startsWith('blob:')
      ) {
        return trimmed;
      }
    }

    text = `${problemOrText.title || ''} ${problemOrText.description || ''} ${problemOrText.location || ''}`.toLowerCase();
    cat = `${problemOrText.category || ''} ${problemOrText.aiAnalysis?.category || ''}`.toLowerCase();
  }

  // Matching logic based on domain problem keywords
  if (
    text.includes('waterlog') || 
    text.includes('flooding') || 
    text.includes('stormwater') || 
    text.includes('drain') || 
    text.includes('monsoon water') ||
    cat.includes('stormwater') ||
    cat.includes('drainage')
  ) {
    const list = PROBLEM_IMAGE_COLLECTIONS.waterlogging;
    return list[Math.abs(fallbackSeed) % list.length];
  }

  if (
    text.includes('pothole') || 
    text.includes('asphalt') || 
    text.includes('road damage') || 
    text.includes('pavement') || 
    text.includes('carpet') ||
    cat.includes('pavement') ||
    cat.includes('pothole')
  ) {
    const list = PROBLEM_IMAGE_COLLECTIONS.potholes;
    return list[Math.abs(fallbackSeed) % list.length];
  }

  if (
    text.includes('pollution') || 
    text.includes('dust') || 
    text.includes('crushing') || 
    text.includes('particulate') || 
    text.includes('effluent') || 
    text.includes('smog') ||
    cat.includes('hazard') ||
    cat.includes('pollution')
  ) {
    const list = PROBLEM_IMAGE_COLLECTIONS.pollution;
    return list[Math.abs(fallbackSeed) % list.length];
  }

  if (
    text.includes('culvert') || 
    text.includes('retaining wall') || 
    text.includes('dam') || 
    text.includes('bridge') || 
    text.includes('spillway') || 
    text.includes('silt')
  ) {
    const list = PROBLEM_IMAGE_COLLECTIONS.culvert;
    return list[Math.abs(fallbackSeed) % list.length];
  }

  if (
    text.includes('waste') || 
    text.includes('garbage') || 
    text.includes('dump') || 
    text.includes('plastic') || 
    text.includes('trash') ||
    cat.includes('sanitation')
  ) {
    const list = PROBLEM_IMAGE_COLLECTIONS.waste;
    return list[Math.abs(fallbackSeed) % list.length];
  }

  if (
    text.includes('water monitoring') || 
    text.includes('pipeline') || 
    text.includes('drinking water') || 
    text.includes('water access') ||
    cat.includes('water')
  ) {
    const list = PROBLEM_IMAGE_COLLECTIONS.water_supply;
    return list[Math.abs(fallbackSeed) % list.length];
  }

  if (
    text.includes('transport') || 
    text.includes('transit') || 
    text.includes('traffic') || 
    text.includes('mobility') ||
    cat.includes('mobility')
  ) {
    const list = PROBLEM_IMAGE_COLLECTIONS.mobility;
    return list[Math.abs(fallbackSeed) % list.length];
  }

  if (
    text.includes('education') || 
    text.includes('career') || 
    text.includes('students') || 
    text.includes('dialect') ||
    cat.includes('education')
  ) {
    const list = PROBLEM_IMAGE_COLLECTIONS.education;
    return list[Math.abs(fallbackSeed) % list.length];
  }

  const def = PROBLEM_IMAGE_COLLECTIONS.infrastructure_default;
  return def[Math.abs(fallbackSeed) % def.length];
}

/**
 * React onError handler for problem images.
 * If an image fails to load, gracefully falls back to a related civic image so no broken icon is shown.
 */
export function handleProblemImageError(event, fallbackCategory = '') {
  const target = event.currentTarget;
  if (!target) return;
  const currentSrc = target.src;
  const fallback = getRelatedProblemImage(fallbackCategory, '', 1);

  if (currentSrc !== fallback) {
    target.onerror = null; // Prevent infinite error loops
    target.src = fallback;
  }
}
