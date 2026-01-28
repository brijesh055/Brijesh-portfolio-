import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import { Mail, Phone, Linkedin, MapPin, Code2, Briefcase, GraduationCap, FolderGit2 } from "lucide-react";

function Blob() {
  return (
    <Float speed={1.4} rotationIntensity={0.8} floatIntensity={1.2}>
      <mesh scale={2.3}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial distort={0.35} speed={2} roughness={0.4} metalness={0.2} />
      </mesh>
    </Float>
  );
}

function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 4, 4]} intensity={1.2} />
        <Stars radius={60} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
        <Blob />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.1} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />
    </div>
  );
}

const data = {
  name: "Brijesh Kumar Yadav",
  title: "Full Stack Software Engineer (Frontend + Backend)",
  location: "Kathmandu, Nepal",
  email: "biryourhell@gmail.com",
  phone: "+977-9819726365",
  linkedin: "https://linkedin.com/in/brijesh-yadav-a0769723b",
  summary:
    "Software engineer with experience in C#/.NET, PHP (Laravel), WordPress and modern web development. I build responsive, scalable web apps with clean UI and solid backend logic.",
  skills: [
    { name: "HTML5", level: 95 },
    { name: "CSS3", level: 90 },
    { name: "JavaScript", level: 85 },
    { name: "React", level: 75 },
    { name: "C#/.NET", level: 80 },
    { name: "PHP/Laravel", level: 75 },
    { name: "WordPress", level: 85 },
    { name: "SQL", level: 75 },
    { name: "Git", level: 80 },
    { name: "REST APIs", level: 75 },
  ],
  experience: [
    {
      role: "Junior Developer",
      company: "Horizon Technology",
      period: "04/2080 - 11/2080",
      text: "Worked on C#/.NET web applications, development and maintenance, team collaboration, and delivery.",
    },
    {
      role: "Junior Developer",
      company: "ACAN",
      period: "08/2079 - 03/2080",
      text: "WordPress development: customizations, responsive UI, cross-browser support, client requirements.",
    },
    {
      role: "Junior Developer",
      company: "Bhibhuti Solution",
      period: "11/2080 - 01/2081",
      text: "PHP (Laravel) development: dynamic apps, debugging, and collaboration with senior developers.",
    },
  ],
  education: [
    {
      degree: "BSc (Hons) CSSE",
      school: "Patan College for Professional Studies (University of Bedfordshire)",
      year: "2024",
    },
    { degree: "12th Grade", school: "Arniko Awasiya Higher Secondary School", year: "2019" },
    { degree: "10th Grade", school: "Happyland Higher Secondary School", year: "2017" },
  ],
  projects: [
    {
      title: "E-Commerce Platform",
      desc: "Full-stack e-commerce app with catalog, cart and payment-ready structure.",
      tags: ["Laravel", "MySQL", "Bootstrap"],
    },
    {
      title: "Corporate Website",
      desc: "Responsive WordPress website with custom theme and plugin integrations.",
      tags: ["WordPress", "PHP", "CSS"],
    },
    {
      title: "Inventory Management System",
      desc: "Stock tracking, reports and supplier management system.",
      tags: ["C#/.NET", "SQL Server"],
    },
  ],
};

