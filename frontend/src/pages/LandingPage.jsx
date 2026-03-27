import { Link } from "react-router-dom";
import {
  Shield, Video, MessageSquare, FileText, ChevronRight,
  Scale, Clock, Star, CheckCircle, ArrowRight, Lock, Users, Award
} from "lucide-react";

/* ─── reusable styles ─── */
const NAVY = "#0c1f3d";
const NAVY2 = "#162d4a";
const GOLD  = "#c9a84c";
const GOLD2 = "#a67c3a";

/* ────────────────────────── Header ────────────────────────── */
const LandingHeader = () => (
  <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 h-16 border-b" style={{ background: NAVY, borderColor: 'rgba(201,168,76,0.15)' }}>
    {/* Logo */}
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ background: NAVY2, borderColor: 'rgba(201,168,76,0.3)' }}>
        <img src="/yochat-logo.svg" alt="LexConnect" className="w-6 h-6" />
      </div>
      <span className="text-lg font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
        Lex<span style={{ color: GOLD }}>Connect</span>
      </span>
    </Link>

    {/* Nav links (desktop) */}
    <nav className="hidden md:flex items-center gap-6">
      {["Features", "How It Works", "Practice Areas", "Security"].map((item) => (
        <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-[#94a3b8] hover:text-white transition-colors">
          {item}
        </a>
      ))}
    </nav>

    {/* CTAs */}
    <div className="flex items-center gap-3">
      <Link to="/login" className="hidden sm:inline-flex text-sm font-medium text-[#94a3b8] hover:text-white transition-colors px-3 py-1.5">
        Sign In
      </Link>
      <Link to="/signup" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, ${GOLD2}, ${GOLD})` }}>
        Get Started <ArrowRight size={14} />
      </Link>
    </div>
  </header>
);

/* ────────────────────────── Hero ────────────────────────── */
const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-16 overflow-hidden" style={{ background: `linear-gradient(150deg, ${NAVY} 0%, ${NAVY2} 60%, #1e3a5c 100%)` }}>
    {/* Decorative grid */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: `linear-gradient(${GOLD} 1px, transparent 1px), linear-gradient(90deg, ${GOLD} 1px, transparent 1px)`, backgroundSize: '80px 80px' }}></div>
    {/* Glow blobs */}
    <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)`, transform: 'translate(30%, -20%)' }}></div>
    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, rgba(30,58,92,0.6) 0%, transparent 65%)`, transform: 'translate(-20%, 20%)' }}></div>

    <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 items-center py-20">
      {/* Left — copy */}
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ background: 'rgba(201,168,76,0.1)', borderColor: 'rgba(201,168,76,0.3)', color: GOLD }}>
          <Shield size={12} /> Trusted by 500+ clients &amp; attorneys
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          Legal Consultations,{" "}
          <span style={{ color: GOLD }}>Reimagined</span>
        </h1>

        <p className="text-lg text-[#94a3b8] leading-relaxed max-w-lg">
          Connect with your attorney through HD video calls, end-to-end encrypted messaging, and a secure client portal — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white shadow-xl transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: `linear-gradient(135deg, ${GOLD2}, ${GOLD})`, boxShadow: `0 8px 32px rgba(201,168,76,0.25)` }}>
            Get Started — It's Free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white border transition-all hover:bg-white/5" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
            Sign In to Your Portal
          </Link>
        </div>

        {/* Trust row */}
        <div className="flex items-center gap-6 pt-2">
          {[
            { icon: <Lock size={14} />, text: "256-bit SSL" },
            { icon: <Shield size={14} />, text: "Privilege Protected" },
            { icon: <CheckCircle size={14} />, text: "HIPAA Compliant" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: '#6b7a94' }}>
              <span style={{ color: GOLD }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right — visual */}
      <div className="hidden lg:flex justify-center items-center">
        <HeroVisual />
      </div>
    </div>
  </section>
);

