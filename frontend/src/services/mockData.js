// frontend/src/services/mockData.js
let machines = [
    { machineId: 'M-001', type: 'Lathe', status: 'pending', mttf: 100 },
    { machineId: 'M-002', type: 'Drilling', status: 'pending', mttf: 120 },
    { machineId: 'M-003', type: 'Turning', status: 'pending', mttf: 80 }
  ];
  
  let adjusters = [
    { adjusterId: 'A-001', expertise: ['Lathe', 'Drilling'], status: 'available' },
    { adjusterId: 'A-002', expertise: ['Turning'], status: 'available' }
  ];
  
  // Mock API for machines
  export const fetchMockMachines = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...machines]);
      }, 500);
    });
  };
  
  export const addMockMachine = (machineData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const machineId = `M-${String(machines.length + 1).padStart(3, '0')}`;
        const newMachine = {
          machineId,
          type: machineData.type,
          mttf: machineData.mttf,
          status: 'pending'
        };
        
        machines = [newMachine, ...machines];
        resolve(newMachine);
      }, 500);
    });
  };
  
  // Mock API for adjusters
  export const fetchMockAdjusters = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...adjusters]);
      }, 500);
    });
  };
  
  export const addMockAdjuster = (adjusterData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const adjusterId = `A-${String(adjusters.length + 1).padStart(3, '0')}`;
        const newAdjuster = {
          adjusterId,
          expertise: adjusterData.expertise,
          status: 'available'
        };
        
        adjusters = [newAdjuster, ...adjusters];
        resolve(newAdjuster);
      }, 500);
    });
  };