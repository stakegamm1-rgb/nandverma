import React, { useState, useEffect, useRef } from 'react';
import meImage from './assets/me.jpeg';
import foodScreen1 from './assets/food_screen_1.png';
import foodScreen2 from './assets/food_screen_2.png';
import foodScreen3 from './assets/food_screen_3.png';
import foodDeliveryPresentation from './assets/food_delivery_presentation.png';
import chatScreen1 from './assets/chat_screen_1.png';
import chatScreen2 from './assets/chat_screen_2.png';
import chatScreen3 from './assets/chat_screen_3.png';
import mapFlatLight from './assets/map_flat_light.png';
import mapImage from './assets/map.png';
import map1Image from './assets/map1.png';
import map2Image from './assets/map2.png';

// --- CountUpStat Component for Stats Animation ---
const CountUpStat = ({ end, suffix = "", prefix = "", decimals = 0, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            setCount(easeProgress * end);
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <h3 ref={elementRef}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </h3>
  );
};

export default function App() {
  // --- State Variables ---
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [simApp, setSimApp] = useState('food');
  const [activeSection, setActiveSection] = useState('home');

  // Simulator: Chat State
  const [chatMessages, setChatMessages] = useState([
    { type: 'received', text: 'Hi Nand, we need a chat feature with offline sync for our app.', time: '9:42 AM' },
    { type: 'sent', text: 'Sure! I can build that using Socket.io and Redux-Saga for state sync.', time: '9:43 AM' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Simulator: Tracking State
  const [trackingStatus, setTrackingStatus] = useState("Order Picked Up - Heading your way!");
  const [courierPos, setCourierPos] = useState({ top: '75%', left: '15%' });

  // Refs for Scroll Observers
  const sectionsRef = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    simulator: useRef(null),
    projects: useRef(null),
    contact: useRef(null),
  };

  // WhatsApp Link Helper
  const getWhatsAppLink = (message = "Hi Nand, I saw your portfolio and would like to connect!") => {
    return `https://wa.me/919306272346?text=${encodeURIComponent(message)}`;
  };

  // Project Card Click Handler
  const handleCardClick = (link) => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  // --- Scroll Effect & Sticky Nav ---
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Section Intersection Observer (Active Nav & Scroll Reveals) ---
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25, rootMargin: '-10% 0px -40% 0px' }
    );

    Object.values(sectionsRef).forEach((ref) => {
      if (ref.current) sectionObserver.observe(ref.current);
    });

    // Scroll Reveal Observer
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => revealObserver.observe(el));

    return () => {
      Object.values(sectionsRef).forEach((ref) => {
        if (ref.current) sectionObserver.unobserve(ref.current);
      });
      revealElements.forEach((el) => revealObserver.unobserve(el));
    };
  }, []);

  // --- Typing Text Animation ---
  useEffect(() => {
    const roles = [
      "React Native Applications.",
      "iOS & Android Development.",
      "Smooth Mobile UIs.",
      "Scalable Mobile Architectures.",
      "High-Performance Apps."
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let speed = 100;
    let timer;

    const handleType = () => {
      const currentRole = roles[wordIdx];
      if (deleting) {
        setTypingText(currentRole.substring(0, charIdx - 1));
        charIdx--;
        speed = 50;
      } else {
        setTypingText(currentRole.substring(0, charIdx + 1));
        charIdx++;
        speed = 100;
      }

      if (!deleting && charIdx === currentRole.length) {
        speed = 2000;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % roles.length;
        speed = 500;
      }

      timer = setTimeout(handleType, speed);
    };

    timer = setTimeout(handleType, 1000);
    return () => clearTimeout(timer);
  }, []);

  // --- Simulator: Chat App Loop ---
  useEffect(() => {
    if (simApp !== 'chat') return;

    setChatMessages([
      { type: 'received', text: 'Hi Nand, we need a chat feature with offline sync for our app.', time: '9:42 AM' },
      { type: 'sent', text: 'Sure! I can build that using Socket.io and Redux-Saga for state sync.', time: '9:43 AM' }
    ]);
    setIsTyping(false);

    const extraMessages = [
      { type: 'received', text: 'Awesome! How long will it take?', time: '9:44 AM' },
      { type: 'sent', text: 'I can get a solid prototype up within 3 days.', time: '9:44 AM' },
      { type: 'received', text: 'Perfect, let\'s start!', time: '9:45 AM' }
    ];

    let currentMsgIdx = 0;
    let chatTimer;

    const sendNext = () => {
      if (currentMsgIdx >= extraMessages.length) {
        chatTimer = setTimeout(() => {
          setChatMessages([
            { type: 'received', text: 'Hi Nand, we need a chat feature with offline sync for our app.', time: '9:42 AM' },
            { type: 'sent', text: 'Sure! I can build that using Socket.io and Redux-Saga for state sync.', time: '9:43 AM' }
          ]);
          currentMsgIdx = 0;
          sendNext();
        }, 5000);
        return;
      }

      const nextMsg = extraMessages[currentMsgIdx];

      if (nextMsg.type === 'sent') {
        setIsTyping(true);
        chatTimer = setTimeout(() => {
          setIsTyping(false);
          setChatMessages(prev => [...prev, nextMsg]);
          currentMsgIdx++;
          chatTimer = setTimeout(sendNext, 2000);
        }, 1500);
      } else {
        setChatMessages(prev => [...prev, nextMsg]);
        currentMsgIdx++;
        chatTimer = setTimeout(sendNext, 2500);
      }
    };

    chatTimer = setTimeout(sendNext, 2000);
    return () => clearTimeout(chatTimer);
  }, [simApp]);

  // --- Simulator: Map Tracking Loop ---
  useEffect(() => {
    if (simApp !== 'tracking') return;

    const route = [
      { top: '75%', left: '15%', status: 'Order Picked Up - Heading your way!' },
      { top: '75%', left: '55%', status: 'Approving Sector 4 main street...' },
      { top: '40%', left: '55%', status: 'Arriving in 1 minute...' },
      { top: '40%', left: '85%', status: 'Driver is outside your gate!' },
      { top: '15%', left: '85%', status: 'Delivered! Enjoy your meal 🍔' }
    ];

    let step = 0;
    setCourierPos({ top: route[0].top, left: route[0].left });
    setTrackingStatus(route[0].status);

    const trackingInterval = setInterval(() => {
      step = (step + 1) % route.length;
      setCourierPos({ top: route[step].top, left: route[step].left });
      setTrackingStatus(route[step].status);
    }, 2000);

    return () => clearInterval(trackingInterval);
  }, [simApp]);

  // --- Projects Data (Dhurina Removed, Gradient Colors Configured) ---
  const projects = [
    {
      id: 1,
      title: "Food Delivery App",
      category: "system",
      emoji: "🍕",
      desc: "Featuring live order tracking, multiple payment gateways, restaurant management, cart & coupon system, and multi-language support.",
      tech: ["React Native", "Redux Saga", "Google Maps SDK", "Firebase Auth & Firestore"],
      link: "https://wa.me/919306272346?text=Hi%20Nand%2C%20I%20am%20interested%20in%20your%20Food%20Delivery%20App%20project!",
      color1: "#7f1d1d",
      color2: "#f97316"
    },
    {
      id: 2,
      title: "Grocery Delivery App",
      category: "system",
      emoji: "🥦",
      desc: "Built with category management, address selection with maps, real-time stock counts, and dynamic cart handling.",
      tech: ["React Native", "Redux Saga", "Google Maps SDK", "Geocoding API"],
      link: "https://wa.me/919306272346?text=Hi%20Nand%2C%20I%20am%20interested%20in%20your%20Grocery%20Delivery%20App%20project!",
      color1: "#064e3b",
      color2: "#10b981"
    },
    {
      id: 3,
      title: "Das Collection",
      category: "store",
      emoji: "🛍️",
      desc: "An elegant e-commerce application displaying catalogs, filters, simple checkouts, and custom animations.",
      tech: ["React Native", "RESTful API Integration", "Stripe Payment Gateway", "TypeScript"],
      link: "https://play.google.com/store/apps/details?id=com.dascollection",
      icon: "https://play-lh.googleusercontent.com/a2Gx7Lbu8BXFTI3RTF2o7Rk7DSUvXI5lzqYeSG2wVTqEul1ZGsHIpUawiiQsrt5AwNStM3w-RotiTk-4Mx3TcQ",
      color1: "#3b0764",
      color2: "#a855f7"
    },
    {
      id: 4,
      title: "Real-Time Chat App",
      category: "system",
      emoji: "💬",
      desc: "An instant messaging program supporting media uploads, offline synchronization, active states, and typing indicators.",
      tech: ["React Native", "Real-time WebSockets (Socket.io)", "Firebase Realtime DB"],
      link: "https://wa.me/919306272346?text=Hi%20Nand%2C%20I%20want%20to%20discuss%20integrating%20a%20Real-Time%20Chat%20feature!",
      color1: "#1e3a8a",
      color2: "#3b82f6"
    },
    {
      id: 5,
      title: "Carbon Credit Platform",
      category: "system",
      emoji: "🌱",
      desc: "Innovative application that tracks environmental metrics, allowing green tokens calculation and transaction logging.",
      tech: ["React Native", "Redux Saga", "RESTful API Integration", "High-Throughput Services"],
      link: "https://wa.me/919306272346?text=Hi%20Nand%2C%20I%20am%20interested%20in%20your%20Carbon%20Credit%20Platform%20project!",
      color1: "#065f46",
      color2: "#059669"
    },
    {
      id: 6,
      title: "Daeem",
      category: "store",
      emoji: "🚚",
      desc: "Utility service logistics routing, and delivery management for local enterprise partners.",
      tech: ["React Native", "Google Maps SDK", "Push Notifications API", "Geofencing"],
      link: "https://play.google.com/store/apps/details?id=com.daeemcustomer",
      icon: "https://play-lh.googleusercontent.com/qmcWQnZziMGcO7NtMeHNnlinzxP4KmEFZYRgOnDl9nBJvqq1EDMcJwn1C6U7MCgr6TDUCXj_5P7KdJLHoHPEVA",
      color1: "#7c2d12",
      color2: "#ea580c"
    },
    {
      id: 7,
      title: "Vi UBAH",
      category: "store",
      emoji: "🚗",
      desc: "Ride-hailing and tracking application with customized route displays, live driver positions, and seamless wallet transactions.",
      tech: ["React Native", "Google Maps SDK", "Real-time WebSockets (Socket.io)", "In-App Wallet"],
      link: "https://play.google.com/store/apps/details?id=com.ubah_user",
      icon: "https://play-lh.googleusercontent.com/a993Lk4YSfc4Pmmx2Por-NAU1KZUOK7VqC5MxCyeXg4X8YXVv7fp8VervL-NaXNaE05W4prpgkH05OHPPnKT2L0",
      color1: "#111827",
      color2: "#4b5563"
    },
    {
      id: 8,
      title: "Green Global",
      category: "store",
      emoji: "🌿",
      desc: "Environment monitoring system displaying indices, green alerts, and project status.",
      tech: ["React Native", "Firebase Cloud Services", "Google Maps SDK", "TypeScript"],
      link: "https://apps.apple.com/us/app/green-global/id6737794694",
      icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/38/2e/98/382e983c-1eac-a609-808e-342cf3a13073/AppIcon-1x_U007emarketing-0-6-0-85-220-0.png/1200x630wa.jpg",
      color1: "#14532d",
      color2: "#22c55e"
    },
    {
      id: 9,
      title: "Vibeon",
      category: "store",
      emoji: "🎧",
      desc: "Audio processing and social sharing platform offering unique audio vibes and live podcasts.",
      tech: ["React Native", "Redux Saga", "Core Audio Framework", "Push Notifications API"],
      link: "https://play.google.com/store/apps/details?id=com.vibeon",
      color1: "#581c87",
      color2: "#c084fc"
    },
    {
      id: 10,
      title: "Mint",
      category: "store",
      emoji: "🍃",
      desc: "Finance and wealth tracker focused on budgeting, investment targets, and notifications.",
      tech: ["React Native", "Redux Saga", "Firebase Cloud Services", "Budgeting Analytics Engine"],
      link: "https://play.google.com/store/apps/details?id=com.mint.application",
      icon: "https://play-lh.googleusercontent.com/vq2K92KnC1y6l1-oYAVrqGbJn3gaIeoyAv6_cDblkpItWZ2SHevnahr48fkp8rr6LuUFigg7B9N8yavk7QIDvRw",
      color1: "#14532d",
      color2: "#10b981"
    },
    {
      id: 11,
      title: "Synergo",
      category: "store",
      emoji: "💼",
      desc: "Smarter workforce and workload management platform for optimizing operational workflows and task tracking.",
      tech: ["React Native", "Redux Saga", "Workload Optimization APIs", "Push Notifications API"],
      link: "https://play.google.com/store/apps/details?id=com.synergo",
      icon: "https://play-lh.googleusercontent.com/_V9RF_v5gWdxBeEP_OTzq8ahBPAjYdS_olg_OlrutKibOFk9ej7JXwbqbcRTSduYV-nKWKaCZt7PYpgmD4bCc3w",
      color1: "#1e1e38",
      color2: "#2d3748"
    }
  ];

  return (
    <div>
      {/* Background Animated Blobs */}
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Sticky Header */}
      <header id="header" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-container container">
          <a href="#home" className="logo">
            <span className="logo-accent">&lt;</span>Nand.V<span className="logo-accent">/&gt;</span>
          </a>

          <nav className={`nav-menu ${menuOpen ? 'open' : ''}`} id="nav-menu">
            <ul>
              <li>
                <a href="#home" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</a>
              </li>
              <li>
                <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>About</a>
              </li>
              <li>
                <a href="#skills" className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Skills</a>
              </li>
              <li>
                <a href="#projects" className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Projects</a>
              </li>
              <li>
                <a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Contact</a>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn btn-nav">Let's Talk</a>
            <button className={`mobile-toggle ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="hero-section" ref={sectionsRef.home}>
          {/* Subtle Coding Background Video */}
          <div className="hero-video-container">
            <video autoPlay loop muted playsInline className="hero-video-bg">
              <source src="https://assets.mixkit.co/videos/preview/mixkit-code-typing-on-a-computer-screen-monitor-close-up-34256-large.mp4" type="video/mp4" />
            </video>
            <div className="hero-video-overlay"></div>
          </div>

          <div className="container hero-grid">
            <div className="hero-content reveal">
              <div className="badge">Available for Projects</div>
              <h1>Hi, I'm <span className="text-gradient">Nand Verma</span></h1>
              <h2>
                I build <span className="typing-text">{typingText}</span><span className="cursor">|</span>
              </h2>
              <p className="hero-lead">
                Senior Mobile Application Engineer specializing in React Native. Over 4+ years of experience crafting high-performance, cross-platform Android & iOS applications with native integrations.
              </p>
              <div className="hero-ctas">
                <a href={getWhatsAppLink("Hello Nand! I would like to talk about a project.")} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Let's Talk</a>
                <a href="#projects" className="btn btn-secondary">View My Work</a>
              </div>
            </div>

            <div className="hero-visual reveal">
              <div className="hero-presentation-wrapper">
                <img src={foodDeliveryPresentation} className="hero-presentation-img" alt="Food Delivery App Mockup Presentation" />
                <div className="glow-ring-presentation"></div>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="stats-bar container reveal">
            <div className="stat-item">
              <CountUpStat end={4} suffix="+" />
              <p>Years of Experience</p>
            </div>
            <div className="stat-item">
              <CountUpStat end={15} suffix="+" />
              <p>Apps Maintained & Launched</p>
            </div>
            <div className="stat-item">
              <CountUpStat end={17} suffix="+" />
              <p>Successful Projects</p>
            </div>
            <div className="stat-item">
              <CountUpStat end={97.5} decimals={1} suffix="%" />
              <p>Client Satisfaction</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section section-padding" ref={sectionsRef.about}>
          <div className="container">
            <div className="section-header text-center reveal">
              <span className="section-tag">Profile</span>
              <h2>A Passion for Mobile Craftsmanship</h2>
              <p className="section-lead">Combining clean architecture with seamless UX to deliver robust Android and iOS software.</p>
            </div>

            <div className="about-grid">
              <div className="profile-image-wrapper reveal">
                <div className="profile-image-container">
                  <img src={meImage} alt="Nand Verma" />
                </div>
              </div>

              <div className="about-text reveal">
                <h3>Who I Am</h3>
                <p>I am a dedicated <strong>Senior Mobile Application Engineer</strong> with a proven track record of architecting, building, and deploying cross-platform applications. Over my 4+ years in the industry, I have developed a strong philosophy: mobile apps should not only be efficient and fast, but they should also feel premium and responsive to every swipe and touch.</p>

                <p>My specialty lies in bridge configurations, state management solutions (Redux, Redux-Saga), integration of custom maps/tracking, push notifications, and payment gateways. I focus heavily on writing reusable, component-based architectures that enable rapid scaling while keeping maintenance simple.</p>

                <div className="about-details">
                  <div className="detail-item">
                    <strong>Role:</strong> Senior Mobile Application Engineer
                  </div>
                  <div className="detail-item">
                    <strong>Education:</strong> Bachelor's Degree / Software Development Diploma
                  </div>
                  <div className="detail-item">
                    <strong>Location:</strong> Gurugram, Haryana, India (Open to Remote)
                  </div>
                  <div className="detail-item">
                    <strong>Languages:</strong> English, Hindi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section (iOS Developer Expanded) */}
        <section id="skills" className="skills-section section-padding" ref={sectionsRef.skills}>
          <div className="container">
            <div className="section-header text-center reveal">
              <span className="section-tag">Expertise</span>
              <h2>Skills Directory</h2>
              <p className="section-lead">My toolbox contains a mixture of core mobile frameworks, native iOS development features, and integrations.</p>
            </div>

            <div className="skills-grid reveal">
              {/* Core Mobile / iOS Developer Expanded */}
              <div className="skills-category-card">
                <h3>Core Mobile & iOS</h3>
                <div className="skills-list">
                  <div className="skill-badge" data-glow="purple">
                    <span className="badge-dot"></span> React Native
                  </div>
                  <div className="skill-badge" data-glow="purple">
                    <span className="badge-dot"></span> Redux-Saga
                  </div>
                  <div className="skill-badge" data-glow="blue">
                    <span className="badge-dot"></span> iOS (Swift & SwiftUI)
                  </div>
                  <div className="skill-badge" data-glow="blue">
                    <span className="badge-dot"></span> Objective-C & Xcode
                  </div>
                  <div className="skill-badge" data-glow="blue">
                    <span className="badge-dot"></span> CocoaPods & Fastlane
                  </div>
                  <div className="skill-badge" data-glow="blue">
                    <span className="badge-dot"></span> App Store Publishing
                  </div>
                  <div className="skill-badge" data-glow="blue">
                    <span className="badge-dot"></span> Apple Provisioning
                  </div>
                  <div className="skill-badge" data-glow="cyan">
                    <span className="badge-dot"></span> Android Studio (Kotlin)
                  </div>
                </div>
              </div>

              {/* Languages Category */}
              <div className="skills-category-card">
                <h3>Languages & Architecture</h3>
                <div className="skills-list">
                  <div className="skill-badge" data-glow="gold">
                    <span className="badge-dot"></span> TypeScript
                  </div>
                  <div className="skill-badge" data-glow="gold">
                    <span className="badge-dot"></span> JavaScript (ES6+)
                  </div>
                  <div className="skill-badge" data-glow="blue">
                    <span className="badge-dot"></span> Combine & Swift UI State
                  </div>
                  <div className="skill-badge" data-glow="purple">
                    <span className="badge-dot"></span> Clean Architecture
                  </div>
                  <div className="skill-badge" data-glow="cyan">
                    <span className="badge-dot"></span> NPM & Node Ecosystem
                  </div>
                </div>
              </div>

              {/* Tools & Integrations Category */}
              <div className="skills-category-card">
                <h3>Tools & Services</h3>
                <div className="skills-list">
                  <div className="skill-badge" data-glow="red">
                    <span className="badge-dot"></span> Firebase Suite
                  </div>
                  <div className="skill-badge" data-glow="red">
                    <span className="badge-dot"></span> Google Maps API
                  </div>
                  <div className="skill-badge" data-glow="cyan">
                    <span className="badge-dot"></span> CI/CD (GitHub Actions)
                  </div>
                  <div className="skill-badge" data-glow="cyan">
                    <span className="badge-dot"></span> Socket.io (Real-time)
                  </div>
                  <div className="skill-badge" data-glow="purple">
                    <span className="badge-dot"></span> Push Notifications
                  </div>
                  <div className="skill-badge" data-glow="gold">
                    <span className="badge-dot"></span> Payment Gateways
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive App Simulator Section */}
        <section id="simulator" className="simulator-section section-padding" ref={sectionsRef.simulator}>
          <div className="container">
            <div className="section-header text-center reveal">
              <span className="section-tag">Interactive Preview</span>
              <h2>Interactive Mobile Simulator</h2>
              <p className="section-lead">Click the control panel options below to test simulated mock-ups of features I build in React Native.</p>
            </div>

            <div className={`simulator-grid container-narrow ${simApp === 'chat' || simApp === 'food' || simApp === 'tracking' ? 'chat-expanded-grid' : ''}`}>
              <div className="simulator-controls reveal">
                <button className={`sim-btn ${simApp === 'food' ? 'active' : ''}`} onClick={() => setSimApp('food')}>
                  <span className="sim-icon">🍔</span>
                  <div className="sim-btn-text">
                    <h4>Food Delivery App</h4>
                    <p>Live order tracking, cart & checkout, menus</p>
                  </div>
                </button>

                <button className={`sim-btn ${simApp === 'chat' ? 'active' : ''}`} onClick={() => setSimApp('chat')}>
                  <span className="sim-icon">💬</span>
                  <div className="sim-btn-text">
                    <h4>Real-Time Chat App</h4>
                    <p>Instant messaging thread interface</p>
                  </div>
                </button>

                <button className={`sim-btn ${simApp === 'tracking' ? 'active' : ''}`} onClick={() => setSimApp('tracking')}>
                  <span className="sim-icon">📍</span>
                  <div className="sim-btn-text">
                    <h4>Live Order Map Tracking</h4>
                    <p>Vector maps and movement animation</p>
                  </div>
                </button>
              </div>

              <div className="simulator-device-container reveal delay-2">
                {simApp === 'chat' ? (
                  /* Show 3 staggered screens directly without phone frame or solid background */
                  <div className="chat-staggered-container chat-pattern">
                    <img src={chatScreen1} className="chat-staggered-img" alt="Chat Conversation" />
                    <img src={chatScreen2} className="chat-staggered-img" alt="Chat Inbox List" />
                    <img src={chatScreen3} className="chat-staggered-img" alt="Video Call" />
                  </div>
                ) : simApp === 'food' ? (
                  /* Show 3 staggered screens for food delivery directly without phone frame or solid background */
                  <div className="chat-staggered-container food-pattern">
                    <img src={foodScreen1} className="chat-staggered-img" alt="Food Home Screen" />
                    <img src={foodScreen2} className="chat-staggered-img" alt="Food Detail Screen" />
                    <img src={foodScreen3} className="chat-staggered-img" alt="Food Cart Screen" />
                  </div>
                ) : (
                  /* Show 3 staggered screens for map tracking directly without phone frame or solid background */
                  <div className="chat-staggered-container tracking-pattern">
                    <img src={mapImage} className="chat-staggered-img" alt="Map Tracking Screen 1" />
                    <img src={map1Image} className="chat-staggered-img" alt="Map Tracking Screen 2" />
                    <img src={map2Image} className="chat-staggered-img" alt="Map Tracking Screen 3" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section (Dhurina Removed, Custom Gradients Visuals Added) */}
        <section id="projects" className="projects-section section-padding" ref={sectionsRef.projects}>
          <div className="container">
            <div className="section-header text-center reveal">
              <span className="section-tag">Portfolio</span>
              <h2>Recent Projects</h2>
              <p className="section-lead">A collection of custom applications launched on the Play Store, plus key platform solutions.</p>
            </div>

            <div className="projects-slider-container reveal">
              <div className="projects-slider-track">
                {/* Double the list of projects for seamless infinite horizontal scrolling */}
                {[...projects, ...projects].map((project, idx) => (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={`${project.id}-${idx}`}
                    className="project-card clickable-card"
                  >
                    {/* Visual card background with custom gradients */}
                    {/* Centered Squircle App Icon Box */}
                    <div className="project-icon-wrapper">
                      <div className="project-icon-box" style={{ background: `linear-gradient(135deg, ${project.color1}, ${project.color2})` }}>
                        {project.icon ? (
                          <img src={project.icon} className="project-card-icon" alt={project.title} />
                        ) : (
                          <span className="project-emoji">{project.emoji}</span>
                        )}
                      </div>
                    </div>
                    <div className="project-info">
                      <span className="proj-tag">{project.category === 'store' ? 'Play Store App' : 'Key System'}</span>
                      <h3>{project.title}</h3>
                      <p>{project.desc}</p>
                      <div className="project-tech">
                        {project.tech.map((t, idx) => <span key={idx}>{t}</span>)}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="projects-more text-center reveal">
              <p className="lead-text">Plus <strong>10+ more projects</strong> published on the Google Play Store and App Store.</p>
            </div>
          </div>
        </section>

        {/* Contact Section (Start a Conversation Simplification - Direct Connection Panel) */}
        <section id="contact" className="contact-section section-padding" ref={sectionsRef.contact}>
          <div className="container">
            <div className="section-header text-center reveal">
              <span className="section-tag">Let's Connect</span>
              <h2>Start a Conversation</h2>
              <p className="section-lead">Get in touch directly through any of these platforms to start discussing your project.</p>
            </div>

            <div className="contact-grid-revised reveal">
              {/* WhatsApp Card */}
              <a href={getWhatsAppLink("Hello Nand Verma! I saw your portfolio and would like to discuss a mobile app project.")} target="_blank" rel="noopener noreferrer" className="contact-card-btn">
                <div className="contact-icon-large" style={{ color: '#25d366' }}>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    <path d="M17 12.5c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.4.1-.1.2-.5.7-.6.8-.1.1-.2.1-.4 0a5.9 5.9 0 0 1-2.5-1.5 5.9 5.9 0 0 1-1.5-2.5c-.1-.2 0-.3.1-.4.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.1 0-.3-.1-.4-.1-.2-.4-1-.6-1.4-.2-.4-.3-.3-.4-.3h-.4c-.1 0-.3.1-.4.3a2.5 2.5 0 0 0-.8 1.9c0 1.1.5 2.2 1.2 3.1a9.7 9.7 0 0 0 4.1 3.6c.6.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.2-.5 1.4-1 .2-.5.2-1 .1-1.1s-.3-.2-.5-.3z" />
                  </svg>
                </div>
                <h4>WhatsApp</h4>
                <p>Chat instantly, ask questions, or send project specs.</p>
                <div className="cta-badge">Open Chat &rarr;</div>
              </a>

              {/* Email Card */}
              <a href="mailto:nandverma830@gmail.com" className="contact-card-btn">
                <div className="contact-icon-large" style={{ color: '#a855f7' }}>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <h4>Direct Email</h4>
                <p>nandverma830@gmail.com</p>
                <div className="cta-badge">Send Email &rarr;</div>
              </a>

              {/* Call Card */}
              <a href="tel:+919306272346" className="contact-card-btn">
                <div className="contact-icon-large" style={{ color: '#06b6d4' }}>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <h4>Phone Call</h4>
                <p>+91 9306272346</p>
                <div className="cta-badge">Call Now &rarr;</div>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (LinkedIn, WhatsApp, Bitbucket, StackOverflow Added) */}
      <footer>
        <div className="container footer-content">
          <div className="footer-socials">
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/nand-verma-63196125b?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>

            {/* GitHub */}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn github" aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </a>

            {/* StackOverflow */}
            <a href="https://stackoverflow.com/users/18597013/nd-verma" target="_blank" rel="noopener noreferrer" className="social-icon-btn stackoverflow" aria-label="StackOverflow">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.986 21.865v-6.404h2.21v8.613H2.225v-8.613h2.21v6.404h14.551zm-11.83-4.664l9.14.887.214-2.196-9.14-.887-.214 2.196zm.94-4.526l8.4 2.92.73-2.096-8.4-2.92-.73 2.096zm1.962-4.148l7.19 5.09 1.28-1.81-7.19-5.09-1.28 1.81zm2.937-3.412l5.47 6.9 1.73-1.37-5.47-6.9-1.73 1.37zM15.302 0l-.82 2.06 3.96 1.58.82-2.06-3.96-1.58z" /></svg>
            </a>
          </div>

          <p>&copy; 2026 Nand Verma. All rights reserved.</p>
          <p>Designed for excellence in React Native development.</p>
        </div>
      </footer>
    </div>
  );
}
