import { useMemo, useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Stars, Points, PointMaterial, PerspectiveCamera } from "@react-three/drei";
import { Mail, Phone, Linkedin, MapPin, Code2, Briefcase, GraduationCap, FolderGit2, Github, Send, ChevronDown, ArrowUp, ExternalLink, Menu, X } from "lucide-react";
import * as THREE from "three";

// ==================== THREE.JS COMPONENTS ====================

function ParticleGalaxy({ count = 3000 }) {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 50 + 10;
      const angle = Math.random() * Math.PI * 2;
      const spiralOffset = angle + radius * 0.5;

      const x = Math.cos(spiralOffset) * radius * (1 + Math.random() * 0.3);
      const y = (Math.random() - 0.5) * 10;
      const z = Math.sin(spiralOffset) * radius * (1 + Math.random() * 0.3);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Color gradient: cyan to purple to white
      const colorFactor = radius / 60;
      if (colorFactor < 0.33) {
        colors[i3] = 0;
        colors[i3 + 1] = 0.83;
        colors[i3 + 2] = 1;
      } else if (colorFactor < 0.66) {
        colors[i3] = 0.48;
        colors[i3 + 1] = 0.18;
        colors[i3 + 2] = 1;
      } else {
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      }
    }

    return { positions, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.001;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions.positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00D4FF" size={0.5} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

function FloatingGeometries() {
  const icoRef = useRef();
  const torusRefs = useRef([]);

  const torusPositions = useMemo(() => [
    { pos: [-8, 3, -5], rot: [0.5, 0.3, 0], speed: 0.008 },
    { pos: [8, -2, -6], rot: [0.3, 0.5, 0.2], speed: 0.01 },
    { pos: [-6, -4, -4], rot: [0.4, 0.2, 0.3], speed: 0.006 },
    { pos: [7, 4, -5], rot: [0.2, 0.4, 0.1], speed: 0.009 },
    { pos: [0, 6, -7], rot: [0.3, 0.3, 0.2], speed: 0.007 },
  ], []);

  useFrame((state, delta) => {
    if (icoRef.current) {
      icoRef.current.rotation.x += delta * 0.002;
      icoRef.current.rotation.y += delta * 0.003;
      icoRef.current.rotation.z += delta * 0.001;
    }

    torusRefs.current.forEach((torus, i) => {
      if (torus) {
        torus.rotation.x += torusPositions[i].speed;
        torus.rotation.y += torusPositions[i].speed * 1.2;
      }
    });
  });

  return (
    <group>
      {/* Large Icosahedron - Center */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh ref={icoRef} position={[0, 0, -3]}>
          <icosahedronGeometry args={[2.5, 0]} />
          <meshBasicMaterial color="#00D4FF" wireframe transparent opacity={0.6} />
        </mesh>
      </Float>

      {/* Floating Torus Rings */}
      {torusPositions.map((torus, i) => (
        <Float key={i} speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <mesh ref={el => torusRefs.current[i] = el} position={torus.pos}>
            <torusGeometry args={[0.8, 0.05, 16, 100]} />
            <meshBasicMaterial color="#7B2FFF" transparent opacity={0.8} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function MeteorEffect() {
  const lineRef = useRef();
  const [meteor, setMeteor] = useState({ start: null, end: null, opacity: 0 });

  useEffect(() => {
    const spawnMeteor = () => {
      const startX = (Math.random() - 0.5) * 100;
      const startY = (Math.random() - 0.5) * 50 + 30;
      const startZ = -20;

      setMeteor({
        start: new THREE.Vector3(startX, startY, startZ),
        end: new THREE.Vector3(startX - 50, startY - 50, startZ + 20),
        opacity: 1,
      });

      setTimeout(() => setMeteor({ start: null, end: null, opacity: 0 }), 1000);
      setTimeout(spawnMeteor, 4000 + Math.random() * 3000);
    };

    const timeout = setTimeout(spawnMeteor, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useFrame((state, delta) => {
    if (lineRef.current && meteor.start && meteor.opacity > 0) {
      setMeteor(prev => ({ ...prev, opacity: prev.opacity - delta * 1.5 }));
    }
  });

  if (!meteor.start) return null;

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([...meteor.start.toArray(), ...meteor.end.toArray()])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#00D4FF" transparent opacity={meteor.opacity} />
    </line>
  );
}

function HeroScene({ mousePos }) {
  const cameraRef = useRef();
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mousePos.y * 0.02, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -mousePos.x * 0.02, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ParticleGalaxy count={3000} />
      <FloatingGeometries />
      <MeteorEffect />
    </group>
  );
}

// ==================== UI COMPONENTS ====================

function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current && dotRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };

    const handleMouseOver = (e) => {
      if (e.target.closest("a, button, .interactive")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className={`custom-cursor ${isHovering ? "hovered" : ""}`} />
      <div ref={dotRef} className={`custom-cursor-dot ${isHovering ? "hovered" : ""}`} />
    </>
  );
}

function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: progress >= 100 ? 0 : 1 }}
    >
      <div className="text-center">
        <motion.div
          className="text-6xl font-black font-display mb-4 gradient-text"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          BKY
        </motion.div>
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-electric-blue to-neon-purple"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-electric-blue font-mono">{progress}%</p>
      </div>
    </motion.div>
  );
}

function Navbar({ activeSection, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "get-cv", label: "Get CV" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-card-strong py-3" : "py-5 bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.a
          href="#hero"
          className="text-2xl font-black font-display gradient-text interactive"
          whileHover={{ scale: 1.05 }}
          onClick={(e) => { e.preventDefault(); onNavigate("hero"); }}
        >
          BKY
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all interactive ${
                activeSection === item.id
                  ? "bg-white/10 text-electric-blue"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
              onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden interactive p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card-strong mx-4 mt-2 rounded-2xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all interactive ${
                    activeSection === item.id
                      ? "bg-electric-blue/20 text-electric-blue"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function HeroSection({ onNavigate }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const titles = useMemo(() => ["Software Engineer", ".NET Developer", "Laravel Developer", "Web Developer"], []);
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const currentTitle = titles[titleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting && typedText.length < currentTitle.length) {
        setTypedText(currentTitle.slice(0, typedText.length + 1));
      } else if (isDeleting && typedText.length > 0) {
        setTypedText(currentTitle.slice(0, typedText.length - 1));
      } else if (!isDeleting && typedText.length === currentTitle.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && typedText.length === 0) {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % titles.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, titleIndex, titles]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <HeroScene mousePos={mousePos} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-space/50 via-space/70 to-space -z-1" />

      {/* Hero Content */}
      <div className="text-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 interactive">
            <MapPin className="w-4 h-4 text-electric-blue" />
            <span className="text-sm text-gray-300">Kathmandu, Nepal</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display mb-4">
            <span className="gradient-text">BRIJESH K. YADAV</span>
          </h1>

          <div className="h-8 md:h-10 mb-8">
            <p className="text-xl md:text-2xl text-gray-300 font-light">
              {typedText}
              <span className="animate-blink text-electric-blue">|</span>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="#projects"
              className="interactive px-8 py-4 rounded-2xl glass-card font-semibold text-electric-blue hover:bg-electric-blue/10 transition-all glow-cyan"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.preventDefault(); onNavigate("projects"); }}
            >
              View My Work
            </motion.a>
            <motion.a
              href="./Brijesh_CV.pdf"
              download="Brijesh_K_Yadav_CV.pdf"
              className="interactive px-8 py-4 rounded-2xl bg-gradient-to-r from-electric-blue to-neon-purple font-semibold text-white hover:shadow-glow-cyan transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download CV
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-gray-400" />
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Left: 3D Rotating Cube */}
          <div className="flex justify-center">
            <div className="w-48 h-48 perspective-500">
              <motion.div
                className="w-full h-full relative transform-style-3d"
                animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {/* Cube faces would go here - simplified for now */}
                <div className="absolute inset-0 glass-card rounded-3xl flex items-center justify-center">
                  <Code2 className="w-20 h-20 text-electric-blue" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right: Bio */}
          <div>
            <h2 className="text-4xl font-bold font-display mb-6 gradient-text">About Me</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Software engineer with a passion for building scalable web applications and elegant solutions.
              I specialize in backend development with C#/.NET and PHP/Laravel, while also crafting
              responsive frontends with modern frameworks.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="glass-card rounded-2xl p-4 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-3xl font-bold text-electric-blue">3+</p>
                <p className="text-sm text-gray-400 mt-1">Internships</p>
              </motion.div>
              <motion.div
                className="glass-card rounded-2xl p-4 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-3xl font-bold text-neon-purple">1+</p>
                <p className="text-sm text-gray-400 mt-1">Year Experience</p>
              </motion.div>
              <motion.div
                className="glass-card rounded-2xl p-4 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-3xl font-bold text-electric-blue">BSc</p>
                <p className="text-sm text-gray-400 mt-1">Computer Science</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const skills = [
    { name: "C#", icon: "⚡", category: "Backend", level: 85 },
    { name: ".NET Framework", icon: "🔷", category: "Backend", level: 82 },
    { name: "PHP", icon: "🐘", category: "Backend", level: 80 },
    { name: "Laravel", icon: "🔥", category: "Backend", level: 78 },
    { name: "MySQL", icon: "🗄️", category: "Database", level: 80 },
    { name: "SQL Server", icon: "💾", category: "Database", level: 75 },
    { name: "JavaScript", icon: "💛", category: "Frontend", level: 75 },
    { name: "HTML5/CSS3", icon: "🎨", category: "Frontend", level: 85 },
    { name: "RESTful APIs", icon: "🔗", category: "Concepts", level: 82 },
    { name: "Git", icon: "🌿", category: "Tools", level: 80 },
    { name: "WordPress", icon: "🌐", category: "CMS", level: 75 },
    { name: "Agile/Scrum", icon: "🏃", category: "Concepts", level: 70 },
  ];

  return (
    <section id="skills" className="py-24 px-6 bg-gradient-to-b from-space to-space/80">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold font-display text-center mb-4 gradient-text">Technical Skills</h2>
          <p className="text-gray-400 text-center mb-12">Tools and technologies I work with</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card rounded-2xl p-5 interactive group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{skill.icon}</span>
                  <div>
                    <p className="font-semibold text-white group-hover:text-electric-blue transition-colors">
                      {skill.name}
                    </p>
                    <p className="text-xs text-gray-500">{skill.category}</p>
                  </div>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.05 }}
                    className="absolute inset-0 bg-gradient-to-r from-electric-blue to-neon-purple rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const experiences = [
    {
      role: "Software Engineer",
      company: "Horizon Technology",
      period: "Sep 2024 – May 2025",
      description: "Enterprise app development, API design, database optimization",
      tags: ["C#", ".NET", "REST API", "SQL Server", "Git", "Agile"],
    },
    {
      role: "Web Dev Intern",
      company: "Bhibhuti Solution",
      period: "Jun 2024 – Sep 2024",
      description: "Full-stack web applications, MVC architecture, REST APIs",
      tags: ["PHP", "Laravel", "MySQL", "JavaScript", "HTML/CSS"],
    },
    {
      role: "WordPress Intern",
      company: "ACAN",
      period: "Mar 2024 – May 2024",
      description: "Website design, customization, plugin configuration",
      tags: ["WordPress", "CSS", "Responsive Design"],
    },
  ];

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold font-display text-center mb-4 gradient-text">Experience</h2>
          <p className="text-gray-400 text-center mb-12">My professional journey</p>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-electric-blue via-neon-purple to-transparent" />

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative mb-12 ${index % 2 === 0 ? "md:text-right" : "md:text-left md:ml-auto md:w-1/2"}`}
              >
                {/* Timeline Node */}
                <div className={`absolute top-6 w-4 h-4 rounded-full bg-electric-blue pulse-glow ${
                  index % 2 === 0 ? "left-0 md:-left-8" : "left-1/2 md:-left-2 -translate-x-1/2"
                }`} />

                <div className={`glass-card rounded-2xl p-6 ml-8 md:ml-0 ${index % 2 === 0 ? "md:mr-16" : "md:ml-8"}`}>
                  <p className="text-electric-blue font-semibold">{exp.role}</p>
                  <h3 className="text-xl font-bold text-white mt-1">{exp.company}</h3>
                  <p className="text-sm text-gray-400 mt-1">{exp.period}</p>
                  <p className="text-gray-300 mt-3">{exp.description}</p>
                  <div className={`flex flex-wrap gap-2 mt-4 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                    {exp.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const projects = [
    {
      title: "Enterprise Management System",
      description: "Multi-module business application with REST API backend built during Horizon Technology internship.",
      tech: ["C#", ".NET", "SQL Server", "REST API", "Git"],
      color: "#00D4FF",
      github: "#",
      live: "#",
    },
    {
      title: "Dynamic Web Portal",
      description: "Laravel-based portal with dynamic content management, user authentication, and MySQL backend.",
      tech: ["PHP", "Laravel", "MySQL", "JavaScript", "Bootstrap"],
      color: "#7B2FFF",
      github: "#",
      live: "#",
    },
    {
      title: "Corporate Website Redesign",
      description: "Fully customized responsive WordPress website with custom theme development and plugin integration.",
      tech: ["WordPress", "CSS3", "PHP", "Responsive Design"],
      color: "#FF6B6B",
      github: "#",
      live: "#",
    },
  ];

  return (
    <section id="projects" className="py-24 px-6 bg-gradient-to-b from-space to-space/80">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-bold font-display text-center mb-4 gradient-text">Projects</h2>
          <p className="text-gray-400 text-center mb-12">Featured work and case studies</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30, rotateY: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(0, 212, 255, 0.2)"
                }}
                className="glass-card rounded-3xl overflow-hidden group"
                style={{ perspective: "1000px" }}
              >
                {/* Card Image Placeholder */}
                <div
                  className="h-48 bg-gradient-to-br from-white/5 to-white/10 relative overflow-hidden"
                  style={{ borderTop: `2px solid ${project.color}` }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${project.color}, transparent 70%)`,
                    }}
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-electric-blue transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <a
                      href={project.github}
                      className="flex-1 py-2 rounded-xl bg-white/10 border border-white/10 text-center text-sm font-medium hover:bg-white/20 transition interactive"
                    >
                      <Github className="w-4 h-4 inline mr-2" />
                      Code
                    </a>
                    <a
                      href={project.live}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-electric-blue/20 to-neon-purple/20 border border-electric-blue/30 text-center text-sm font-medium hover:from-electric-blue/30 hover:to-neon-purple/30 transition interactive"
                    >
                      <ExternalLink className="w-4 h-4 inline mr-2" />
                      Live
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GetCVSection() {
  return (
    <section id="get-cv" className="py-24 px-6 bg-gradient-to-b from-space/80 to-space">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold font-display mb-4 gradient-text">Get My CV</h2>
          <p className="text-gray-400 text-center mb-12">
            Preview and download my complete curriculum vitae
          </p>

          {/* CV Preview Card */}
          <motion.div
            className="glass-card rounded-3xl p-8 mb-8"
            whileHover={{ scale: 1.02 }}
          >
            {/* CV Document Preview */}
            <div className="bg-white/5 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white">Brijesh K. Yadav - CV</h3>
                  <p className="text-sm text-gray-400 mt-1">Software Engineer | Kathmandu, Nepal</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Full Stack Developer specializing in C#/.NET, PHP/Laravel, and modern web technologies
                  </p>
                </div>
              </div>

              {/* CV Sections Preview */}
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-electric-blue" />
                    <span>Professional Summary</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-electric-blue" />
                    <span>Work Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-electric-blue" />
                    <span>Education</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-neon-purple" />
                    <span>Technical Skills</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-neon-purple" />
                    <span>Projects</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-neon-purple" />
                    <span>Certifications</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="./Brijesh_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="interactive px-6 py-3 rounded-xl glass-card border border-electric-blue/30 text-electric-blue font-semibold hover:bg-electric-blue/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview CV
              </a>
              <a
                href="./Brijesh_CV.pdf"
                download="Brijesh_K_Yadav_CV.pdf"
                className="interactive px-6 py-3 rounded-xl bg-gradient-to-r from-electric-blue to-neon-purple text-white font-semibold hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download CV
              </a>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <motion.div
              className="glass-card rounded-2xl p-5"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-3xl font-bold text-electric-blue">3+</p>
              <p className="text-sm text-gray-400 mt-1">Years Experience</p>
            </motion.div>
            <motion.div
              className="glass-card rounded-2xl p-5"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-3xl font-bold text-neon-purple">10+</p>
              <p className="text-sm text-gray-400 mt-1">Projects Completed</p>
            </motion.div>
            <motion.div
              className="glass-card rounded-2xl p-5"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-3xl font-bold text-electric-blue">BSc</p>
              <p className="text-sm text-gray-400 mt-1">Computer Science</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      {/* Background Fog Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-center mb-4">
            <span className="gradient-text">LET'S BUILD SOMETHING GREAT</span>
          </h2>
          <p className="text-gray-400 text-center mb-12">Get in touch for collaborations</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <motion.a
                href={`mailto:biryourhell@gmail.com`}
                className="flex items-center gap-4 glass-card rounded-2xl p-5 interactive hover:bg-white/10 transition"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-electric-blue/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-electric-blue" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-medium">biryourhell@gmail.com</p>
                </div>
              </motion.a>

              <motion.a
                href={`tel:+9779745827350`}
                className="flex items-center gap-4 glass-card rounded-2xl p-5 interactive hover:bg-white/10 transition"
                whileHover={{ x: 5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-neon-purple" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white font-medium">+977-9819726365 /+977 9745827350</p>
                </div>
              </motion.a>

              <motion.div
                className="flex items-center gap-4 glass-card rounded-2xl p-5"
              >
                <div className="w-12 h-12 rounded-xl bg-electric-blue/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-electric-blue" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white font-medium">Kathmandu, Nepal</p>
                </div>
              </motion.div>

              {/* Social Links */}
              <div className="flex gap-4 pt-4">
                <motion.a
                  href="https://github.com/brijesh055"
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-xl glass-card flex items-center justify-center interactive hover:bg-white/10 transition"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-6 h-6 text-gray-300" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/brijesh-yadav-a0769723b"
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-xl glass-card flex items-center justify-center interactive hover:bg-white/10 transition"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="w-6 h-6 text-gray-300" />
                </motion.a>
                <motion.a
                  href={`mailto:biryourhell@gmail.com`}
                  className="w-12 h-12 rounded-xl glass-card flex items-center justify-center interactive hover:bg-white/10 transition"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-6 h-6 text-gray-300" />
                </motion.a>
              </div>
            </div>

            {/* Contact Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="glass-card rounded-3xl p-6 space-y-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue transition"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-electric-blue focus:outline-none focus:ring-1 focus:ring-electric-blue transition resize-none"
                  placeholder="Your message..."
                  required
                />
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-electric-blue to-neon-purple font-semibold text-white interactive disabled:opacity-50"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : submitted ? (
                  "Message Sent!"
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </motion.button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Brijesh K. Yadav. All rights reserved.
        </p>
        
      </div>
    </footer>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#hero"
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full glass-card flex items-center justify-center interactive glow-cyan z-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-5 h-5 text-electric-blue" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

// ==================== MAIN APP ====================

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  const handleNavigate = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "skills", "experience", "projects", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!preloaderComplete && <Preloader onComplete={() => setPreloaderComplete(true)} />}
      </AnimatePresence>

      {preloaderComplete && (
        <>
          <CustomCursor />
          <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
          <main>
            <HeroSection onNavigate={handleNavigate} />
            <AboutSection />
            <SkillsSection />
            <ExperienceSection />
            <ProjectsSection />
            <GetCVSection />
            <ContactSection />
          </main>
          <Footer />
          <BackToTop />
        </>
      )}
    </>
  );
}
