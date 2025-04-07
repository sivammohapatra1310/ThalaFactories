import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Offcanvas,
  Container,
  NavDropdown,
  Nav,
  Card,
  Button,
  Row,
  Col,
  ProgressBar,
  ListGroup,
  Badge,
  Form,
  Alert,
  Modal,
} from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FaTools, FaCog, FaChartBar, FaClipboardList, FaSun, FaMoon, FaSignOutAlt, FaUser} from 'react-icons/fa';
import logo from '../assets/images/logo.png';
import {
  fetchMachines,
  fetchAdjusters,
  addMachine,
  addAdjuster, // assume an API to clear the DB queue if needed
} from '../services/api';

const styles = `
.bg-dark-gradient {
  background: linear-gradient(to right, #1a1a2e, #16213e, #1a1a2e);
}

.navbar-dark {
  background-color: rgba(26, 26, 46, 0.95) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.card-dark {
  background-color: #242443 !important;
  border: 1px solid #32324a !important;
}
  .card-hover {
    transition: all 0.3s ease;
    border: none;
  }
  .card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  .dark-hover:hover {
    box-shadow: 0 10px 20px rgba(255,255,255,0.1);
  }
  .list-item-hover {
    transition: all 0.2s ease;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide {
    animation: slideIn 0.5s ease-out;
  }
`;

// Simulation Algorithm classes
class Machine {
  constructor(id, type, mttf) {
    this.machine_id = id;
    this.type = type;
    this.mttf = mttf;
    this.last_up = 0.0;
    this.last_down = 0.0;
    this.total_up = 0.0;
    this.total_down = 0.0;
    this.is_up = true;
  }
}

class Adjuster {
  constructor(id, expertise) {
    this.adjuster_id = id;
    this.expertise = expertise;
    this.total_busy = 0.0;
    this.total_idle = 0.0;
    this.last_busy_start = 0.0;
    this.last_idle_start = 0.0;
    this.is_free = true;
  }
}

class Event {
  static MACHINE_FAILURE = 'MACHINE_FAILURE';
  static MACHINE_REPAIRED = 'MACHINE_REPAIRED';

  constructor(time, type, entity_id, adjuster_id = -1) {
    this.time = time;
    this.type = type;
    this.entity_id = entity_id;
    this.adjuster_id = adjuster_id;
  }
}

class Simulation {
  constructor() {
    this.events = [];
    this.machines = [];
    this.adjusters = [];
    this.brokenMachines = [];
    this.freeAdjusters = [];
    this.current_time = 0.0;
    this.rng = Math.random;
  }

  add_machine(id, type, mttf) {
    const machine = new Machine(id, type, mttf);
    this.machines.push(machine);
    const fail_time = this.getRandomTime(mttf);
    this.schedule_event(new Event(fail_time, Event.MACHINE_FAILURE, id));
  }

  add_adjuster(id, expertise) {
    const adjuster = new Adjuster(id, expertise);
    this.adjusters.push(adjuster);
    this.freeAdjusters.push(id);
  }

  run(duration) {
    while (this.events.length > 0) {
      const ev = this.events.shift();
      if (ev.time > duration) break;
      this.current_time = ev.time;
      if (ev.type === Event.MACHINE_FAILURE) {
        this.handle_machine_failure(ev.entity_id);
      } else if (ev.type === Event.MACHINE_REPAIRED) {
        this.handle_machine_repaired(ev.entity_id, ev.adjuster_id);
      }
    }
  }

  handle_machine_failure(machine_id) {
    const machine = this.machines[machine_id];
    machine.is_up = false;
    machine.total_up += (this.current_time - machine.last_up);
    machine.last_down = this.current_time;
    this.brokenMachines.push(machine_id);
    this.try_assign_repair();
  }

  handle_machine_repaired(machine_id, adjuster_id) {
    const machine = this.machines[machine_id];
    const adjuster = this.adjusters[adjuster_id];
    machine.total_down += (this.current_time - machine.last_down);
    machine.is_up = true;
    machine.last_up = this.current_time;
    adjuster.total_busy += (this.current_time - adjuster.last_busy_start);
    adjuster.is_free = true;
    adjuster.last_idle_start = this.current_time;
    this.freeAdjusters.push(adjuster_id);
    const fail_time = this.current_time + this.getRandomTime(machine.mttf);
    this.schedule_event(new Event(fail_time, Event.MACHINE_FAILURE, machine_id));
    this.try_assign_repair();
  }

