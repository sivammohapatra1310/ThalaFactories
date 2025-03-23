import React, { useState } from 'react';
import { 
  Container, Nav, Navbar, NavDropdown, Card, Button, 
  Row, Col, ProgressBar, ListGroup, Badge, Form 
} from 'react-bootstrap';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  
  // Mock data
  const [queues] = useState({
    machines: ['M-001', 'M-005', 'M-009'],
    adjusters: ['A-003', 'A-007']
  });

  const [utilization] = useState({
    machines: 78,
    adjusters: 65
  });

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleSimulation = () => setSimulationRunning(!simulationRunning);

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
                  Machine Queue <Badge bg="danger">{queues.machines.length}</Badge>
                </Card.Title>
                <ListGroup variant="flush">
                  {queues.machines.map(machine => (
                    <ListGroup.Item key={machine} className={darkMode ? "bg-dark text-white" : ""}>
                      <span className="me-2">⚙️</span>
                      {machine}
                      <Badge bg="warning" className="ms-2">Pending</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Adjuster Queue */}
          <Col md={4}>
            <Card className={darkMode ? "bg-secondary text-white" : ""}>
              <Card.Body>
                <Card.Title>
                  Available Adjusters <Badge bg="success">{queues.adjusters.length}</Badge>
                </Card.Title>
                <ListGroup variant="flush">
                  {queues.adjusters.map(adjuster => (
                    <ListGroup.Item key={adjuster} className={darkMode ? "bg-dark text-white" : ""}>
                      <span className="me-2">👨🔧</span>
                      {adjuster}
                      <Badge bg="info" className="ms-2">Available</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
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
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Machine Type</Form.Label>
                    <Form.Select>
                      <option>Lathe</option>
                      <option>Drilling</option>
                      <option>Turning</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>MTTF (hours)</Form.Label>
                    <Form.Control type="number" defaultValue={100} />
                  </Form.Group>
                  <Button variant="outline-primary">Add Machines</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className={darkMode ? "bg-secondary text-white" : ""}>
              <Card.Body>
                <Card.Title>Adjuster Configuration</Card.Title>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Expertise</Form.Label>
                    <Form.Select multiple>
                      <option>Lathe</option>
                      <option>Drilling</option>
                      <option>Turning</option>
                    </Form.Select>
                  </Form.Group>
                  <Button variant="outline-primary">Add Adjuster</Button>
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