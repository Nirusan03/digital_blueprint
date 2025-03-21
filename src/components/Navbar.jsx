import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import logo from "../assets/nirusanHariharanLogo.webp";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between py-6 relative z-50 px-6">
            {/* Logo on the Left */}
            <div className="flex items-center">
                <a href="/" aria-label="Home">
                    <img src={logo} 
                         alt="Logo" 
                         className="w-[50px] h-[33px]" />
                </a>
            </div>

            {/* LinkedIn Icons on the Right */}
            <div className="flex items-center gap-4 text-2xl">
                <a href="https://www.linkedin.com/in/nirusan-hariharan-447463214/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="hover:text-blue-500 transition">
                        <FaLinkedin />
                </a>

                <a href="https://github.com/Nirusan03" 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Github"
                    className="hover:text-blue-500 transition">
                        <FaGithub />
                </a>

                <a href="https://www.instagram.com/nirusan_hariharan/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-blue-500 transition">
                        <FaInstagram />
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
