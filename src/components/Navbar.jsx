import { useState, useEffect } from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaStackOverflow } from "react-icons/fa";
import logo from "../assets/nirusanHariharanLogo.webp";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Technologies", href: "#technologies" },
  { label: "Projects",     href: "#projects"     },
  { label: "Experience",   href: "#experience"   },
  { label: "Contact",      href: "#contact"      },
];

const SOCIALS = [
  { icon: <FaLinkedin />,      url: "https://www.linkedin.com/in/nirusan-hariharan-447463214/", label: "LinkedIn"       },
  { icon: <FaGithub />,        url: "https://github.com/Nirusan03",                              label: "GitHub"         },
  { icon: <FaStackOverflow />, url: "https://stackoverflow.com/users/15590600/nirusan-hariharan",label: "Stack Overflow" },
  { icon: <FaInstagram />,     url: "https://www.instagram.com/nirusan_hariharan/",              label: "Instagram"      },
];

const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [activeSection, setActive] = useState("");

  // Shrink / blur navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-based active section — works for sections of any height
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const OFFSET = 120; // px below navbar top to count as "entered"

    const detect = () => {
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= OFFSET) current = id; // keep overwriting → last one wins
      }
      setActive(current);
    };

    window.addEventListener("scroll", detect, { passive: true });
    detect(); // run on mount
    return () => window.removeEventListener("scroll", detect);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (href) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }, menuOpen ? 300 : 0);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300
                    ${scrolled
                      ? "bg-black/75 backdrop-blur-md border-b border-stone-800/60 py-3"
                      : "bg-transparent py-5"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <a
            href="/"
            aria-label="Home"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            <img src={logo} alt="Logo" className="w-[46px] h-[30px]" />
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activeSection === href.slice(1);
              return (
                <li key={href}>
                  <button
                    onClick={() => scrollTo(href)}
                    className={`relative px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200
                                ${isActive ? "text-white" : "text-stone-400 hover:text-white"}`}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="pill"
                        className="absolute inset-0 rounded-md bg-stone-800 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Desktop social icons */}
          <div className="hidden md:flex items-center gap-4 text-xl text-white">
            {SOCIALS.map(({ icon, url, label }, i) => (
              <motion.a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.2, color: "#3b82f6" }}
                className="transition"
              >
                {icon}
              </motion.a>
            ))}
          </div>

          {/* Mobile hamburger / close */}
          <button
            className="md:hidden relative z-[110] p-2 text-white"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-full bg-white origin-left rounded-full"
                transition={{ duration: 0.25 }}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                className="block h-0.5 w-full bg-white rounded-full"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-full bg-white origin-left rounded-full"
                transition={{ duration: 0.25 }}
              />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile full-screen overlay ─────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed inset-0 z-[99] bg-black/95 backdrop-blur-xl
                       flex flex-col px-8 pt-28 pb-12"
          >
            {/* Nav links */}
            <ul className="flex flex-col gap-1 flex-1">
              {NAV_LINKS.map(({ label, href }, i) => {
                const isActive = activeSection === href.slice(1);
                return (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                  >
                    <button
                      onClick={() => scrollTo(href)}
                      className={`w-full text-left py-4 text-2xl font-semibold tracking-tight
                                  border-b border-stone-800 transition-colors duration-200
                                  ${isActive ? "text-white" : "text-stone-400 hover:text-white"}`}
                    >
                      <span className="flex items-center justify-between">
                        {label}
                        {isActive && (
                          <span className="text-xs font-normal text-blue-400 tracking-widest uppercase">
                            Current
                          </span>
                        )}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>

            {/* Socials at bottom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="pt-8"
            >
              <div className="flex flex-col">
                {SOCIALS.map(({ icon, url, label }, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-3
                               border-b border-stone-900 text-stone-400 hover:text-white
                               transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{icon}</span>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <svg
                      className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
