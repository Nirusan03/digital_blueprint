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
  { icon: <FaLinkedin />,     url: "https://www.linkedin.com/in/nirusan-hariharan-447463214/", label: "LinkedIn"       },
  { icon: <FaGithub />,       url: "https://github.com/Nirusan03",                              label: "GitHub"         },
  { icon: <FaStackOverflow />,url: "https://stackoverflow.com/users/15590600/nirusan-hariharan",label: "Stack Overflow" },
  { icon: <FaInstagram />,    url: "https://www.instagram.com/nirusan_hariharan/",              label: "Instagram"      },
];

const Navbar = () => {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeSection, setActive]  = useState("");

  // Shrink / blur navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight active section via IntersectionObserver
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.getElementById(href.slice(1));
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300
                  ${scrolled
                    ? "bg-black/70 backdrop-blur-md border-b border-stone-800/60 py-3"
                    : "bg-transparent py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <a href="/" aria-label="Home" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block w-5 h-0.5 bg-white origin-center transition-all"
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-5 h-0.5 bg-white"
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block w-5 h-0.5 bg-white origin-center transition-all"
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-black/90 backdrop-blur-md border-t border-stone-800/60"
          >
            <ul className="flex flex-col px-6 py-4 gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium
                               text-stone-300 hover:text-white hover:bg-stone-800 transition"
                  >
                    {label}
                  </button>
                </li>
              ))}
              {/* Socials row in mobile menu */}
              <li className="flex gap-4 pt-3 px-3 text-xl text-stone-400">
                {SOCIALS.map(({ icon, url, label }, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="hover:text-white transition"
                  >
                    {icon}
                  </a>
                ))}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
