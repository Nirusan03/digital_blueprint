import { motion } from "framer-motion";
import { DiRedis } from "react-icons/di";
import {
  FaNodeJs, FaJava, FaPython, FaHtml5, FaCss3Alt, FaJs, FaRProject
} from "react-icons/fa";
import { RiReactjsLine } from "react-icons/ri";
import {
  SiAmazonecs, SiAngular, SiApachekafka, SiDocker, SiFastapi, SiFlask,
  SiJenkins, SiMongodb, SiMysql, SiSpring, SiSpringboot,
  SiVuedotjs, SiTypescript, SiJupyter, SiKaggle, SiGnubash, SiPycharm,
  SiUnity, SiUnrealengine, SiGooglecolab, SiVscodium
} from "react-icons/si";

const iconVariants = (duration) => ({
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
});

const Section = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: -100 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.5 }}
    className="mb-10"
  >
    <h3 className="text-2xl font-semibold text-white text-center mb-6">{title}</h3>
    <div className="flex flex-wrap justify-center gap-4">{children}</div>
  </motion.div>
);

const TechIcon = ({ Icon, label, duration, color }) => (
  <motion.div
    initial="initial"
    animate="animate"
    variants={iconVariants(duration)}
    className="p-3"
    title={label}
  >
    <Icon className={`text-6xl ${color || "text-white"}`} />
  </motion.div>
);

const Technologies = () => (
  <div className="pb-24 relative z-50 px-6">
    <motion.h2
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: -100 }}
      transition={{ duration: 1.5 }}
      className="my-20 text-center text-4xl text-white"
    >
      Technologies
    </motion.h2>

    {/* Programming Languages */}
    <Section title="Programming Languages">
      <TechIcon Icon={FaJava} label="Java" duration={1} color="text-[#f89820]" />
      <TechIcon Icon={FaPython} label="Python" duration={1.2} color="text-[#3776AB]" />
      <TechIcon Icon={FaRProject} label="R" duration={1.4} color="text-[#276DC3]" />
      <TechIcon Icon={SiGnubash} label="Bash" duration={1.6} color="text-gray-400" />
      <TechIcon Icon={SiTypescript} label="TypeScript" duration={1.8} color="text-[#3178c6]" />
      <TechIcon Icon={FaJs} label="JavaScript" duration={2.0} color="text-[#f0db4f]" />
    </Section>

    {/* Web Technologies */}
    <Section title="Frontend & Backend Technologies">
      <TechIcon Icon={RiReactjsLine} label="React.js" duration={1} color="text-cyan-400" />
      <TechIcon Icon={SiAngular} label="AngularJS" duration={1.2} color="text-red-500" />
      <TechIcon Icon={SiVuedotjs} label="Vue.js" duration={1.4} color="text-green-400" />
      <TechIcon Icon={FaHtml5} label="HTML" duration={1.6} color="text-[#e34c26]" />
      <TechIcon Icon={FaCss3Alt} label="CSS" duration={1.8} color="text-[#264de4]" />
      <TechIcon Icon={SiSpringboot} label="Spring Boot" duration={2.0} color="text-green-500" />
      <TechIcon Icon={SiSpring} label="Spring" duration={2.2} color="text-green-500" />
      <TechIcon Icon={FaNodeJs} label="Node.js" duration={2.4} color="text-green-500" />
      <TechIcon Icon={SiFastapi} label="FastAPI" duration={2.6} color="text-teal-500" />
      <TechIcon Icon={SiFlask} label="Flask" duration={2.8} color="text-teal-500" />
    </Section>

    {/* IDEs & Platforms */}
    <Section title="IDEs & Platforms">
      <TechIcon Icon={SiVscodium} label="VS Code" duration={1} color="text-[#007ACC]" />
      <TechIcon Icon={SiPycharm} label="PyCharm" duration={1.2} color="text-[#31A8FF]" />
      <TechIcon Icon={SiUnity} label="Unity" duration={1.4} />
      <TechIcon Icon={SiUnrealengine} label="Unreal Engine" duration={1.6} />
      <TechIcon Icon={SiGooglecolab} label="Google Colab" duration={1.8} color="text-yellow-400" />
      <TechIcon Icon={SiJupyter} label="Jupyter Notebook" duration={2} color="text-[#F37626]" />
      <TechIcon Icon={SiKaggle} label="Kaggle" duration={2.2} color="text-[#20BEFF]" />
    </Section>

    {/* Databases */}
    <Section title="Databases">
      <TechIcon Icon={SiMysql} label="MySQL" duration={1} color="text-blue-500" />
      <TechIcon Icon={SiMongodb} label="MongoDB" duration={1.2} color="text-cyan-500" />
      <TechIcon Icon={DiRedis} label="Redis" duration={1.4} color="text-red-700" />
    </Section>

    {/* Deployment & Pipelines */}
    <Section title="Deployment & Pipelines">
      <TechIcon Icon={SiDocker} label="Docker" duration={1} color="text-blue-500" />
      <TechIcon Icon={SiJenkins} label="Jenkins" duration={1.2} color="text-red-500" />
      <TechIcon Icon={SiAmazonecs} label="Amazon ECS" duration={1.4} color="text-orange-500" />
      <TechIcon Icon={SiApachekafka} label="Kafka" duration={1.6} />
    </Section>
  </div>
);

export default Technologies;