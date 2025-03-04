import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const gamificationApi = {
  async getUserData() {
    const response = await api.get('/gamification/user-data');
    return response.data;
  },

  async getLeaderboard() {
    const response = await api.get('/gamification/leaderboard');
    return response.data;
  },

  async updateStreak() {
    const response = await api.post('/gamification/update-streak');
    return response.data;
  },

  async addPoints(amount: number) {
    const response = await api.post('/gamification/add-points', { amount });
    return response.data;
  },

  async unlockBadge(badgeId: string) {
    const response = await api.post('/gamification/unlock-badge', { badgeId });
    return response.data;
  }
};

export default gamificationApi; 