import './index.scss'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function NotFound() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)
  const [animate, setAnimate] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    //Navigate to home when countdown reaches 0
    if (countdown === 0) {
      navigate("/")
    }

    // Start rocket animation at 5 seconds
    if (countdown === 5) {
      setAnimate(true)
    }

    return () => clearInterval(timer)
  }, [countdown, navigate])

  return (
    <div className="not-found-wrapper">
      <div className="grid-container">
        <div className="text-content">
          <h1 className="title">Oops! You ran out of oxygen.</h1>
          <p className="subtext">
            The page you're looking for is now beyond our reach.<br />
            Let's get you...
          </p>
          <div className="countdown">
            <span className="back-home">Back Home in</span> 00:00:{countdown < 10 ? `0${countdown}` : countdown}
          </div>
          <a href="/" className="home-link">HOME PAGE</a>
        </div>
        <div className={`error-code ${animate ? 'rocket-launch' : ''}`}>
          4
          <div
            className="astronaut-icon-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Astronaut icon */}
            <img
              src="/img/astronaut-icon.png"
              alt="Astronaut"
              className={`astronaut-icon ${animate ? 'animate-rocket' : ''}`}
            />
            {/* Show snda-avatar image on hover */}
            {isHovered && (
              <img
                src="/img/snda-avatar.png"
                alt="Astronaut Face"
                className={`astronaut-face ${animate ? 'animate-astronaut' : ''}`}
              />
            )}
          </div>
          4
        </div>
      </div>
    </div>
  )
}

export default NotFound