function SkillBar({ name, level }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-200">{name}</span>
        <span className="text-gray-400">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
        />
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("about");

  const tabs = useMemo(
    () => [
      { id: "about", label: "About", icon: Code2 },
      { id: "experience", label: "Experience", icon: Briefcase },
      { id: "education", label: "Education", icon: GraduationCap },
      { id: "projects", label: "Projects", icon: FolderGit2 },
    ],
    []
  );

  return (
    <div className="min-h-screen text-white">
      <header className="relative overflow-hidden">
        <Hero3D />

        <div className="mx-auto max-w-6xl px-6 pt-20 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          >
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                <MapPin className="w-4 h-4 text-cyan-300" />
                <span className="text-sm text-gray-200">{data.location}</span>
              </div>

              <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  {data.name}
                </span>
              </h1>
              <p className="mt-3 text-lg md:text-xl text-gray-300">{data.title}</p>
              <p className="mt-5 text-gray-300 max-w-2xl leading-relaxed">{data.summary}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={`mailto:${data.email}`}
                  className="glow inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/25 transition"
                >
                  <Mail className="w-5 h-5 text-cyan-300" />
                  <span>Email</span>
                </a>

                <a
                  href={`tel:${data.phone}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
                >
                  <Phone className="w-5 h-5 text-gray-200" />
                  <span>Call</span>
                </a>

                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition"
                >
                  <Linkedin className="w-5 h-5 text-gray-200" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur">
                <div className="flex items-center gap-4">
                  <img
                    src="/bky.png"
                    alt={data.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-white/10"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div>
                    <p className="text-sm text-gray-400">Profile</p>
                    <p className="text-lg font-semibold">{data.name}</p>
                    <p className="text-sm text-gray-300">{data.title}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
                    <p className="text-xs text-gray-400">Role</p>
                    <p className="mt-1 font-semibold">Full Stack</p>
                  </div>
                  <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
                    <p className="text-xs text-gray-400">Stack</p>
                    <p className="mt-1 font-semibold">React + .NET</p>
                  </div>
                </div>

                <p className="mt-5 text-xs text-gray-400">
                  Tip: If your image doesn't show, keep <b>bky.png</b> inside <b>public/</b>.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <div className="sticky top-3 z-20">
          <div className="mt-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur p-2 flex flex-wrap gap-2">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={
                    "px-4 py-2 rounded-2xl text-sm flex items-center gap-2 transition border " +
                    (active
                      ? "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-white/20"
                      : "bg-white/5 border-white/10 hover:bg-white/10")
                  }
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {tab === "about" && (
          <section className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 rounded-3xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-xl font-bold">Technical Skills</h2>
              <p className="text-sm text-gray-400 mt-1">Progress style (percentage)</p>

              <div className="mt-6 space-y-4">
                {data.skills.map((s) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 rounded-3xl bg-white/5 border border-white/10 p-6">
              <h2 className="text-xl font-bold">What I do</h2>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-black/30 border border-white/10 p-5">
                  <p className="font-semibold">Frontend</p>
                  <p className="text-sm text-gray-400 mt-2">
                    React, responsive UI, animations, clean UX, and modern components.
                  </p>
                </div>
                <div className="rounded-2xl bg-black/30 border border-white/10 p-5">
                  <p className="font-semibold">Backend</p>
                  <p className="text-sm text-gray-400 mt-2">
                    C#/.NET, Laravel, SQL, REST APIs, authentication and scalable logic.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "experience" && (
          <section className="mt-10 space-y-4">
            {data.experience.map((x) => (
              <div key={x.company} className="rounded-3xl bg-white/5 border border-white/10 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-cyan-300">{x.role}</h3>
                    <p className="text-gray-200">{x.company}</p>
                  </div>
                  <p className="text-sm text-gray-400">{x.period}</p>
                </div>
                <p className="mt-3 text-gray-300">{x.text}</p>
              </div>
            ))}
          </section>
        )}

        {tab === "education" && (
          <section className="mt-10 space-y-4">
            {data.education.map((e) => (
              <div key={e.degree} className="rounded-3xl bg-white/5 border border-white/10 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-purple-300">{e.degree}</h3>
                    <p className="text-gray-200">{e.school}</p>
                  </div>
                  <p className="text-sm text-gray-400">{e.year}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {tab === "projects" && (
          <section className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.projects.map((p) => (
              <div key={p.title} className="rounded-3xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition">
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="text-sm text-gray-400 mt-2">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {data.name}
          </p>
          <p className="text-sm text-gray-500">Built with React + Vite + Three.js</p>
        </div>
      </footer>
    </div>
  );
}
