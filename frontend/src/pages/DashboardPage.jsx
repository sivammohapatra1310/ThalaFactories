import React, { useState, useEffect } from 'react';
import { 
  Container, Nav, Navbar, NavDropdown, Card, Button, 
  Row, Col, ProgressBar, ListGroup, Badge, Form, Alert
} from 'react-bootstrap';
import { fetchMachines, fetchAdjusters, addMachine, addAdjuster } from '../services/api';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  
  // State for form inputs
  const [machineType, setMachineType] = useState('Lathe');
  const [machineMttf, setMachineMttf] = useState(100);
  const [adjusterExpertise, setAdjusterExpertise] = useState(['Lathe']);
  
  // State for machines and adjusters
  const [machines, setMachines] = useState([]);
  const [adjusters, setAdjusters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Utilization data
  const [utilization] = useState({
    machines: 78,
    adjusters: 65
  });

  // Toggle functions
  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleSimulation = () => setSimulationRunning(!simulationRunning);

  // Load machines and adjusters on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [machinesData, adjustersData] = await Promise.all([
          fetchMachines(),
          fetchAdjusters()
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

  // Handle adding a new machine
  const handleAddMachine = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const newMachine = await addMachine({
        type: machineType,
        mttf: parseInt(machineMttf)
      });
      
      // Make sure the new machine object includes the type
      const machineWithType = {
        ...newMachine,
        type: machineType // Ensure type is included in case API doesn't return it
      };
      
      setMachines([machineWithType, ...machines]);
      setError(null);
    } catch (err) {
      console.error('Failed to add machine:', err);
      setError('Failed to add machine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new adjuster
  const handleAddAdjuster = async (e) => {
    e.preventDefault();
    
    if (!adjusterExpertise.length) {
      setError('Please select at least one expertise');
      return;
    }
    
    try {
      setLoading(true);
      const newAdjuster = await addAdjuster({
        expertise: adjusterExpertise
      });
      
      setAdjusters([newAdjuster, ...adjusters]);
      setError(null);
    } catch (err) {
      console.error('Failed to add adjuster:', err);
      setError('Failed to add adjuster. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle expertise selection change
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

  return (
    <div className={darkMode ? "bg-dark text-white min-vh-100" : "bg-light text-dark min-vh-100"}>
      {/* Navigation Bar */}
      <Navbar expand="lg" className={darkMode ? "bg-dark navbar-dark" : "bg-light navbar-light"}>
        <Container>
          <Navbar.Brand href="#home">TFSS 0.0</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#dashboard">Dashboard</Nav.Link>
              <NavDropdown title="Management" id="management-dropdown">
                <NavDropdown.Item href="#machines">Machines</NavDropdown.Item>
                <NavDropdown.Item href="#adjusters">Adjusters</NavDropdown.Item>
                <NavDropdown.Item href="#queues">Queues</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#reports">Reports</Nav.Link>
              <Nav.Link href="#analytics">Analytics</Nav.Link>
            </Nav>
            <Nav>
              <Form.Check
                type="switch"
                id="theme-switch"
                label="Dark Mode"
                className="ms-3 text-nowrap"
                checked={darkMode}
                onChange={toggleTheme}
              />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Simulation Controls */}
      <div className={`py-3 ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
        <Container>
          <div className="d-flex gap-2">
            <Button variant={simulationRunning ? 'danger' : 'success'} onClick={toggleSimulation}>
              {simulationRunning ? 'Stop Simulation' : 'Start Simulation'}
            </Button>
            <Button variant="outline-secondary">Reset Simulation</Button>
          </div>
        </Container>
      </div>

      {/* Error Message */}
      {error && (
        <Container className="mt-3">
          <Alert variant="danger">{error}</Alert>
        </Container>
      )}

      {/* Main Content */}
      <Container className="my-4">
        <Row className="g-4">
          {/* Utilization Metrics */}
          <Col md={4}>
            <Card className={darkMode ? "bg-secondary text-white" : ""}>
              <Card.Body>
                <Card.Title>Utilization Metrics</Card.Title>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>Machines</span>
                    <span>{utilization.machines}%</span>
                  </div>
                  <ProgressBar now={utilization.machines} variant="success" className="mb-3" />
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

          {/* Machine Queue */}
          <Col md={4}>
            <Card className={darkMode ? "bg-secondary text-white" : ""}>
              <Card.Body>
                <Card.Title>
                  Machine Queue <Badge bg="danger">{machines.length}</Badge>
                </Card.Title>
                {loading ? (
                  <div className="text-center py-3">Loading...</div>
                ) : (
                  <ListGroup variant="flush">
                    {machines.map(machine => (
                      <ListGroup.Item key={machine.machineId} className={darkMode ? "bg-dark text-white" : ""}>
                        <span className="me-2">⚙️</span>
                        {machine.machineId}
                        <Badge bg="warning" className="ms-2">
                          {machine.status === 'pending' ? 'Pending' : 
                           machine.status === 'working' ? 'Working' : 'Broken'}
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

          {/* Adjuster Queue */}
          <Col md={4}>
            <Card className={darkMode ? "bg-secondary text-white" : ""}>
              <Card.Body>
                <Card.Title>
                  Available Adjusters <Badge bg="success">{adjusters.length}</Badge>
                </Card.Title>
                {loading ? (
                  <div className="text-center py-3">Loading...</div>
                ) : (
                  <ListGroup variant="flush">
                    {adjusters.map(adjuster => (
                      <ListGroup.Item key={adjuster.adjusterId} className={darkMode ? "bg-dark text-white" : ""}>
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
        </Row>

        {/* Configuration Panels */}
        <Row className="mt-4 g-4">
          <Col md={6}>
            <Card className={darkMode ? "bg-secondary text-white" : ""}>
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
                  <Button 
                    variant="outline-primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Machine'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className={darkMode ? "bg-secondary text-white" : ""}>
              <Card.Body>
                <Card.Title>Adjuster Configuration</Card.Title>
                <Form onSubmit={handleAddAdjuster}>
                  <Form.Group className="mb-3">
                    <Form.Label>Expertise</Form.Label>
                    <Form.Select 
                      multiple
                      value={adjusterExpertise}
                      onChange={handleExpertiseChange}
                    >
                      <option>Lathe</option>
                      <option>Drilling</option>
                      <option>Turning</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Hold Ctrl (or Cmd) to select multiple items
                    </Form.Text>
                  </Form.Group>
                  <Button 
                    variant="outline-primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Adjuster'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Performance Chart */}
        <Row className="mt-4">
          <Col>
            <Card className={darkMode ? "bg-secondary text-white" : ""}>
              <Card.Body>
                <Card.Title>Performance Trends</Card.Title>
                <div className="p-3 bg-dark text-white rounded">
                  <div className="text-center py-4">
                    [Performance Chart Placeholder]
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className={darkMode ? "bg-dark text-white py-4 mt-5" : "bg-light text-dark py-4 mt-5"}>
        <Container>
          <div className="text-center">
            <p>© 2024 Thala Factories. All rights reserved.</p>
            <div className="d-flex justify-content-center gap-3">
              <a href="#privacy" className="text-muted">Privacy</a>
              <a href="#terms" className="text-muted">Terms</a>
              <a href="#contact" className="text-muted">Contact</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}