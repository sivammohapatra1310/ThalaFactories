// frontend/src/services/api.js
import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000
});

// Machine API calls
export const fetchMachines = async () => {
  try {
    const response = await API.get('/machines');
    return response.data.machines;
  } catch (error) {
    console.error('Error fetching machines:', error);
    throw error;
  }
};

export const addMachine = async (machineData) => {
  try {
    const response = await API.post('/machines', machineData);
    return response.data.machine;
  } catch (error) {
    console.error('Error adding machine:', error);
    throw error;
  }
};

// Adjuster API calls
export const fetchAdjusters = async () => {
  try {
    const response = await API.get('/adjusters');
    return response.data.adjusters;
  } catch (error) {
    console.error('Error fetching adjusters:', error);
    throw error;
  }
};

export const addAdjuster = async (adjusterData) => {
  try {
    const response = await API.post('/adjusters', adjusterData);
    return response.data.adjuster;
  } catch (error) {
    console.error('Error adding adjuster:', error);
    throw error;
  }
};

// Mock data for testing without backend
export const mockData = {
  machines: [
    { machineId: 'M-001', type: 'Lathe', status: 'pending', mttf: 100 },
    { machineId: 'M-002', type: 'Drilling', status: 'pending', mttf: 120 },
    { machineId: 'M-003', type: 'Turning', status: 'pending', mttf: 80 }
  ],
  adjusters: [
    { adjusterId: 'A-001', expertise: ['Lathe', 'Drilling'], status: 'available' },
    { adjusterId: 'A-002', expertise: ['Turning'], status: 'available' }
  ]
};