/* mock UI card shown in hero */
const HeroVisual = () => (
  <div className="relative w-full max-w-md">
    {/* Main card — video call mock */}
    <div className="rounded-3xl overflow-hidden shadow-2xl border" style={{ background: '#0f2542', borderColor: 'rgba(201,168,76,0.2)' }}>
      {/* "Video call" header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#c9a84c]/20 flex items-center justify-center">
            <Video size={14} style={{ color: GOLD }} />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Video Consultation</p>
            <p className="text-[10px]" style={{ color: '#6b7a94' }}>Atty. Jane Doe · In progress</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-[10px] text-green-400 font-medium">Live</span>
        </div>
      </div>

      {/* Video area */}
      <div className="relative h-52" style={{ background: 'linear-gradient(135deg, #0c1f3d, #1e3a5c)' }}>
        {/* Main video placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center text-3xl" style={{ borderColor: 'rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.1)' }}>
            👩‍⚖️
          </div>
        </div>
        {/* Self-view pip */}
        <div className="absolute bottom-3 right-3 w-20 h-14 rounded-xl border flex items-center justify-center" style={{ background: '#162d4a', borderColor: 'rgba(255,255,255,0.15)' }}>
          <div className="text-xl">👤</div>
        </div>
        {/* Call controls */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {[
            { icon: '🎙', label: 'Mute', bg: 'rgba(255,255,255,0.1)' },
            { icon: '📹', label: 'Video', bg: 'rgba(255,255,255,0.1)' },
            { icon: '📞', label: 'End', bg: 'rgba(239,68,68,0.7)' },
          ].map((btn, i) => (
            <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer" style={{ background: btn.bg }}>
              {btn.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Chat preview below video */}
      <div className="p-4 space-y-2.5">
        <ChatBubble align="left" name="Atty. Jane Doe" text="I've reviewed the opposing counsel's motion. We have a strong counter-argument." time="2:14 PM" />
        <ChatBubble align="right" name="You" text="That's reassuring. When can we file the response?" time="2:15 PM" />
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 h-8 rounded-full px-3 flex items-center text-xs" style={{ background: 'rgba(255,255,255,0.06)', color: '#6b7a94' }}>
            Type a message...
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GOLD2}, ${GOLD})` }}>
            <ArrowRight size={13} color="white" />
          </div>
        </div>
      </div>
    </div>

    {/* Floating case badge */}
    <div className="absolute -top-4 -left-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border" style={{ borderColor: '#d1dae6' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#eef1f5' }}>
        <FileText size={16} style={{ color: NAVY }} />
      </div>
      <div>
        <p className="text-xs font-bold" style={{ color: NAVY }}>Case C-1045</p>
        <p className="text-[10px]" style={{ color: '#6b7a94' }}>Under Review</p>
      </div>
    </div>

    {/* Floating lock badge */}
    <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 border" style={{ borderColor: '#d1dae6' }}>
      <Lock size={15} style={{ color: GOLD2 }} />
      <p className="text-xs font-bold" style={{ color: NAVY }}>End-to-End Encrypted</p>
    </div>
  </div>
);

const ChatBubble = ({ align, name, text, time }) => (
  <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
    <div className="max-w-[80%] space-y-0.5">
      <div className={`px-3 py-2 rounded-2xl text-xs text-white leading-relaxed ${align === 'right' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`} style={{ background: align === 'right' ? `linear-gradient(135deg, ${NAVY}, ${NAVY2})` : 'rgba(255,255,255,0.1)' }}>
        {text}
      </div>
      <p className={`text-[10px] text-[#6b7a94] ${align === 'right' ? 'text-right' : 'text-left'}`}>{time}</p>
    </div>
  </div>
);

/* ────────────────────────── Stats Bar ────────────────────────── */
const StatsBar = () => (
  <section className="py-12 border-y" style={{ background: '#f4f6f9', borderColor: '#d1dae6' }}>
    <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {[
        { value: "500+", label: "Clients Served" },
        { value: "98%", label: "Client Satisfaction" },
        { value: "12+", label: "Practice Areas" },
        { value: "24/7", label: "Secure Access" },
      ].map((s, i) => (
        <div key={i}>
          <p className="text-3xl font-bold" style={{ color: NAVY, fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
          <p className="text-sm mt-1" style={{ color: '#6b7a94' }}>{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);

/* ────────────────────────── Features ────────────────────────── */
const features = [
  {
    icon: <Video size={22} />,
    title: "HD Video Consultations",
    desc: "Meet face-to-face with your attorney from anywhere. Crystal-clear video with end-to-end encryption keeps every conversation private.",
    iconBg: "#eef1f5", iconColor: NAVY,
  },
  {
    icon: <MessageSquare size={22} />,
    title: "Real-Time Secure Chat",
    desc: "Send messages, ask quick questions, and stay updated on your case — all through encrypted, privilege-protected messaging.",
    iconBg: "#fef9c3", iconColor: "#854d0e",
  },
  {
    icon: <FileText size={22} />,
    title: "Case Management Portal",
    desc: "Track your case status, upcoming deadlines, and attorney updates in a clean, intuitive dashboard built for clients.",
    iconBg: "#f5f3ff", iconColor: "#7c3aed",
  },
  {
    icon: <Shield size={22} />,
    title: "Attorney-Client Privilege",
    desc: "Every message and call is protected. Your communications are encrypted at rest and in transit — your secrets stay yours.",
    iconBg: "#ecfdf5", iconColor: "#047857",
  },
];

const Features = () => (
  <section id="features" className="py-24 px-6" style={{ background: 'white' }}>
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        tag="Platform Features"
        title="Everything you need for a seamless legal experience"
        subtitle="LexConnect brings attorney-client communications into the 21st century — secure, simple, and always available."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
        {features.map((f, i) => (
          <div key={i} className="group p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default" style={{ borderColor: '#d1dae6' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: f.iconBg, color: f.iconColor }}>
              {f.icon}
            </div>
            <h3 className="font-bold mb-2" style={{ color: NAVY }}>{f.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#4b5c7e' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ────────────────────────── How It Works ────────────────────────── */
const steps = [
  { num: "01", title: "Create Your Account", desc: "Sign up in under a minute with your email or Google account. No credit card required." },
  { num: "02", title: "Connect With Your Attorney", desc: "Your attorney will be added to your portal. Start chatting or schedule a video consultation instantly." },
  { num: "03", title: "Manage Your Case", desc: "Track progress, receive updates, share documents, and communicate — all from your secure client portal." },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 px-6" style={{ background: '#f4f6f9' }}>
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        tag="How It Works"
        title="Up and running in minutes"
        subtitle="Getting connected with your legal team has never been easier."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 relative">
        {/* Connector line (desktop) */}
        <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px" style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD2})`, opacity: 0.3 }}></div>

        {steps.map((step, i) => (
          <div key={i} className="relative flex flex-col items-center text-center p-8 rounded-2xl border bg-white shadow-sm" style={{ borderColor: '#d1dae6' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-5 shadow-md" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY2})`, color: GOLD, fontFamily: "'Playfair Display', serif", border: `1px solid rgba(201,168,76,0.3)` }}>
              {step.num}
            </div>
            <h3 className="font-bold text-lg mb-3" style={{ color: NAVY }}>{step.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#4b5c7e' }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ────────────────────────── Practice Areas ────────────────────────── */
const areas = [
  "Corporate Law", "Real Estate", "Intellectual Property", "Family Law",
  "Criminal Defense", "Employment Law", "Personal Injury", "Immigration",
  "Estate Planning", "Contract Disputes", "Mergers & Acquisitions", "Tax Law",
];

const PracticeAreas = () => (
  <section id="practice-areas" className="py-24 px-6" style={{ background: 'white' }}>
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        tag="Practice Areas"
        title="Expert legal counsel across all disciplines"
        subtitle="Our network of attorneys covers a comprehensive range of legal matters."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-14">
        {areas.map((area, i) => (
          <div key={i} className="flex items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-default group" style={{ borderColor: '#d1dae6', background: '#fafbfc' }}>
            <CheckCircle size={15} className="flex-shrink-0" style={{ color: GOLD2 }} />
            <span className="text-sm font-medium" style={{ color: NAVY }}>{area}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ────────────────────────── Security ────────────────────────── */
const securityItems = [
  { icon: <Lock size={20} />, title: "256-bit SSL Encryption", desc: "All data in transit is encrypted using industry-standard TLS 1.3 protocols." },
  { icon: <Shield size={20} />, title: "Privilege Protected", desc: "Attorney-client privilege applies to all communications on LexConnect." },
  { icon: <CheckCircle size={20} />, title: "GDPR & CCPA Compliant", desc: "Your personal data is handled in accordance with global privacy regulations." },
  { icon: <Users size={20} />, title: "Role-Based Access", desc: "Strict access controls ensure only authorized parties can view your case." },
];

const Security = () => (
  <section id="security" className="py-24 px-6" style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY2} 100%)` }}>
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        tag="Security & Privacy"
        title="Your trust is our foundation"
        subtitle="LexConnect is built with security-first architecture to protect every attorney-client interaction."
        light
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
        {securityItems.map((item, i) => (
          <div key={i} className="p-6 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(201,168,76,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(201,168,76,0.12)', color: GOLD }}>
              {item.icon}
            </div>
            <h3 className="font-bold text-white mb-2">{item.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ────────────────────────── Testimonials ────────────────────────── */
const testimonials = [
  { quote: "LexConnect transformed how we communicate with clients. Video consultations cut turnaround time in half.", name: "Sarah Mitchell", role: "Corporate Attorney", rating: 5 },
  { quote: "Having everything — chats, calls, documents — in one secure place gives me real peace of mind as a client.", name: "James Rodriguez", role: "Client, Real Estate Case", rating: 5 },
  { quote: "The encrypted messaging is seamless. I can discuss sensitive matters without worrying about confidentiality.", name: "Priya Nair", role: "Senior Partner", rating: 5 },
];

const Testimonials = () => (
  <section className="py-24 px-6" style={{ background: '#f4f6f9' }}>
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        tag="Testimonials"
        title="Trusted by attorneys and clients alike"
        subtitle="Hear from the people who rely on LexConnect every day."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white rounded-2xl p-7 border shadow-sm" style={{ borderColor: '#d1dae6' }}>
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array(t.rating).fill(0).map((_, j) => (
                <Star key={j} size={14} fill={GOLD} style={{ color: GOLD }} />
              ))}
            </div>
            <p className="text-sm leading-relaxed mb-6 italic" style={{ color: '#4b5c7e' }}>"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY2})` }}>
                {t.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: NAVY }}>{t.name}</p>
                <p className="text-xs" style={{ color: '#6b7a94' }}>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ────────────────────────── CTA Banner ────────────────────────── */
const CTABanner = () => (
  <section className="py-24 px-6" style={{ background: 'white' }}>
    <div className="max-w-3xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border mb-6" style={{ background: 'rgba(201,168,76,0.08)', borderColor: 'rgba(201,168,76,0.3)', color: GOLD2 }}>
        <Award size={12} /> Get started today — no credit card required
      </div>
      <h2 className="text-4xl font-bold mb-5" style={{ color: NAVY, fontFamily: "'Playfair Display', serif" }}>
        Ready to experience smarter legal consultations?
      </h2>
      <p className="text-lg mb-10" style={{ color: '#4b5c7e' }}>
        Join hundreds of clients and attorneys already using LexConnect for secure, efficient legal communications.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white shadow-xl transition-all hover:opacity-90 hover:-translate-y-0.5" style={{ background: `linear-gradient(135deg, ${NAVY}, ${NAVY2})`, boxShadow: `0 8px 32px rgba(12,31,61,0.18)` }}>
          Create Your Account <ArrowRight size={16} />
        </Link>
        <Link to="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold border transition-all hover:bg-gray-50" style={{ borderColor: '#d1dae6', color: NAVY }}>
          Sign In <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  </section>
);

/* ────────────────────────── Footer ────────────────────────── */
const Footer = () => (
  <footer className="border-t py-10 px-6" style={{ background: NAVY, borderColor: 'rgba(201,168,76,0.15)' }}>
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center border" style={{ background: NAVY2, borderColor: 'rgba(201,168,76,0.3)' }}>
          <img src="/yochat-logo.svg" alt="LexConnect" className="w-5 h-5" />
        </div>
        <span className="font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          Lex<span style={{ color: GOLD }}>Connect</span>
        </span>
      </div>
      <p className="text-xs text-center" style={{ color: '#6b7a94' }}>
        © {new Date().getFullYear()} LexConnect. All rights reserved. · Attorney-client privilege protected.
      </p>
      <div className="flex gap-5">
        {["Privacy Policy", "Terms of Service", "Security"].map((item) => (
          <a key={item} href="#" className="text-xs hover:text-white transition-colors" style={{ color: '#6b7a94' }}>{item}</a>
        ))}
      </div>
    </div>
  </footer>
);

/* ────────────────────────── Helpers ────────────────────────── */
const SectionHeader = ({ tag, title, subtitle, light = false }) => (
  <div className="text-center max-w-2xl mx-auto">
    <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4" style={{ background: light ? 'rgba(201,168,76,0.15)' : 'rgba(12,31,61,0.07)', color: light ? GOLD : GOLD2, border: `1px solid ${light ? 'rgba(201,168,76,0.3)' : 'rgba(12,31,61,0.12)'}` }}>
      {tag}
    </span>
    <h2 className="text-3xl font-bold mb-4" style={{ color: light ? 'white' : NAVY, fontFamily: "'Playfair Display', serif" }}>
      {title}
    </h2>
    <p className="text-base leading-relaxed" style={{ color: light ? '#94a3b8' : '#4b5c7e' }}>{subtitle}</p>
  </div>
);

/* ────────────────────────── Page ────────────────────────── */
const LandingPage = () => (
  <div className="antialiased">
    <LandingHeader />
    <main>
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <PracticeAreas />
      <Security />
      <Testimonials />
      <CTABanner />
    </main>
    <Footer />
  </div>
);

export default LandingPage;
