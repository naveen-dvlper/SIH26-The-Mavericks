import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'setu_auth_session';

// Official government credentials preset
export const OFFICIAL_ADMIN_CREDS = {
  email: 'admin@jharkhand.gov.in',
  role: 'government',
  title: 'State Nodal Administrator',
  name: 'Shri Rajesh Kumar, IAS',
  department: 'Higher & Technical Education Department',
  cadre: 'JH-2012',
  securityLevel: 'Tier-1 Classified'
};

export const UNIVERSITY_PARTNER_CREDS = {
  email: 'nodal@bitmesra.ac.in',
  role: 'university',
  title: 'Academic Coordinator',
  name: 'Dr. Ananya Sen',
  department: 'Civil & Environmental Engineering',
  institution: 'BIT Mesra',
  securityLevel: 'Institutional Partner'
};

// Strict defined credentials for authorized logins
export const PREDEFINED_GOVT_ACCOUNTS = [
  {
    email: 'admin@jharkhand.gov.in',
    passwords: ['Admin@Jharkhand2026', 'Admin@jharkhand2026'],
    user: {
      id: 'GOV-ADM-JH-01',
      name: 'Shri Rajesh Kumar, IAS',
      email: 'admin@jharkhand.gov.in',
      role: 'admin',
      governmentRole: 'State Nodal Administrator',
      department: 'Higher & Technical Education Department',
      agency: 'Government of Jharkhand',
      securityClearance: 'Tier-1 Official',
      cadre: 'JH-2012'
    }
  },
  {
    email: 'director@jharkhand.gov.in',
    passwords: ['Director@Jharkhand2026', 'Director@jharkhand2026'],
    user: {
      id: 'GOV-DIR-JH-02',
      name: 'Dr. S. K. Murmu',
      email: 'director@jharkhand.gov.in',
      role: 'admin',
      governmentRole: 'Director of Municipal Administration',
      department: 'Urban Development & Housing Department',
      agency: 'Government of Jharkhand',
      securityClearance: 'Tier-1 Official',
      cadre: 'JH-2015'
    }
  }
];

export const PREDEFINED_UNIV_ACCOUNTS = [
  {
    email: 'nodal@bitmesra.ac.in',
    passwords: ['BitMesra@2026', 'BIT@jharkhand2026'],
    user: {
      id: 'UNIV-BITM-01',
      name: 'Dr. Ananya Sen',
      email: 'nodal@bitmesra.ac.in',
      role: 'university',
      title: 'Academic Coordinator',
      department: 'Civil & Environmental Engineering',
      institution: 'BIT Mesra',
      securityClearance: 'Institutional Partner'
    }
  },
  {
    email: 'research@iitism.ac.in',
    passwords: ['ISM@jharkhand2026', 'IITISM@2026'],
    user: {
      id: 'UNIV-IITISM-01',
      name: 'Prof. R. K. Mukherjee',
      email: 'research@iitism.ac.in',
      role: 'university',
      title: 'Lead Research Investigator',
      department: 'Department of Mining & Geotechnical Engineering',
      institution: 'IIT (ISM) Dhanbad',
      securityClearance: 'Institutional Partner'
    }
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Validate stored session
  const validateSession = useCallback(() => {
    try {
      const rawSession = localStorage.getItem(STORAGE_KEY);
      if (!rawSession) {
        setUser(null);
        setLoading(false);
        return null;
      }

      const session = JSON.parse(rawSession);
      if (!session || !session.token || !session.user || !session.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        setLoading(false);
        return null;
      }

      // Check session expiration
      if (Date.now() > session.expiresAt) {
        console.warn('Session expired. Logging out.');
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        setLoading(false);
        return null;
      }

      // Ensure user object has a valid role
      if (session.user.role !== 'admin' && session.user.role !== 'government' && session.user.role !== 'university') {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
        setLoading(false);
        return null;
      }

      setUser(session.user);
      setLoading(false);
      return session.user;
    } catch (err) {
      console.error('Failed to validate session:', err);
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setLoading(false);
      return null;
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    validateSession();

    // Listen to storage events across tabs
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY) {
        validateSession();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [validateSession]);

  /**
   * Secure login function with strict credential verification
   * @param {{ email: string, password?: string, role: 'government' | 'university' }} credentials
   */
  const login = async ({ email, password, role = 'government' }) => {
    setLoading(true);
    setAuthError(null);

    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      // Strict validation for missing/empty inputs
      if (!cleanEmail) {
        throw new Error('Email ID is required.');
      }
      if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        throw new Error('Please enter a valid official Email ID.');
      }
      if (!cleanPassword) {
        throw new Error('Password is required.');
      }

      // 1. Try server verification
      let serverError = null;
      let networkFailed = false;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: cleanPassword, role })
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success && data.user && data.token) {
          const session = {
            user: data.user,
            token: data.token,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
          setUser(data.user);
          setLoading(false);
          return { success: true, user: data.user };
        } else {
          // Explicit server response failure (e.g., 401 Unauthorized or 400 Bad Request)
          serverError = data.error || 'Invalid credentials. Authentication failed.';
        }
      } catch (networkErr) {
        networkFailed = true;
        console.warn('Network unreachable, checking against local secure credential directory:', networkErr);
      }

      // If server explicitly returned an error (invalid credentials), reject immediately!
      if (serverError) {
        throw new Error(serverError);
      }

      // 2. Strict Client-side Fallback Verification (only if network call failed)
      if (networkFailed) {
        let matchedAccount = null;

        if (role === 'government') {
          matchedAccount = PREDEFINED_GOVT_ACCOUNTS.find(
            acc => acc.email.toLowerCase() === cleanEmail && acc.passwords.includes(cleanPassword)
          );

          if (!matchedAccount) {
            throw new Error('Invalid official government credentials. Access restricted to authorized personnel.');
          }
        } else if (role === 'university') {
          matchedAccount = PREDEFINED_UNIV_ACCOUNTS.find(
            acc => acc.email.toLowerCase() === cleanEmail && acc.passwords.includes(cleanPassword)
          );

          if (!matchedAccount) {
            throw new Error('Invalid university credentials. Please check your assigned university email and password.');
          }
        } else {
          throw new Error('Invalid portal role selected.');
        }

        const authenticatedUser = {
          ...matchedAccount.user,
          loginTime: new Date().toISOString()
        };

        const session = {
          user: authenticatedUser,
          token: `setu_auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        setUser(authenticatedUser);
        setLoading(false);
        return { success: true, user: authenticatedUser };
      }

      throw new Error('Authentication failed. Please verify credentials.');
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Secure logout function
   */
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setAuthError(null);
  };

  const isAuthenticated = Boolean(user && user.role);
  const isAdmin = Boolean(user && (user.role === 'admin' || user.role === 'government'));
  const isUniversity = Boolean(user && user.role === 'university');

  const value = {
    user,
    loading,
    authError,
    isAuthenticated,
    isAdmin,
    isUniversity,
    login,
    logout,
    validateSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
