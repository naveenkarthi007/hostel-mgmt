import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', timeout: 10000 });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login:          (d) => api.post('/auth/login', d),
  googleLogin:    (credential) => api.post('/auth/google', { credential }),
  me:             ()  => api.get('/auth/me'),
  changePassword: (d) => api.put('/auth/change-password', d),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export const caretakerAPI = {
  getStats:    ()  => api.get('/caretaker/dashboard'),
  getComplaints: (p) => api.get('/caretaker/complaints', { params: p }),
  updateComplaint: (id, d) => api.put(`/caretaker/complaints/${id}`, d),
};

export const wardenAPI = {
  getStats:    ()  => api.get('/warden/dashboard'),
  getStudents: (p) => api.get('/warden/students', { params: p }),
  getComplaints: (p) => api.get('/warden/complaints', { params: p }),
};

export const studentsAPI = {
  getAll:    (p) => api.get('/students', { params: p }),
  getOne:    (id) => api.get(`/students/${id}`),
  create:    (d)  => api.post('/students', d),
  update:    (id,d) => api.put(`/students/${id}`, d),
  delete:    (id) => api.delete(`/students/${id}`),
  exportCSV: ()   => api.get('/students/export', { responseType: 'blob' }),
  importCSV: (f)  => api.post('/bulk/students', f),
};

export const roomsAPI = {
  getAll:  (p)    => api.get('/rooms', { params: p }),
  getOne:  (id)   => api.get(`/rooms/${id}`),
  create:  (d)    => api.post('/rooms', d),
  update:  (id,d) => api.put(`/rooms/${id}`, d),
  delete:  (id)   => api.delete(`/rooms/${id}`),
  getWardens: ()  => api.get('/rooms/wardens'),
  getFloorWardens: (p) => api.get('/rooms/floor-wardens', { params: p }),
  setFloorWardens: (d) => api.put('/rooms/floor-wardens', d),
  exportCSV: ()   => api.get('/rooms/export', { responseType: 'blob' }),
  importCSV: (f)  => api.post('/bulk/rooms', f),
};

export const allocationsAPI = {
  allocate: (d) => api.post('/allocations/allocate', d),
  vacate:   (d) => api.post('/allocations/vacate', d),
  history:  ()  => api.get('/allocations/history'),
  importCSV: (f) => api.post('/bulk/allocations', f),
};

export const complaintsAPI = {
  getAll:       (p)    => api.get('/complaints', { params: p }),
  create:       (d)    => api.post('/complaints', d),
  updateStatus: (id,d) => api.put(`/complaints/${id}`, d),
  delete:       (id)   => api.delete(`/complaints/${id}`),
};

export const noticesAPI = {
  getAll:  (p)  => api.get('/notices', { params: p }),
  create:  (d)  => api.post('/notices', d),
  delete:  (id) => api.delete(`/notices/${id}`),
};

export const visitorsAPI = {
  getAll:   (p)    => api.get('/visitors', { params: p }),
  create:   (d)    => api.post('/visitors', d),
  markExit: (id)   => api.put(`/visitors/${id}/exit`),
  delete:   (id)   => api.delete(`/visitors/${id}`),
};

export const leavesAPI = {
  getAll:       (p)      => api.get('/leaves', { params: p }),
  create:       (d)      => api.post('/leaves', d),
  updateStatus: (id, d)  => api.put(`/leaves/${id}/status`, d),
  delete:       (id)     => api.delete(`/leaves/${id}`),
};

export const messMenuAPI = {
  getAll: ()  => api.get('/mess-menu'),
  update: (d) => api.put('/mess-menu', d),
};

export const studentPortalAPI = {
  getProfile:    ()  => api.get('/student/profile'),
  getDashboard:  ()  => api.get('/student/dashboard'),
  getComplaints: (p) => api.get('/student/complaints', { params: p }),
  fileComplaint: (d) => api.post('/student/complaints', d),
  updateComplaint:  (id, d) => api.put(`/student/complaints/${id}`, d),
  resolveComplaint: (id)    => api.patch(`/student/complaints/${id}/resolve`),
};

export default api;
