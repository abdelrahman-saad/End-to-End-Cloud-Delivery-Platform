const API_BASE_URL = '/api';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signup: async (email, password) => {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  login: async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Notes API
export const notesAPI = {
  getAll: async () => {
    const data = await apiRequest('/notes');
    return data.data;
  },

  getById: async (id) => {
    const data = await apiRequest(`/notes/${id}`);
    return data.data;
  },

  create: async (note) => {
    const data = await apiRequest('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
    return data.data;
  },

  update: async (id, note) => {
    const data = await apiRequest(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
    return data.data;
  },

  delete: async (id) => {
    await apiRequest(`/notes/${id}`, {
      method: 'DELETE',
    });
  },

  toggleStar: async (id) => {
    const data = await apiRequest(`/notes/${id}/star`, {
      method: 'PATCH',
    });
    return data.data;
  },
};
