import React, { useState, useEffect, useRef } from 'react';
import './Portfolio.css';

const Portfolio = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const heroRef = useRef(null);

  // Mouse tracking for gradient effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which sections are visible
      const sections = document.querySelectorAll('section:not(.hero)');
      const newVisibleSections = new Set();
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          newVisibleSections.add(index);
        }
      });
      
      setVisibleSections(newVisibleSections);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animated number component
  const AnimatedNumber = ({ value, delay = 0 }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const hasPlus = value.includes('+');
    const numericValue = parseInt(value.replace('+', ''));

    useEffect(() => {
      const timer = setTimeout(() => {
        let current = 0;
        const increment = numericValue / 30;
        const interval = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            setDisplayValue(numericValue);
            clearInterval(interval);
          } else {
            setDisplayValue(Math.floor(current));
          }
        }, 50);
        
        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timer);
    }, [numericValue, delay]);

    return <span>{displayValue}{hasPlus ? '+' : ''}</span>;
  };

  // Floating icons component
  const FloatingIcons = () => {
    const icons = [
      { icon: 'fab fa-java', color: '#f89820' },
      { icon: 'fab fa-react', color: '#61dafb' },
      { icon: 'fas fa-leaf', color: '#6db33f' },
      { icon: 'fab fa-python', color: '#3776ab' },
      { icon: 'fab fa-aws', color: '#ff9900' },
      { icon: 'fas fa-dharmachakra', color: '#326ce5' },
      { icon: 'fas fa-database', color: '#dc382d' },
      { icon: 'fab fa-node-js', color: '#47a248' },
      { icon: 'fab fa-docker', color: '#2496ed' },
      { icon: 'fab fa-js-square', color: '#7c3aed' }
    ];

    return (
      <div className="floating-icons">
        {icons.map((iconData, index) => (
          <div
            key={index}
            className="floating-icon"
            style={{
              color: iconData.color,
              animationDelay: `${index * 0.5}s`,
              transform: `translateY(${-(scrollY * (0.2 + index * 0.05))}px) rotate(${scrollY * 0.1}deg)`
            }}
          >
            <i className={iconData.icon}></i>
          </div>
        ))}
      </div>
    );
  };

  // Skill item component
  const SkillItem = ({ icon, name, color }) => {
    const handleClick = () => {
      // Create burst effect
      const rect = event.target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        const angle = (i / 8) * Math.PI * 2;
        const velocity = 100;

        particle.style.cssText = `
          position: fixed;
          width: 6px;
          height: 6px;
          background: ${color};
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          left: ${centerX}px;
          top: ${centerY}px;
          animation: burst 0.8s ease-out forwards;
        `;

        const keyframes = `
          @keyframes burst {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0); opacity: 0; }
          }
        `;

        const style = document.createElement('style');
        style.textContent = keyframes;
        document.head.appendChild(style);

        document.body.appendChild(particle);

        setTimeout(() => {
          particle.remove();
          style.remove();
        }, 800);
      }
    };

    return (
      <div className="skill-item" onClick={handleClick}>
        <div className="skill-icon" style={{ color }}>
          <i className={icon}></i>
        </div>
        <div className="skill-name">{name}</div>
      </div>
    );
  };

  const heroStyle = {
    background: `
      radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
      linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)
    `
  };

  return (
    <div className="portfolio">
      {/* Header */}
      <header className={scrollY > window.innerHeight * 0.3 ? 'visible' : ''}>
        <nav>
          <div className="logo">SK</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Floating Icons */}
      <FloatingIcons />

      {/* Particles */}
      <div className="particles" id="particles"></div>

      {/* Hero Section */}
      <section id="home" className="hero" ref={heroRef} style={heroStyle}>
        <div className="hero-content">
          <div className="hero-text">
            <h1>Sushma Kankatala</h1>
            <h2>Senior Full Stack Developer</h2>
            <div className="hero-description">
              Passionate technologist with 8+ years of expertise in crafting innovative solutions across Banking, Finance, Healthcare, and Retail domains. Specialized in building scalable microservices and modern web applications.
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">
                  <AnimatedNumber value="8+" delay={1000} />
                </span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  <AnimatedNumber value="50+" delay={1200} />
                </span>
                <span className="stat-label">Projects Delivered</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  <AnimatedNumber value="4" delay={1400} />
                </span>
                <span className="stat-label">Major Domains</span>
              </div>
            </div>

            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <span>sushma.kankatala444@gmail.com</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>+1 (571)-604-9124</span>
              </div>
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Ashburn, Virginia</span>
              </div>
            </div>

            <div className="btn-group">
              <a href="#about" className="btn btn-primary">Explore My Work</a>
              <a href="#contact" className="btn btn-secondary">Get In Touch</a>
            </div>
          </div>
          <div className="photo-placeholder">
            <span>Your Photo Here</span>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <i className="fas fa-chevron-down"></i>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Professional Summary */}
      <section id="about" className={visibleSections.has(0) ? 'visible' : ''}>
        <div className="container">
          <h2 className="section-title">Professional Summary</h2>
          <div className="summary-content">
            <p>Experienced Full Stack Developer with 8+ years in the Software Development Life Cycle, specializing in enterprise solutions for Banking, Finance, Healthcare, and Retail sectors.</p>
            <p>Expert in developing high-performance applications using Java 8/11/17, Spring Boot microservices, and modern frontend technologies like React.js and TypeScript.</p>
            <p>Proven track record in cloud-native development with AWS, Azure, and GCP, implementing DevOps practices, and ensuring security compliance (PCI-DSS, HIPAA, SOX, GDPR).</p>
          </div>
        </div>
      </section>

      {/* Technical Skills */}
      <section id="skills" className={visibleSections.has(1) ? 'visible' : ''}>
        <div className="container">
          <h2 className="section-title">Technical Skills</h2>
          <div className="skills-grid">
            <SkillItem icon="fab fa-java" name="Java" color="#f89820" />
            <SkillItem icon="fas fa-leaf" name="Spring Boot" color="#6db33f" />
            <SkillItem icon="fab fa-react" name="React.js" color="#61dafb" />
            <SkillItem icon="fab fa-js-square" name="TypeScript" color="#3178c6" />
            <SkillItem icon="fab fa-js" name="JavaScript" color="#f7df1e" />
            <SkillItem icon="fab fa-python" name="Python" color="#3776ab" />
            <SkillItem icon="fab fa-aws" name="AWS" color="#ff9900" />
            <SkillItem icon="fab fa-microsoft" name="Azure" color="#0078d4" />
            <SkillItem icon="fas fa-dharmachakra" name="Kubernetes" color="#326ce5" />
            <SkillItem icon="fab fa-docker" name="Docker" color="#2496ed" />
            <SkillItem icon="fas fa-stream" name="Apache Kafka" color="#231f20" />
            <SkillItem icon="fas fa-database" name="PostgreSQL" color="#336791" />
            <SkillItem icon="fas fa-database" name="Redis" color="#dc382d" />
            <SkillItem icon="fab fa-node-js" name="Node.js" color="#47a248" />
            <SkillItem icon="fab fa-github" name="GitHub" color="#000000" />
            <SkillItem icon="fab fa-html5" name="HTML5" color="#e34c26" />
          </div>
        </div>
      </section>

      {/* Rest of the sections would be similar to the HTML version */}
      {/* Experience, Education, Contact sections */}
      
    </div>
  );
};

export default Portfolio;
