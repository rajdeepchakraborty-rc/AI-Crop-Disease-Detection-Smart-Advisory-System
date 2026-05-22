import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import phoneScan from '../assets/image_1.png';
import phoneDash from '../assets/image_2.png';
import homeBg from '../assets/image_3.png';

export default function HomePage({ onNavigate }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // --- 3D Leaf Vein Animation Setup ---
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null;
    scene.fog = new THREE.FogExp2(0x0B1E14, 0.008);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 8);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    function createVeinCurve(start, end, cpOffset, color) {
      const startVec = new THREE.Vector3(start.x, start.y, start.z);
      const endVec = new THREE.Vector3(end.x, end.y, end.z);
      const cp1 = new THREE.Vector3(start.x + cpOffset.x, start.y + cpOffset.y, start.z + cpOffset.z);
      const cp2 = new THREE.Vector3(end.x - cpOffset.x, end.y - cpOffset.y, end.z - cpOffset.z);
      const curve = new THREE.CubicBezierCurve3(startVec, cp1, cp2, endVec);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: color });
      return new THREE.Line(geometry, material);
    }

    const veinColor = 0x3aac5d;
    const veinHighlight = 0x65c97a;
    
    const midribPoints = [
      new THREE.Vector3(0, -2.2, 0.2), new THREE.Vector3(0, -1.2, 0.1),
      new THREE.Vector3(0, -0.2, 0), new THREE.Vector3(0, 0.8, -0.1),
      new THREE.Vector3(0, 1.8, -0.2), new THREE.Vector3(0, 2.5, -0.3)
    ];
    const midribCurve = new THREE.CatmullRomCurve3(midribPoints);
    const midribGeo = new THREE.BufferGeometry().setFromPoints(midribCurve.getPoints(60));
    const midrib = new THREE.Line(midribGeo, new THREE.LineBasicMaterial({ color: veinHighlight }));
    scene.add(midrib);

    const leftVeins = [
      { start: { x: 0, y: -1.5, z: 0.1 }, end: { x: -1.4, y: -1.2, z: 0.3 }, cp: { x: -0.7, y: -1.4, z: 0.2 } },
      { start: { x: 0, y: -0.7, z: 0.05 }, end: { x: -1.6, y: -0.2, z: 0.2 }, cp: { x: -0.9, y: -0.5, z: 0.15 } },
      { start: { x: 0, y: 0.1, z: 0 }, end: { x: -1.8, y: 0.6, z: 0.1 }, cp: { x: -0.9, y: 0.3, z: 0.05 } },
      { start: { x: 0, y: 0.9, z: -0.05 }, end: { x: -1.5, y: 1.2, z: 0.0 }, cp: { x: -0.8, y: 1.0, z: -0.02 } },
      { start: { x: 0, y: 1.5, z: -0.15 }, end: { x: -1.1, y: 1.9, z: -0.2 }, cp: { x: -0.6, y: 1.7, z: -0.18 } }
    ];
    const rightVeins = [
      { start: { x: 0, y: -1.5, z: 0.1 }, end: { x: 1.4, y: -1.2, z: 0.3 }, cp: { x: 0.7, y: -1.4, z: 0.2 } },
      { start: { x: 0, y: -0.7, z: 0.05 }, end: { x: 1.6, y: -0.2, z: 0.2 }, cp: { x: 0.9, y: -0.5, z: 0.15 } },
      { start: { x: 0, y: 0.1, z: 0 }, end: { x: 1.8, y: 0.6, z: 0.1 }, cp: { x: 0.9, y: 0.3, z: 0.05 } },
      { start: { x: 0, y: 0.9, z: -0.05 }, end: { x: 1.5, y: 1.2, z: 0.0 }, cp: { x: 0.8, y: 1.0, z: -0.02 } },
      { start: { x: 0, y: 1.5, z: -0.15 }, end: { x: 1.1, y: 1.9, z: -0.2 }, cp: { x: 0.6, y: 1.7, z: -0.18 } }
    ];

    const allVeins = [];
    [...leftVeins, ...rightVeins].forEach(v => {
      const curve = createVeinCurve(v.start, v.end, v.cp, veinColor);
      scene.add(curve);
      allVeins.push(curve);
    });

    const particleCount = 450;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i*3] = (Math.random() - 0.5) * 4.2;
      positions[i*3+1] = (Math.random() - 0.5) * 4.8;
      positions[i*3+2] = (Math.random() - 0.5) * 1.5 - 0.5;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
      color: 0x88dd99, size: 0.045, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending
    }));
    scene.add(particles);

    let time = 0, mouseX = 0, mouseY = 0;
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    function animate() {
      requestAnimationFrame(animate);
      time += 0.008;
      const swayX = Math.sin(time * 0.4) * 0.08;
      const swayY = Math.cos(time * 0.5) * 0.05;
      midrib.position.x = swayX;
      midrib.position.y = swayY;
      particles.rotation.y = Math.sin(time * 0.2) * 0.1;
      particles.rotation.x = Math.sin(time * 0.3) * 0.07;
      allVeins.forEach((vein) => { vein.position.x = swayX * 0.5; vein.position.y = swayY * 0.4; });
      particles.rotation.z = Math.sin(time * 0.15) * 0.05;
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.05;
      camera.lookAt(0, 0.2, 0);
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
    };
  }, []);

  // Colorful feature cards data with gradients and animations
  const features = [
    { 
      icon: '📸', 
      title: 'Upload Image', 
      desc: 'Take or upload a photo of your crop leaf',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      glowColor: 'rgba(59,130,246,0.3)',
      iconBg: 'bg-blue-500/20',
      delay: '0s'
    },
    { 
      icon: '🧠', 
      title: 'AI Analysis', 
      desc: '14 agents analyze disease, weather & treatments',
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      glowColor: 'rgba(168,85,247,0.3)',
      iconBg: 'bg-purple-500/20',
      delay: '0.1s'
    },
    { 
      icon: '🔬', 
      title: 'XAI Heatmap', 
      desc: 'See exactly where the disease was detected',
      gradient: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30',
      glowColor: 'rgba(249,115,22,0.3)',
      iconBg: 'bg-orange-500/20',
      delay: '0.2s'
    },
    { 
      icon: '💊', 
      title: 'Get Advisory', 
      desc: 'Receive organic or chemical treatment plans',
      gradient: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      glowColor: 'rgba(34,197,94,0.3)',
      iconBg: 'bg-green-500/20',
      delay: '0.3s'
    }
  ];

  return (
    <div className="home-page relative">
      {/* Canvas for 3D Leaf Vein Animation Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
        style={{ opacity: 0.85 }}
      />
      
      <div className="bg-animated fixed inset-0 -z-20 pointer-events-none" />
      
      {/* Hero Section */}
      <section className="hero-section relative z-10">
        <div className="hero-content">
          <div className="hero-badge-pill animate-pulse">
            <span className="badge-dot"></span>
            14-Agent AI Pipeline
          </div>
          <h1 className="hero-title animate-fade-in-up">
            Crop Diseases<br />
            <span className="hero-title-accent">Identifier</span>
          </h1>
          <p className="hero-desc animate-fade-in-up animation-delay-100">
            Supporting Farmers in <strong>Safeguarding</strong> their Crop Health
          </p>

          <div className="hero-pills animate-fade-in-up animation-delay-200">
            {['📸 CNN Vision','🧠 MobileNetV2','🔬 Grad-CAM XAI','🌦 Weather API','🤖 Groq LLM','🔊 Voice','📊 Memory','🔮 What-If'].map(p => (
              <span className="pill" key={p}>{p}</span>
            ))}
          </div>

          <button className="btn btn-primary hero-cta animate-fade-in-up animation-delay-300 hover:scale-105 transition-transform" onClick={() => onNavigate('dashboard')}>
            🚀 Start Analysis
          </button>
        </div>

        <div className="hero-mockups">
          <div className="mockup-track" style={{ left: '10%' }}>
            <img src={phoneDash} alt="Dashboard" className="mockup-card hover:scale-110 transition-transform duration-300" />
            <img src={phoneScan} alt="Scanner" className="mockup-card hover:scale-110 transition-transform duration-300" />
            <img src={homeBg} alt="Dashboard" className="mockup-card hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="mockup-track-reverse" style={{ right: '5%' }}>
            <img src={homeBg} alt="Scanner" className="mockup-card hover:scale-110 transition-transform duration-300" />
            <img src={phoneDash} alt="Dashboard" className="mockup-card hover:scale-110 transition-transform duration-300" />
            <img src={phoneScan} alt="Scanner" className="mockup-card hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </section>

      {/* Features Section with Premium Black Glass Cards */}
<section className="features-section relative z-10">
  <h2 className="features-heading animate-fade-in-up">How It Works</h2>
  <div className="features-grid">
    {features.map((feature, i) => (
      <div 
        key={i}
        className="feature-card premium-glass group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 cursor-pointer animate-fade-in-up"
        style={{ animationDelay: feature.delay }}
      >
        {/* Premium Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-xl" />
        
        {/* Glass Reflection Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-[#2AE06E]/50 to-transparent animate-border-rotate" />
        </div>
        
        {/* Inner Glass Highlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Corner Accents */}
        <div className="corner-accent corner-tl opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="corner-accent corner-tr opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="corner-accent corner-bl opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="corner-accent corner-br opacity-0 group-hover:opacity-100 transition-all duration-300" />
        
        {/* Icon Glow Effect */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
             style={{ 
               background: `radial-gradient(circle, ${feature.glowColor}, transparent)`,
               filter: 'blur(20px)'
             }} 
        />
        
        {/* Icon Container */}
        <div className="relative z-10 mb-6">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${feature.iconBg}`}
               style={{ boxShadow: `0 0 20px ${feature.glowColor}` }}>
            <div className="feature-icon text-4xl group-hover:animate-bounce">
              {feature.icon}
            </div>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="relative z-10 feature-title text-xl font-bold mb-3 text-center transition-all duration-300 group-hover:scale-105">
          {feature.title}
        </h3>
        
        {/* Description */}
        <p className="relative z-10 feature-desc text-gray-300 text-sm leading-relaxed text-center">
          {feature.desc}
        </p>
        
        {/* Bottom Glow Line */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#2AE06E] to-transparent group-hover:w-full transition-all duration-500" />
        
        {/* Hover Shadow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
             style={{ boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 30px ${feature.glowColor}` }} />
      </div>
    ))}
  </div>
</section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .feature-card-colored {
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .feature-card-colored::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s;
        }
        
        .feature-card-colored:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
}