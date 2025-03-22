import { FaGithub, FaInstagram, FaLinkedin, FaStackOverflow } from "react-icons/fa";
import logo from "../assets/nirusanHariharanLogo.webp";
import { motion } from "framer-motion";

const socials = [
  { icon: <FaLinkedin />, url: "https://www.linkedin.com/in/nirusan-hariharan-447463214/", label: "LinkedIn" },
  { icon: <FaGithub />, url: "https://github.com/Nirusan03", label: "GitHub" },
  { icon: <FaStackOverflow />, url: "https://stackoverflow.com/users/15590600/nirusan-hariharan", label: "Stack Overflow" },
  { icon: <FaInstagram />, url: "https://www.instagram.com/nirusan_hariharan/", label: "Instagram" },
];

const Navbar = () => (
  <motion.nav
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="flex items-center justify-between py-6 px-6 relative z-50"
  >
    <a href="/" aria-label="Home">
      <img src={logo} alt="Logo" className="w-[50px] h-[33px]" />
    </a>

    <div className="flex gap-4 text-2xl text-white">
      {socials.map(({ icon, url, label }, i) => (
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
  </motion.nav>
);

export default Navbar;