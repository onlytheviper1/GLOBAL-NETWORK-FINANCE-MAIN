import { useState, useEffect } from 'react'
import './Dashboard.css'

function Dashboard() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cms/content')
      if (!response.ok) throw new Error('Failed to fetch content')
      const data = await response.json()
      setContent(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="dashboard"><p>Loading...</p></div>
  if (error) return <div className="dashboard"><p className="error">Error: {error}</p></div>

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="content-section">
        <h3>Managed Content</h3>
        {content.length === 0 ? (
          <p>No content yet. Use the CMS backend to add content.</p>
        ) : (
          <div className="content-list">
            {content.map((item) => (
              <div key={item._id} className="content-item">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
