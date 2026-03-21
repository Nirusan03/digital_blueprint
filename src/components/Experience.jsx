import { EXPERIENCES } from "../constants";
import { motion } from "framer-motion";

const Experience = () => {
  return (
    <div className="pb-24 relative z-50 px-6">
      <motion.h2
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-20 text-center text-4xl font-bold text-white"
      >
        Experience
      </motion.h2>

      <div className="max-w-4xl mx-auto relative">
        {/* Vertical timeline line */}
        <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-stone-600 via-stone-500 to-transparent hidden lg:block" />

        <div className="space-y-10">
          {EXPERIENCES.map((experience, index) => (
            <motion.div
              key={index}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative lg:pl-10"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-5 w-2.5 h-2.5 rounded-full bg-stone-400 border-2 border-stone-600 -translate-x-[4px] hidden lg:block" />

              {/* Card */}
              <div className="rounded-xl border border-stone-700/60 bg-stone-900/40 backdrop-blur-sm p-6 hover:border-stone-500/60 transition-colors duration-300">

                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white leading-tight">
                      {experience.role}
                    </h3>
                    <p className="text-stone-300 font-medium mt-0.5">
                      {experience.company}
                    </p>
                  </div>
                  <span className="shrink-0 self-start sm:self-auto text-xs font-medium text-stone-300 bg-stone-800 border border-stone-600 rounded-full px-3 py-1.5 whitespace-nowrap">
                    {experience.year}
                  </span>
                </div>

                {/* Description */}
                <ul className="mb-5 space-y-2">
                  {experience.description.map((point, i) => (
                    <li key={i} className="flex gap-2 text-stone-400 text-sm leading-relaxed">
                      <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-stone-500" />
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium text-stone-300 bg-stone-800/80 border border-stone-700 rounded-md px-2.5 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