  try_assign_repair() {
    while (this.brokenMachines.length > 0 && this.freeAdjusters.length > 0) {
      const mach_id = this.brokenMachines.shift();
      const adj_id = this.freeAdjusters.shift();
      const machine = this.machines[mach_id];
      const adjuster = this.adjusters[adj_id];
      if (!this.can_adjust(adjuster, machine)) {
        this.brokenMachines.push(mach_id);
        this.freeAdjusters.push(adj_id);
        break;
      }
      adjuster.is_free = false;
      adjuster.last_busy_start = this.current_time;
      adjuster.total_idle += (this.current_time - adjuster.last_idle_start);
      const repair_time = this.current_time + this.getRandomTime(10);
      this.schedule_event(new Event(repair_time, Event.MACHINE_REPAIRED, mach_id, adj_id));
    }
  }

  can_adjust(adjuster, machine) {
    return adjuster.expertise.includes(machine.type);
  }

  getRandomTime(base) {
    return this.rng() * base;
  }

  schedule_event(event) {
    this.events.push(event);
    this.events.sort((a, b) => a.time - b.time);
  }

  getStats() {
    // Create a stats object that can be used to update the UI
    const machineStats = this.machines.map(machine => {
      const total_time = machine.total_up + machine.total_down;
      return {
        id: machine.machine_id,
        type: machine.type,
        total_up: machine.total_up.toFixed(2),
        total_down: machine.total_down.toFixed(2),
        utilization: total_time > 0 ? ((machine.total_up / total_time) * 100).toFixed(2) : '0',
        status: machine.is_up ? 'Working' : 'Broken',
      };
    });
    const adjusterStats = this.adjusters.map(adjuster => {
      const total_time = adjuster.total_busy + adjuster.total_idle;
      return {
        id: adjuster.adjuster_id,
        expertise: adjuster.expertise,
        total_busy: adjuster.total_busy.toFixed(2),
        total_idle: adjuster.total_idle.toFixed(2),
        utilization: total_time > 0 ? ((adjuster.total_busy / total_time) * 100).toFixed(2) : '0',
        status: adjuster.is_free ? 'Available' : 'Busy',
      };
    });
    return { machineStats, adjusterStats };
  }
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);

  // Form states
  const [machineType, setMachineType] = useState('Lathe');
  const [machineMttf, setMachineMttf] = useState(100);
  const [adjusterExpertise, setAdjusterExpertise] = useState(['Lathe']);

  // Data states
  const [machines, setMachines] = useState([]);
  const [adjusters, setAdjusters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulation stats for modal display
  const [simStats, setSimStats] = useState(null);
  const [showSimModal, setShowSimModal] = useState(false);

  // Utilization data (static example)
  const [utilization] = useState({
    machines: 78,
    adjusters: 65,
  });

  // Toggle theme
  const toggleTheme = () => setDarkMode(!darkMode);
  // Toggle sidebar
  const handleSidebarClose = () => setShowSidebar(false);
  const handleSidebarShow = () => setShowSidebar(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [machinesData, adjustersData] = await Promise.all([
          fetchMachines(),
          fetchAdjusters(),
        ]);
        setMachines(machinesData || []);
        setAdjusters(adjustersData || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Add this useEffect to handle the back button
useEffect(() => {
  const handleBackButton = (e) => {
    e.preventDefault();
    alert('Please use logout to exit the application');
    // Push another state so back button doesn't exit
    window.history.pushState(null, document.title, window.location.href);
  };
  
  // Push initial state
  window.history.pushState(null, document.title, window.location.href);
  
  // Add event listener for the popstate event
  window.addEventListener('popstate', handleBackButton);
  
  // Clean up
  return () => {
    window.removeEventListener('popstate', handleBackButton);
  };
}, []);


  // Add Machine
  const handleAddMachine = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newMachine = await addMachine({
        type: machineType,
        mttf: parseInt(machineMttf),
      });
      // We add a mttf property if not already present.
      const machineWithType = { ...newMachine, type: machineType, mttf: parseInt(machineMttf) };
      setMachines([machineWithType, ...machines]);
      setError(null);
    } catch (err) {
      console.error('Failed to add machine:', err);
      setError('Failed to add machine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add Adjuster
  const handleAddAdjuster = async (e) => {
    e.preventDefault();
    if (!adjusterExpertise.length) {
      setError('Please select at least one expertise');
      return;
    }
    try {
      setLoading(true);
      const newAdjuster = await addAdjuster({ expertise: adjusterExpertise });
      setAdjusters([newAdjuster, ...adjusters]);
      setError(null);
    } catch (err) {
      console.error('Failed to add adjuster:', err);
      setError('Failed to add adjuster. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle expertise selection
  const handleExpertiseChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setAdjusterExpertise(selected);
  };

  // Example chart data
  const chartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
    datasets: [
      {
        label: 'Machine Productivity',
        data: [65, 59, 80, 81, 56],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.2,
      },
      {
        label: 'Adjuster Productivity',
        data: [28, 48, 40, 19, 86],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.2,
      },
    ],
  };

 // Simulation integration
const runSimulation = () => {
  // Create a new Simulation instance
  const sim = new Simulation();

  // Add current machines to the simulation.
  // Here we assume that each machine from state has properties machineId, type, and mttf.
  machines.forEach((machine, index) => {
    // Use provided mttf or a default value.
    const mttf = machine.mttf || 100;
    // We use the index as the simulation id.
    sim.add_machine(index, machine.type, mttf);
  });

  // Add current adjusters to the simulation.
  adjusters.forEach((adjuster, index) => {
    // Here we assume adjuster has adjusterId and expertise properties.
    sim.add_adjuster(index, adjuster.expertise || []);
  });

  // Run simulation for a fixed duration (e.g., 1000 time units)
  sim.run(1000.0);

  // Retrieve simulation stats to update the UI.
  const stats = sim.getStats();

  // For demonstration, show a modal with simulation stats.
  setSimStats(stats);

  // Clear the machine queue from the UI (simulate that DB queue is now empty).
  setMachines([]);

  // Update adjusters state:
  // We only keep adjusters that are still available (idle).
  const availableAdjusters = stats.adjusterStats
    .filter(adjStat => adjStat.status.toLowerCase() === 'available')
    .map(adjStat => ({
      adjusterId: adjStat.id,
      expertise: adjStat.expertise,
      status: adjStat.status.toLowerCase(),
    }));
  setAdjusters(availableAdjusters);
};

const toggleSimulation = () => {
  if (!simulationRunning) {
    // Start simulation: run the simulation algorithm
    runSimulation();
  }
  setSimulationRunning(!simulationRunning);
};


  return (
<div className={darkMode ? 'bg-dark-gradient text-white min-vh-100' : 'bg-light text-dark min-vh-100'}>
        <style>{styles}</style>
      {/* TOP NAVBAR */}
      <Navbar 
  bg={darkMode ? 'dark' : 'light'} 
  variant={darkMode ? 'dark' : 'light'} 
  className={`px-3 ${darkMode ? 'navbar-dark' : 'shadow-sm'}`}
  fixed="top"
>
  <Button variant={darkMode ? 'outline-light' : 'outline-dark'} onClick={handleSidebarShow}>
    <FaCog />
  </Button>
  <Navbar.Brand className="ms-3 d-flex align-items-center" href="/dashboard">
    <img
      src={logo}
      alt="Brand Logo"
      width="50"
      height="50"
      className="d-inline-block align-top me-2"
    />
    <span>Thala Factories</span>
  </Navbar.Brand>
  <Nav className="ms-auto d-flex align-items-center">
    <Form.Check
      type="switch"
      id="theme-switch"
      label={darkMode ? <FaMoon className="ms-1" /> : <FaSun className="ms-1" />}
      className="text-nowrap me-3"
      checked={darkMode}
      onChange={toggleTheme}
    />
    <NavDropdown 
      title={
        <div className="d-inline-flex align-items-center">
          <div 
            className="rounded-circle bg-primary d-flex justify-content-center align-items-center" 
            style={{ width: "32px", height: "32px", overflow: "hidden" }}
          >
            <FaUser color="white" />
          </div>
          <span className="ms-2">Admin</span>
        </div>
      } 
      id="profile-dropdown"
      align="end"
    >
      <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
      <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item 
        href="/logout"
        onClick={(e) => {
          e.preventDefault();
          if(window.confirm('Are you sure you want to logout?')) {
            window.location.href = '/';
          }
        }}
      >
        Logout
      </NavDropdown.Item>
    </NavDropdown>
  </Nav>
</Navbar>

      {/* SIDEBAR (Offcanvas) */}
      <Offcanvas show={showSidebar} onHide={handleSidebarClose} className={darkMode ? 'bg-dark text-white' : ''}>
  <Offcanvas.Header closeButton closeVariant={darkMode ? 'white' : undefined}>
    <Offcanvas.Title>Navigation</Offcanvas.Title>
  </Offcanvas.Header>
  <Offcanvas.Body>
    <Nav className="flex-column gap-2">
      <Nav.Link href="#dashboard" className={darkMode ? 'text-white' : 'text-dark'}>
        <FaChartBar className="me-2" />
        Dashboard
      </Nav.Link>
      <Nav.Link href="/reports" className={darkMode ? 'text-white' : 'text-dark'}>
        Reports
      </Nav.Link>
      <Nav.Link href="/analytics" className={darkMode ? 'text-white' : 'text-dark'}>
        Analytics
      </Nav.Link>
      <hr className={darkMode ? 'bg-light' : 'bg-dark'} />
      <Nav.Link 
        href="/logout" 
        className={`${darkMode ? 'text-white' : 'text-dark'} mt-auto`}
        onClick={(e) => {
          e.preventDefault();
          if(window.confirm('Are you sure you want to logout?')) {
            window.location.href = '/';
          }
        }}
      >
        <FaSignOutAlt className="me-2" />
        Logout
      </Nav.Link>
    </Nav>
  </Offcanvas.Body>
</Offcanvas>

      {/* SIMULATION CONTROLS */}
      <Container fluid className="mt-5 pt-5 px-4">
        <div className="d-flex gap-3">
          <Button variant={simulationRunning ? 'danger' : 'success'} onClick={toggleSimulation}>
            {simulationRunning ? 'Stop Simulation' : 'Start Simulation'}
          </Button>
          <Button variant={darkMode ? 'outline-light' : 'outline-secondary'}>
            Reset Simulation
          </Button>
        </div>
      </Container>

      {/* ERROR ALERT */}
      {error && (
        <Container className="mt-3">
          <Alert variant="danger">{error}</Alert>
        </Container>
      )}

      {/* MAIN CONTENT */}
      <Container fluid className="mt-4 px-4">
        <Row className="g-4">
          {/* UTILIZATION METRICS */}
          <Col lg={3} md={6}>
            <Card className={darkMode ? 'bg-dark text-white' : ''}>
              <Card.Body>
                <Card.Title>Utilization Metrics</Card.Title>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>Machines</span>
                    <span>{utilization.machines}%</span>
                  </div>
                  <ProgressBar now={utilization.machines} variant="success" className="mb-2" />
                </div>
                <div>
                  <div className="d-flex justify-content-between">
                    <span>Adjusters</span>
                    <span>{utilization.adjusters}%</span>
                  </div>
                  <ProgressBar now={utilization.adjusters} variant="info" />
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* MACHINE QUEUE */}
          <Col lg={3} md={6}>
            <Card className={darkMode ? 'bg-dark text-white' : ''}>
              <Card.Body>
                <Card.Title>
                  Machines <Badge bg="danger">{machines.length}</Badge>
                </Card.Title>
                {loading ? (
                  <div className="text-center py-3">Loading...</div>
                ) : (
                  <ListGroup variant="flush">
                    {machines.map((machine) => (
                      <ListGroup.Item
                        key={machine.machineId}
                        className={darkMode ? 'bg-dark-gradient text-white min-vh-10 text-white' : ''}
                      >
                        <span className="me-2">⚙️</span>
                        {machine.machineId}
                        <Badge bg="warning" className="ms-2">
                          {machine.status === 'pending'
                            ? 'Pending'
                            : machine.status === 'working'
                            ? 'Working'
                            : 'Broken'}
                        </Badge>
                        <Badge bg="info" className="ms-2">
                          {machine.type || machineType}
                        </Badge>
                      </ListGroup.Item>
                    ))}
                    {machines.length === 0 && (
                      <div className="text-center py-3">No machines in queue</div>
                    )}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* ADJUSTER QUEUE */}
          <Col lg={3} md={6}>
            <Card className={darkMode ? 'bg-dark text-white' : ''}>
              <Card.Body>
                <Card.Title>
                  Adjusters <Badge bg="success">{adjusters.length}</Badge>
                </Card.Title>
                {loading ? (
                  <div className="text-center py-3">Loading...</div>
                ) : (
                  <ListGroup variant="flush">
                    {adjusters.map((adjuster) => (
                      <ListGroup.Item
                        key={adjuster.adjusterId}
                        className={darkMode ? 'bg-dark-gradient text-white min-vh-10  text-white' : ''}
                      >
                        <span className="me-2">👨‍🔧</span>
                        {adjuster.adjusterId}
                        <Badge bg="info" className="ms-2">
                          {adjuster.status === 'available' ? 'Available' : 'Busy'}
                        </Badge>
                        <div className="mt-1">
                          <small>Expertise: {adjuster.expertise.join(', ')}</small>
                        </div>
                      </ListGroup.Item>
                    ))}
                    {adjusters.length === 0 && (
                      <div className="text-center py-3">No adjusters available</div>
                    )}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* PERFORMANCE TRENDS */}
          <Col lg={3} md={6}>
            <Card className={darkMode ? 'bg-dark text-white' : ''}>
              <Card.Body>
                <Card.Title>Performance Trends</Card.Title>
                <div style={{ height: '200px' }}>
                  <Line data={chartData} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* CONFIGURATION FORMS */}
        <Row className="mt-4 g-4">
          {/* MACHINE CONFIG */}
          <Col md={6}>
            <Card className={darkMode ? 'bg-dark text-white' : ''}>
              <Card.Body>
                <Card.Title>Machine Configuration</Card.Title>
                <Form onSubmit={handleAddMachine}>
                  <Form.Group className="mb-3">
                    <Form.Label>Machine Type</Form.Label>
                    <Form.Select
                      value={machineType}
                      onChange={(e) => setMachineType(e.target.value)}
                    >
                      <option>Lathe</option>
                      <option>Drilling</option>
                      <option>Turning</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>MTTF (hours)</Form.Label>
                    <Form.Control
                      type="number"
                      value={machineMttf}
                      onChange={(e) => setMachineMttf(e.target.value)}
                      min="1"
                    />
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Machine'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* ADJUSTER CONFIG */}
          <Col md={6}>
            <Card className={darkMode ? 'bg-dark text-white' : ''}>
              <Card.Body>
                <Card.Title>Adjuster Configuration</Card.Title>
                <Form onSubmit={handleAddAdjuster}>
                  <Form.Group className="mb-3">
                    <Form.Label>Expertise</Form.Label>
                    <Form.Select multiple value={adjusterExpertise} onChange={handleExpertiseChange}>
                      <option>Lathe</option>
                      <option>Drilling</option>
                      <option>Turning</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Hold Ctrl (or Cmd) to select multiple items
                    </Form.Text>
                  </Form.Group>
                  <Button variant="outline-primary" type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Adjuster'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* FOOTER */}
      <footer className={darkMode ? 'bg-dark text-white py-4 mt-5' : 'bg-light text-dark py-4 mt-5'}>
        <Container>
          <div className="text-center">
            <p>© 2025 Thala Factories. All rights reserved.</p>
            <div className="d-flex justify-content-center gap-3">
              <a href="#privacy" className={darkMode ? 'text-white-50' : 'text-muted'}>
                Privacy
              </a>
              <a href="#terms" className={darkMode ? 'text-white-50' : 'text-muted'}>
                Terms
              </a>
              <a href="#contact" className={darkMode ? 'text-white-50' : 'text-muted'}>
                Contact
              </a>
            </div>
          </div>
        </Container>
      </footer>

      {/* Simulation Stats Modal */}
      <Modal show={showSimModal || simStats !== null} onHide={() => setShowSimModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Simulation Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {simStats ? (
            <>
              <h5>Machine Stats:</h5>
              <ListGroup className="mb-3">
                {simStats.machineStats.map((machine) => (
                  <ListGroup.Item key={machine.id}>
                    <strong>Machine {machine.id}</strong> (Type: {machine.type}) – Utilization: {machine.utilization}%, Status: {machine.status}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <h5>Adjuster Stats:</h5>
              <ListGroup>
                {simStats.adjusterStats.map((adjuster) => (
                  <ListGroup.Item key={adjuster.id}>
                    <strong>Adjuster {adjuster.id}</strong> – Utilization: {adjuster.utilization}%, Status: {adjuster.status}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          ) : (
            <p>No simulation data available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSimStats(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
