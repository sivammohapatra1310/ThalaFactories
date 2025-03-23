import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Card, Button, Row, Col } from 'react-bootstrap';

export default function DashboardPage() {
  return (
    <div className="dashboard">
      {/* Navigation Bar */}
      <Navbar expand="lg" className="bg-dark" variant="dark">
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
              <Nav.Link href="#signin">Sign In</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section bg-dark text-white py-5">
        <Container>
          <h1>Better Decisions. Optimized Operations.</h1>
          <p className="lead">
            TFSS is a factory simulation system that helps optimize machine utilization
            and adjuster allocation for maximum efficiency.
          </p>
          <Button variant="primary">Start Simulation</Button>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="my-5">
        <Row className="mb-4">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Machine Management</Card.Title>
                <Card.Text>
                  Register and manage machines, track failures, and monitor performance.
                </Card.Text>
                <Button variant="outline-primary">Manage Machines</Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Adjuster Queue</Card.Title>
                <Card.Text>
                  View available adjusters and assign repair tasks efficiently.
                </Card.Text>
                <Button variant="outline-primary">View Adjusters</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Real-time Statistics</Card.Title>
                <Card.Text>
                  Access live performance metrics and generate detailed reports.
                </Card.Text>
                <Button variant="outline-primary">View Statistics</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Case Studies Section */}
        <Row className="mt-5">
          <Col>
            <h2 className="mb-4">Operational Insights</h2>
            <Card>
              <Card.Body>
                <Card.Title>Performance Overview</Card.Title>
                <Card.Text>
                  <ul>
                    <li>Current Machine Utilization: 85%</li>
                    <li>Active Adjusters: 12/15</li>
                    <li>Average Repair Time: 2.3h</li>
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-light py-4 mt-5">
        <Container>
          <div className="text-center text-muted">
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