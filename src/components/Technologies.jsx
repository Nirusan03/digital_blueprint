import { motion } from "framer-motion";
import { DiRedis } from "react-icons/di";
import {
  FaNodeJs, FaJava, FaPython, FaHtml5, FaCss3Alt, FaJs, FaRProject, FaAws
} from "react-icons/fa";
import { RiReactjsLine } from "react-icons/ri";
import {
  SiAmazonecs, SiAmazonec2, SiAmazoneks, SiAngular, SiApachekafka, SiDocker,
  SiFastapi, SiFlask, SiJenkins, SiMongodb, SiMysql, SiSpring, SiSpringboot,
  SiVuedotjs, SiTypescript, SiJupyter, SiKaggle, SiGnubash, SiPycharm,
  SiUnity, SiUnrealengine, SiGooglecolab, SiVscodium, SiKotlin,
  SiSwift, SiNextdotjs, SiBlazor, SiDotnet, SiAndroidstudio,
  SiLangchain, SiFirebase, SiPostgresql, SiSupabase,
  SiGithubactions
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

const TextTech = ({ label, duration, color }) => (
  <motion.div
    initial="initial"
    animate="animate"
    variants={iconVariants(duration)}
    className="p-3"
    title={label}
  >
    <div
      className={`text-sm font-semibold px-3 py-2 rounded-lg border ${color || "text-white border-white/30"} whitespace-nowrap`}
    >
      {label}
    </div>
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
      <TextTech label="C#" duration={1} color="text-[#9B4F96] border-[#9B4F96]/40" />
      <TechIcon Icon={FaJava} label="Java" duration={1.2} color="text-[#f89820]" />
      <TechIcon Icon={FaPython} label="Python" duration={1.4} color="text-[#3776AB]" />
      <TechIcon Icon={FaRProject} label="R" duration={1.6} color="text-[#276DC3]" />
      <TechIcon Icon={SiGnubash} label="Bash" duration={1.8} color="text-gray-400" />
      <TechIcon Icon={SiTypescript} label="TypeScript" duration={2.0} color="text-[#3178c6]" />
      <TechIcon Icon={FaJs} label="JavaScript" duration={2.2} color="text-[#f0db4f]" />
      <TechIcon Icon={SiKotlin} label="Kotlin" duration={2.4} color="text-[#7F52FF]" />
      <TechIcon Icon={SiSwift} label="Swift" duration={2.6} color="text-[#F05138]" />
    </Section>

    {/* Frontend & Backend Technologies */}
    <Section title="Frontend & Backend Technologies">
      <TechIcon Icon={RiReactjsLine} label="React.js" duration={1} color="text-cyan-400" />
      <TechIcon Icon={SiNextdotjs} label="Next.js" duration={1.2} color="text-white" />
      <TechIcon Icon={SiAngular} label="AngularJS" duration={1.4} color="text-red-500" />
      <TechIcon Icon={SiVuedotjs} label="Vue.js" duration={1.6} color="text-green-400" />
      <TechIcon Icon={SiBlazor} label="Blazor Hybrid" duration={1.8} color="text-[#512BD4]" />
      <TextTech label="Syncfusion" duration={2.0} color="text-[#EF5350] border-[#EF5350]/40" />
      <TechIcon Icon={FaHtml5} label="HTML" duration={2.2} color="text-[#e34c26]" />
      <TechIcon Icon={FaCss3Alt} label="CSS" duration={2.4} color="text-[#264de4]" />
      <TechIcon Icon={SiSpringboot} label="Spring Boot" duration={2.6} color="text-green-500" />
      <TechIcon Icon={SiSpring} label="Spring" duration={2.8} color="text-green-500" />
      <TechIcon Icon={SiDotnet} label="ASP.NET Core" duration={3.0} color="text-[#512BD4]" />
      <TechIcon Icon={FaNodeJs} label="Node.js" duration={3.2} color="text-green-500" />
      <TechIcon Icon={SiFastapi} label="FastAPI" duration={3.4} color="text-teal-500" />
      <TechIcon Icon={SiFlask} label="Flask" duration={3.6} color="text-teal-500" />
    </Section>

    {/* IDEs & Platforms */}
    <Section title="IDEs & Platforms">
      <TechIcon Icon={SiVscodium} label="VS Code" duration={1} color="text-[#007ACC]" />
      <TextTech label="Visual Studio" duration={1.2} color="text-[#5C2D91] border-[#5C2D91]/40" />
      <TechIcon Icon={SiPycharm} label="PyCharm" duration={1.4} color="text-[#31A8FF]" />
      <TechIcon Icon={SiAndroidstudio} label="Android Studio" duration={1.6} color="text-[#3DDC84]" />
      <TechIcon Icon={SiUnity} label="Unity" duration={1.8} />
      <TechIcon Icon={SiUnrealengine} label="Unreal Engine" duration={2.0} />
      <TechIcon Icon={SiGooglecolab} label="Google Colab" duration={2.2} color="text-yellow-400" />
      <TechIcon Icon={SiJupyter} label="Jupyter Notebook" duration={2.4} color="text-[#F37626]" />
      <TechIcon Icon={SiKaggle} label="Kaggle" duration={2.6} color="text-[#20BEFF]" />
    </Section>

    {/* AI */}
    <Section title="AI">
      <TechIcon Icon={SiLangchain} label="LangChain" duration={1} color="text-[#1C3C3C]" />
      <TextTech label="LangGraph" duration={1.2} color="text-emerald-400 border-emerald-400/40" />
      <TextTech label="MCP" duration={1.4} color="text-purple-400 border-purple-400/40" />
      <TextTech label="RAG" duration={1.6} color="text-blue-400 border-blue-400/40" />
      <TextTech label="VectorDB" duration={1.8} color="text-pink-400 border-pink-400/40" />
    </Section>

    {/* Databases */}
    <Section title="Databases">
      <TechIcon Icon={SiMysql} label="MySQL" duration={1} color="text-blue-500" />
      <TechIcon Icon={SiMongodb} label="MongoDB" duration={1.2} color="text-cyan-500" />
      <TechIcon Icon={DiRedis} label="Redis" duration={1.4} color="text-red-700" />
      <TechIcon Icon={SiFirebase} label="Firebase" duration={1.6} color="text-[#FFCA28]" />
      <TechIcon Icon={SiPostgresql} label="PostgreSQL" duration={1.8} color="text-[#336791]" />
      <TechIcon Icon={SiSupabase} label="Supabase" duration={2.0} color="text-[#3ECF8E]" />
      <TextTech label="PowerSync" duration={2.2} color="text-orange-400 border-orange-400/40" />
    </Section>

    {/* Deployment & Pipelines */}
    <Section title="Deployment & Pipelines">
      <TechIcon Icon={SiDocker} label="Docker" duration={1} color="text-blue-500" />
      <TechIcon Icon={SiJenkins} label="Jenkins" duration={1.2} color="text-red-500" />
      <TechIcon Icon={FaAws} label="AWS" duration={1.4} color="text-[#FF9900]" />
      <TechIcon Icon={SiAmazonec2} label="Amazon EC2" duration={1.6} color="text-[#FF9900]" />
      <TechIcon Icon={SiAmazoneks} label="Amazon EKS" duration={1.8} color="text-[#FF9900]" />
      <TechIcon Icon={SiAmazonecs} label="Amazon ECS" duration={2.0} color="text-orange-500" />
      <TextTech label="Azure DevOps" duration={2.2} color="text-[#0078D7] border-[#0078D7]/40" />
      {/* <TextTech label="Azure Push Notification" duration={2.4} color="text-[#0078D7] border-[#0078D7]/40" /> */}
      <TechIcon Icon={SiGithubactions} label="CI/CD" duration={2.6} color="text-white" />
      <TechIcon Icon={SiApachekafka} label="Kafka" duration={2.8} />
    </Section>
  </div>
);

export default Technologies;
