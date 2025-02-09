// react-bootstrap
import { Row, Col, Card } from 'react-bootstrap';

// third party
import Chart from 'react-apexcharts';

// project imports
import FlatCard from '../../../components/Widgets/Statistic/FlatCard';
import ProductCard from '../../../components/Widgets/Statistic/ProductCard';
import FeedTable from '../../../components/Widgets/FeedTable';
import ProductTable from '../../../components/Widgets/ProductTable';
import { SalesAccountChartData } from './chart/sales-account-chart';
import { SalesSupportChartData } from './chart/sales-support-chart';
import { SalesSupportChartData1 } from './chart/sales-support-chart1';
import feedData from '../../../data/feedData';
import productData from '../../../data/productTableData';

// Hardcoded dispute data
const disputeData = [
  { country: 'Africa', disputes: 120 },
  { country: 'Nigeria', disputes: 100 },
  { country: 'India', disputes: 90 },
  { country: 'India', disputes: 85 },
  { country: 'Canada', disputes: 80 },
  { country: 'Hong Kong', disputes: 75 },
  { country: 'Brazil', disputes: 70 },
  { country: 'France', disputes: 65 },
  { country: 'Japan', disputes: 60 },
  { country: 'South Korea', disputes: 55 },
];

// Function to generate chart data
const SalesCustomerSatisfactionChartData = () => {
  return {
    series: [
      {
        name: 'Disputes Raised',
        data: disputeData.map((item) => item.disputes),
      },
    ],
    options: {
      chart: {
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      xaxis: {
        categories: disputeData.map((item) => item.country),
      },
      fill: {
        colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#FF9433', '#33FFF0', '#FF5733', '#33B5FF', '#FF5733'],
      },
      title: {
        text: 'Top 10 Countries with Highest Disputes Raised',
        align: 'center',
      },
    },
  };
};

// -----------------------|| DASHBOARD SALES ||-----------------------//
export default function DashSales() {
  const styles = {
    dashboardContainer: {
      height: "flex",
      display: "flex",
    },
    sidebar: {
      width: "250px",
      backgroundColor: "#2e3b55",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
    },
    sidebarHeader: {
      padding: "20px",
      textAlign: "center",
      fontSize: "1.5rem",
      fontWeight: "bold",
      borderBottom: "1px solid #394867",
    },
    sidebarMenu: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      flexGrow: 1,
    },
    menuItem: {
      padding: "15px 20px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      color: "#b0bec5",
      fontSize: "1rem",
      transition: "background 0.3s, color 0.3s",
    },
    menuItemActive: {
      backgroundColor: "#394867",
      color: "#fff",
      borderLeft: "5px solid #1abc9c",
    },
    menuItemHover: {
      backgroundColor: "#394867",
      color: "#fff",
    },
    mainContent: {
      backgroundColor: "#f7f9fc",
      flexGrow: 1,
      padding: "20px",
      overflowY: "auto",
    },
    
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h4>Dispute Resolution</h4>
        </div>
        <ul style={styles.sidebarMenu}>
          <li style={{ ...styles.menuItem, ...styles.menuItemActive }}>
            <i className="bi bi-house-door"></i> Dashboard
          </li>
          <li style={styles.menuItem}>
            <i className="bi bi-text-paragraph"></i> Setting
          </li>
          <li style={styles.menuItem}>
            <i className="bi bi-palette"></i> Logout
          </li>
        </ul>
      </div>

      <Row>
        {/* Full-width Flat Card */}
        <Col md={12}>
          <Card className="flat-card w-100">
            <div className="row-table">
              <Card.Body className="col-sm-6 br">
                <FlatCard params={{ title: 'Total Dispute', iconClass: 'text-primary mb-1',value: '1000' }} />
              </Card.Body>
              <Card.Body className="col-sm-6 d-none d-md-table-cell d-lg-table-cell d-xl-table-cell card-body br">
                <FlatCard params={{ title: 'Active Dispute', iconClass: 'text-primary mb-1', value: '30' }} />
              </Card.Body>
              <Card.Body className="col-sm-6 card-bod">
                <FlatCard params={{ title: 'Closed Disputed', iconClass: 'text-primary mb-1', value: '970' }} />
              </Card.Body>
            </div>
            <div className="row-table">
              <Card.Body className="col-sm-6 br">
                <FlatCard
                  params={{
                    title: 'Average Dispute Resolutioin Time',
                    iconClass: 'text-primary mb-1',
                    value: '30 minutes',
                  }}
                />
              </Card.Body>
              <Card.Body className="col-sm-6 d-none d-md-table-cell d-lg-table-cell d-xl-table-cell card-body br">
                <FlatCard params={{ title: 'No of Dispute Escalated To Admin', iconClass: 'text-primary mb-1',value: '10' }} />
              </Card.Body>
              <Card.Body className="col-sm-6 card-bod">
                <FlatCard params={{ title: 'No of AI Resoluved Cases', iconClass: 'text-primary mb-1', value: '918' }} />
              </Card.Body>
            </div>
          </Card>
        </Col>

        {/* Row for the next two cards */}
        <Col md={6} className="mt-3">
          {/* Top 10 Countries with Highest Disputes Raised */}
          <Card>
            <Card.Body>
              <h4><b>Top 10 Countries with Highest Disputes Raised</b></h4>
              <span>These are the countries with the highest number of disputes raised.</span>
              <div className="mb-5"></div>
              <Row className="d-flex justify-content-center align-items-center">
                <Col>
                  <Chart type="bar" {...SalesCustomerSatisfactionChartData()} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mt-3">
          {/* Monthly Dispute Raised */}
          <Card>
            <Card.Header>
              <h5>Monthly Dispute Raised</h5>
            </Card.Header>
            <Card.Body>
              <Row className="pb-2">
                <div className="col-auto m-b-10">
                  <h3 className="mb-1">$21,356.46</h3>
                  <span>Total Amount Invovled In Dispute</span>
                </div>
                <div className="col-auto m-b-10">
                  <h3 className="mb-1">$1935.6</h3>
                  <span>Average</span>
                </div>
              </Row>
              <Chart {...SalesAccountChartData()} />
            </Card.Body>
          </Card>
        </Col>

        {/* Optional: Additional content like Product Table and Feed Table */}
        <Col md={12} xl={6}>
          <ProductTable {...productData} />
        </Col>

      </Row>
    </div>
  );
}
