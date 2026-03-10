import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  RobotOutlined,
  ShopOutlined,
  BankOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  RiseOutlined,
  GlobalOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ArrowDownOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  FacebookOutlined,
  SendOutlined,
  FieldNumberOutlined,
  DollarOutlined,
  BoxPlotOutlined,
  CloudServerOutlined,
  StarOutlined,
} from "@ant-design/icons";

// ============================================================================
// STYLES & THEME
// ============================================================================

const theme = {
  primary: "#0f3460",
  secondary: "#16213e",
  accent: "#52c41a",
  accentGlow: "rgba(82, 196, 26, 0.5)",
  gradient: "linear-gradient(135deg, #0f3460 0%, #1a5f2e 50%, #16213e 100%)",
  glass: "rgba(255, 255, 255, 0.1)",
  glassBorder: "rgba(255, 255, 255, 0.2)",
  text: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.7)",
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const floatAnimation = {
  y: [0, -20, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const pulseGlow = {
  boxShadow: [
    "0 0 20px rgba(82, 196, 26, 0.3)",
    "0 0 40px rgba(82, 196, 26, 0.6)",
    "0 0 20px rgba(82, 196, 26, 0.3)"
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime;
    let frame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [end, duration, isInView]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
};

// Glassmorphism Navbar
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "About Us", href: "#about" },
    { label: "Benefits", href: "#benefits" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Stats", href: "#stats" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled 
          ? "rgba(15, 52, 96, 0.85)" 
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled 
          ? "1px solid rgba(255, 255, 255, 0.1)" 
          : "none",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: scrolled 
          ? "0 4px 30px rgba(0, 0, 0, 0.3)" 
          : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              boxShadow: "0 4px 20px rgba(82, 196, 26, 0.4)",
            }}
          >
            🌾
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.5px",
            }}
          >
            AgroBridge<span style={{ color: "#52c41a" }}>AI</span>
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.05 }}
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: 500,
                fontSize: 15,
                transition: "all 0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "white";
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "rgba(255, 255, 255, 0.8)";
                e.target.style.background = "transparent";
              }}
            >
              {link.label}
            </motion.a>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: "flex", gap: 12, marginLeft: 20 }}
          >
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "white",
                  padding: "10px 24px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: 15,
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                  e.target.style.background = "transparent";
                }}
              >
                Login
              </motion.button>
            </Link>

            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(82, 196, 26, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                  border: "none",
                  color: "white",
                  padding: "10px 24px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 15,
                  boxShadow: "0 4px 15px rgba(82, 196, 26, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                Register
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: "rgba(15, 52, 96, 0.95)",
              backdropFilter: "blur(20px)",
              padding: "20px",
              marginTop: 10,
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: "block",
                  color: "white",
                  padding: "12px 0",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Floating Icon Component
const FloatingIcon = ({ icon, delay = 0, style = {} }) => (
  <motion.div
    animate={{
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    style={{
      position: "absolute",
      fontSize: 40,
      opacity: 0.15,
      filter: "blur(1px)",
      ...style,
    }}
  >
    {icon}
  </motion.div>
);

// Glowing Orb Component
const GlowingOrb = ({ size = 300, color = "#52c41a", style = {} }) => (
  <motion.div
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.1, 0.2, 0.1],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: "blur(60px)",
      ...style,
    }}
  />
);

