import './Home.css'

function Home() {
  return (
    <div className="home">
      <header className="hero">
        <div className="hero-content">
          <h2>Welcome to Global Network Finance</h2>
          <p>Your trusted digital financial platform for global transactions</p>
          <button className="cta-button">Get Started</button>
        </div>
      </header>
      
      <section className="features">
        <h3>Platform Features</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>Secure Transactions</h4>
            <p>Enterprise-grade encryption for all transactions</p>
          </div>
          <div className="feature-card">
            <h4>Real-time Analytics</h4>
            <p>Monitor your finances with live data and insights</p>
          </div>
          <div className="feature-card">
            <h4>Global Access</h4>
            <p>Trade and manage assets across multiple markets</p>
          </div>
          <div className="feature-card">
            <h4>24/7 Support</h4>
            <p>Round-the-clock customer support and assistance</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
