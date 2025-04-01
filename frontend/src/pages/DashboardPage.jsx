import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Offcanvas,
  Container,
  Nav,
  Card,
  Button,
  Row,
  Col,
  ProgressBar,
  ListGroup,
  Badge,
  Form,
  Alert
} from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FaTools, FaCog, FaChartBar, FaClipboardList, FaSun, FaMoon } from 'react-icons/fa';
import logo from '../assets/images/logo.png'; // Update path to your logo
import {
  fetchMachines,
  fetchAdjusters,
  addMachine,
  addAdjuster
} from '../services/api';
const styles = `
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

// Register Chart.js components
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

  // Utilization data (static example)
  const [utilization] = useState({
    machines: 78,
    adjusters: 65,
  });

  // Toggle theme
  const toggleTheme = () => setDarkMode(!darkMode);
  // Toggle simulation
  const toggleSimulation = () => setSimulationRunning(!simulationRunning);
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

  // Add Machine
  const handleAddMachine = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newMachine = await addMachine({
        type: machineType,
        mttf: parseInt(machineMttf),
      });
      const machineWithType = { ...newMachine, type: machineType };
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

  return (
    <div className={darkMode ? 'bg-dark text-white min-vh-100' : 'bg-light text-dark min-vh-100'}>
      {/* TOP NAVBAR */}
      <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} className="px-3">
        <Button variant={darkMode ? 'outline-light' : 'outline-dark'} onClick={handleSidebarShow}>
          <FaCog />
        </Button>
        <Navbar.Brand className="ms-3 d-flex align-items-center" href="#home">
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
            className="text-nowrap"
            checked={darkMode}
            onChange={toggleTheme}
          />
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
            <Nav.Link href="#machines" className={darkMode ? 'text-white' : 'text-dark'}>
              <FaTools className="me-2" />
              Machines
            </Nav.Link>
            <Nav.Link href="#adjusters" className={darkMode ? 'text-white' : 'text-dark'}>
              <FaClipboardList className="me-2" />
              Adjusters
            </Nav.Link>
            <Nav.Link href="#reports" className={darkMode ? 'text-white' : 'text-dark'}>
              Reports
            </Nav.Link>
            <Nav.Link href="#analytics" className={darkMode ? 'text-white' : 'text-dark'}>
              Analytics
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* SIMULATION CONTROLS */}
      <Container className="mt-3">
        <div className="d-flex gap-3">
          <Button variant={simulationRunning ? 'danger' : 'success'} onClick={toggleSimulation}>
            {simulationRunning ? 'Stop Simulation' : 'Start Simulation'}
          </Button>
          <Button variant={darkMode ? 'outline-light' : 'outline-secondary'}>Reset Simulation</Button>
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
            <Card className={darkMode ? 'bg-secondary text-white' : ''}>
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
            <Card className={darkMode ? 'bg-secondary text-white' : ''}>
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
                        className={darkMode ? 'bg-dark text-white' : ''}
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
            <Card className={darkMode ? 'bg-secondary text-white' : ''}>
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
                        className={darkMode ? 'bg-dark text-white' : ''}
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
            <Card className={darkMode ? 'bg-secondary text-white' : ''}>
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
            <Card className={darkMode ? 'bg-secondary text-white' : ''}>
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
            <Card className={darkMode ? 'bg-secondary text-white' : ''}>
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
            <p>© 2024 Thala Factories. All rights reserved.</p>
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
    </div>
  );
}