// Hero Section
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f3460 0%, #1a5f2e 50%, #16213e 100%)",
      }}
    >
      {/* Background Effects */}
      <GlowingOrb size={400} color="#52c41a" style={{ top: "10%", left: "5%" }} />
      <GlowingOrb size={300} color="#0ea5e9" style={{ top: "60%", right: "10%" }} />
      <GlowingOrb size={200} color="#f59e0b" style={{ bottom: "20%", left: "30%" }} />

      {/* Floating Icons */}
      <FloatingIcon icon="🌾" delay={0} style={{ top: "15%", left: "10%" }} />
      <FloatingIcon icon="🌽" delay={0.5} style={{ top: "25%", right: "15%" }} />
      <FloatingIcon icon="🍅" delay={1} style={{ top: "60%", left: "8%" }} />
      <FloatingIcon icon="🥬" delay={1.5} style={{ top: "70%", right: "20%" }} />
      <FloatingIcon icon="🚜" delay={2} style={{ top: "40%", left: "60%" }} />
      <FloatingIcon icon="💧" delay={2.5} style={{ top: "20%", left: "40%" }} />

      {/* Grid Pattern Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "160px 32px 100px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(82, 196, 26, 0.15)",
              border: "1px solid rgba(82, 196, 26, 0.3)",
              padding: "8px 20px",
              borderRadius: "50px",
              marginBottom: 32,
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: 12 }}
            >
              ✨
            </motion.span>
            <span style={{ color: "#52c41a", fontWeight: 600, fontSize: 14 }}>
              AI-Powered Agricultural Revolution
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeInUp}
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: "-1px",
              maxWidth: 900,
            }}
          >
            AI Powered{" "}
            <motion.span
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              style={{
                background: "linear-gradient(90deg, #52c41a, #0ea5e9, #52c41a)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Agricultural
            </motion.span>{" "}
            Marketplace
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeInUp}
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "rgba(255, 255, 255, 0.7)",
              maxWidth: 700,
              lineHeight: 1.7,
              marginBottom: 48,
            }}
          >
            Connecting Farmers, Traders, and Mills through AI-powered crop grading 
            and price prediction. Transform your agricultural business with cutting-edge 
            technology.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}
          >
            <Link to="/register">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 40px rgba(82, 196, 26, 0.6)" 
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                  border: "none",
                  color: "white",
                  padding: "18px 40px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 17,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "0 8px 30px rgba(82, 196, 26, 0.4)",
                }}
              >
                Get Started <ArrowRightOutlined />
              </motion.button>
            </Link>

            <a href="#about">
              <motion.button
                whileHover={{ scale: 1.05, background: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  padding: "18px 40px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 17,
                  backdropFilter: "blur(10px)",
                }}
              >
                Learn More
              </motion.button>
            </a>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={fadeInUp}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 24,
              marginTop: 80,
              width: "100%",
              maxWidth: 900,
            }}
          >
            {[
              { icon: <BankOutlined />, value: 10000, label: "Farmers", color: "#52c41a" },
              { icon: <ShopOutlined />, value: 500, label: "Traders", color: "#0ea5e9" },
              { icon: <TeamOutlined />, value: 200, label: "Mills", color: "#f59e0b" },
              { icon: <ThunderboltOutlined />, value: 50000, label: "Deals Closed", color: "#8b5cf6" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  padding: "28px 20px",
                  textAlign: "center",
                  backdropFilter: "blur(10px)",
                  cursor: "pointer",
                }}
              >
                <motion.div
                  style={{
                    fontSize: 32,
                    color: stat.color,
                    marginBottom: 12,
                  }}
                >
                  {stat.icon}
                </motion.div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "white", marginBottom: 4 }}>
                  <AnimatedCounter end={stat.value} />
                </div>
                <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 14, fontWeight: 500 }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: 24,
            }}
          >
            <ArrowDownOutlined />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Benefits Section
const BenefitsSection = () => {
  const benefits = [
    {
      role: "Farmer",
      icon: "👨‍🌾",
      color: "#52c41a",
      features: [
        { icon: <ShopOutlined />, title: "Sell Crops Easily", desc: "Reach thousands of buyers directly" },
        { icon: <RobotOutlined />, title: "AI Quality Grading", desc: "Instant crop quality detection" },
        { icon: <DollarOutlined />, title: "Smart Price Prediction", desc: "Get best market prices" },
      ],
    },
    {
      role: "Trader",
      icon: "🏪",
      color: "#0ea5e9",
      features: [
        { icon: <GlobalOutlined />, title: "Access Farmer Crops", desc: "Browse quality-graded crops" },
        { icon: <BoxPlotOutlined />, title: "Aggregate Crops", desc: "Combine from multiple farmers" },
        { icon: <ShopOutlined />, title: "Supply Mills Efficiently", desc: "Streamlined bulk supply" },
      ],
    },
    {
      role: "Mill",
      icon: "🏭",
      color: "#f59e0b",
      features: [
        { icon: <SafetyCertificateOutlined />, title: "Buy Graded Crops", desc: "Quality-assured procurement" },
        { icon: <TeamOutlined />, title: "Reliable Sourcing", desc: "Consistent supply chain" },
        { icon: <ThunderboltOutlined />, title: "Bulk Procurement", desc: "Best rates for bulk orders" },
      ],
    },
  ];

  return (
    <section
      id="benefits"
      style={{
        padding: "120px 0",
        background: "linear-gradient(180deg, #0f3460 0%, #16213e 100%)",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(82, 196, 26, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: "rgba(82, 196, 26, 0.15)",
              border: "1px solid rgba(82, 196, 26, 0.3)",
              padding: "8px 20px",
              borderRadius: "50px",
              color: "#52c41a",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Benefits
          </motion.span>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              color: "white",
              marginTop: 24,
              marginBottom: 16,
            }}
          >
            Benefits as a Member
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
            Join our platform and unlock a world of advantages tailored to your role in the agricultural ecosystem.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 32 }}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.role}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -10 }}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "24px",
                padding: "40px 32px",
                backdropFilter: "blur(10px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glow Effect */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: `linear-gradient(90deg, ${benefit.color}, transparent)`,
                }}
              />

              {/* Role Header */}
              <motion.div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 32,
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "16px",
                    background: `linear-gradient(135deg, ${benefit.color}22, ${benefit.color}11)`,
                    border: `1px solid ${benefit.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                  }}
                >
                  {benefit.icon}
                </motion.div>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, color: "white", margin: 0 }}>
                    {benefit.role}
                  </h3>
                  <span style={{ color: benefit.color, fontSize: 14, fontWeight: 500 }}>
                    Member
                  </span>
                </div>
              </motion.div>

              {/* Features List */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {benefit.features.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + i * 0.1 }}
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        background: `linear-gradient(135deg, ${benefit.color}22, ${benefit.color}11)`,
                        border: `1px solid ${benefit.color}33`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: benefit.color,
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 600, color: "white", margin: "0 0 4px" }}>
                        {feature.title}
                      </h4>
                      <p style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.6)", margin: 0, lineHeight: 1.5 }}>
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    { icon: "📤", title: "Farmer uploads crop", desc: "Upload crop details & images" },
    { icon: "🤖", title: "AI detects quality", desc: "ML-powered grading analysis" },
    { icon: "🤝", title: "Trader buys crop", desc: "Browse & purchase crops" },
    { icon: "📦", title: "Mill purchases bulk", desc: "Efficient bulk procurement" },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: "120px 0",
        background: "#0a0a1a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse at top left, rgba(82, 196, 26, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, rgba(14, 165, 233, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 80 }}
        >
          <span
            style={{
              background: "rgba(14, 165, 233, 0.15)",
              border: "1px solid rgba(14, 165, 233, 0.3)",
              padding: "8px 20px",
              borderRadius: "50px",
              color: "#0ea5e9",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            How It Works
          </span>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              color: "white",
              marginTop: 24,
            }}
          >
            Platform Workflow
          </h2>
        </motion.div>

        {/* Steps */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              style={{
                flex: "1 1 250px",
                maxWidth: 280,
                textAlign: "center",
                position: "relative",
              }}
            >
              {/* Step Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "24px",
                  padding: "40px 24px",
                  backdropFilter: "blur(10px)",
                }}
              >
                {/* Step Number */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                  style={{
                    position: "absolute",
                    top: -16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #52c41a, #389e0d)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "white",
                    boxShadow: "0 4px 15px rgba(82, 196, 26, 0.4)",
                  }}
                >
                  {index + 1}
                </motion.div>

                <div style={{ fontSize: 56, marginBottom: 20 }}>{step.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 12 }}>
                  {step.title}
                </h3>
                <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 14, lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </motion.div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                  style={{
                    position: "absolute",
                    right: -20,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#52c41a",
                    fontSize: 24,
                    display: "none",
                  }}
                  className="arrow-desktop"
                >
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Flow indicators for mobile */}
        <div className="mobile-arrows" style={{ display: "none", textAlign: "center", padding: "20px 0" }}>
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ color: "#52c41a", fontSize: 24 }}
          >
            ↓
          </motion.span>
        </div>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  const stats = [
    { value: 10000, suffix: "+", label: "Farmers", icon: <BankOutlined />, color: "#52c41a" },
    { value: 500, suffix: "+", label: "Traders", icon: <ShopOutlined />, color: "#0ea5e9" },
    { value: 200, suffix: "+", label: "Mills", icon: <TeamOutlined />, color: "#f59e0b" },
    { value: 98, suffix: "%", label: "AI Accuracy", icon: <RobotOutlined />, color: "#8b5cf6" },
  ];

  return (
    <section
      id="stats"
      style={{
        padding: "100px 0",
        background: "linear-gradient(135deg, #0f3460 0%, #1a5f2e 50%, #16213e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Orbs */}
      <GlowingOrb size={400} color="#52c41a" style={{ top: "-20%", left: "-10%" }} />
      <GlowingOrb size={300} color="#0ea5e9" style={{ bottom: "-20%", right: "-10%" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              color: "white",
            }}
          >
            Platform Statistics
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 18, marginTop: 12 }}>
            Join the fastest growing agricultural network in India
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 32,
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "40px 24px",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${stat.color}22, ${stat.color}11)`,
                  border: `1px solid ${stat.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: 24,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: "clamp(36px, 5vw, 48px)",
                  fontWeight: 800,
                  color: "white",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 16, fontWeight: 500 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section
      style={{
        padding: "120px 0",
        background: "#0a0a1a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Effects */}
      <GlowingOrb size={500} color="#52c41a" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 32px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "32px",
            padding: "80px 40px",
            backdropFilter: "blur(20px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative Elements */}
          <div style={{ position: "absolute", top: -50, right: -50, fontSize: 200, opacity: 0.05 }}>🌾</div>
          <div style={{ position: "absolute", bottom: -50, left: -50, fontSize: 200, opacity: 0.05 }}>🌽</div>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 800,
              color: "white",
              marginBottom: 20,
              position: "relative",
            }}
          >
            Start Smart Crop Trading Today
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 18,
              marginBottom: 40,
              maxWidth: 500,
              margin: "0 auto 40px",
              lineHeight: 1.7,
              position: "relative",
            }}
          >
            Join thousands of and mills already benefiting from 
            AI-powered agricultural trading farmers, traders,. Get started in minutes.
          </p>

          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
            <Link to="/register">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 50px rgba(82, 196, 26, 0.7)" 
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(82, 196, 26, 0.3)",
                    "0 0 40px rgba(82, 196, 26, 0.5)",
                    "0 0 20px rgba(82, 196, 26, 0.3)"
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                  border: "none",
                  color: "white",
                  padding: "18px 48px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                Register Now <ArrowRightOutlined />
              </motion.button>
            </Link>

            <Link to="/login">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  background: "rgba(255, 255, 255, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  padding: "18px 48px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                Login
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  const features = [
    { icon: <RobotOutlined />, title: "AI Prediction", desc: "Advanced ML models for price forecasting", color: "#52c41a" },
    { icon: <SafetyCertificateOutlined />, title: "Quality Detection", desc: "Automated crop quality assessment", color: "#0ea5e9" },
    { icon: <GlobalOutlined />, title: "Wide Network", desc: "Connect across entire supply chain", color: "#f59e0b" },
    { icon: <RiseOutlined />, title: "Higher Profits", desc: "Maximize returns for farmers", color: "#8b5cf6" },
  ];

  return (
    <section
      id="about"
      style={{
        padding: "120px 0",
        background: "linear-gradient(180deg, #16213e 0%, #0f3460 100%)",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <span
            style={{
              background: "rgba(139, 92, 246, 0.15)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              padding: "8px 20px",
              borderRadius: "50px",
              color: "#8b5cf6",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            About Us
          </span>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              color: "white",
              marginTop: 24,
            }}
          >
            Revolutionizing Agriculture with AI
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03, y: -5 }}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                padding: "32px",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${feature.color}22, ${feature.color}11)`,
                  border: `1px solid ${feature.color}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: 28,
                  color: feature.color,
                }}
              >
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "white", marginBottom: 12 }}>
                {feature.title}
              </h3>
              <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 14, lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const footerLinks = {
    Platform: [
      { label: "Benefits", href: "#benefits" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Statistics", href: "#stats" },
    ],
    Company: [
      { label: "About Us", href: "#about" },
      { label: "Contact", href: "#" },
      { label: "Careers", href: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  };

  const socialIcons = [
    { icon: <TwitterOutlined />, label: "Twitter" },
    { icon: <LinkedinOutlined />, label: "LinkedIn" },
    { icon: <FacebookOutlined />, label: "Facebook" },
    { icon: <InstagramOutlined />, label: "Instagram" },
  ];

  return (
    <footer
      style={{
        background: "#050510",
        color: "white",
        padding: "80px 0 40px",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 48,
            marginBottom: 60,
          }}
        >
          {/* Brand Column */}
          <div>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: 20 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                🌾
              </div>
              <span style={{ fontSize: 22, fontWeight: 700 }}>
                AgroBridge<span style={{ color: "#52c41a" }}>AI</span>
              </span>
            </Link>
            <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              AI-powered agricultural B2B marketplace connecting farmers, 
              traders, and mills for smarter trading.
            </p>
            {/* Social Icons */}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              {socialIcons.map((social) => (
                <motion.a
                  key={social.label}
                  href="#"
                  whileHover={{ scale: 1.1, y: -3 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: 18,
                    transition: "all 0.3s ease",
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "white",
                  marginBottom: 20,
                }}
              >
                {category}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{
                      color: "rgba(255, 255, 255, 0.5)",
                      textDecoration: "none",
                      fontSize: 14,
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#52c41a")}
                    onMouseLeave={(e) => (e.target.style.color = "rgba(255, 255, 255, 0.5)")}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            paddingTop: 30,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 14, margin: 0 }}>
            © 2024 AgroBridgeAI. All rights reserved.
          </p>
          <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 14, margin: 0 }}>
            Made with ❤️ for Indian Farmers
          </p>
        </div>
      </div>
    </footer>
  );
};

// ============================================================================
// MAIN LANDING PAGE COMPONENT
// ============================================================================

const LandingPage = () => {
  return (
    <div style={{ background: "#0a0a1a", minHeight: "100vh" }}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: #0a0a1a;
          color: white;
          overflow-x: hidden;
        }
        
        @media (max-width: 768px) {
          .arrow-desktop {
            display: none !important;
          }
          .mobile-arrows {
            display: block !important;
          }
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #0a0a1a;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #52c41a;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #389e0d;
        }
      `}</style>
      
      <Navbar />
      <HeroSection />
      <AboutSection />
      <BenefitsSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;

