import { PROJECTS } from "../constants"
import { motion } from "framer-motion"

const Projects = () => {
    return(
        <div className="pb-4 relative z-50 px-6">
            <motion.h2
                whileInView={{opacity: 1, y: 0}}
                initial={{opacity:0, y: -100}}
                transition={{duration:0.5}}
                className="my-20 text-center text-4xl">
                Projects
            </motion.h2>

            <div>
                {PROJECTS.map((project, index) => (
                    <div key={index} className="mb-8 flex flex-wrap lg:justify-center"> 
                        
                        <motion.div
                            whileInView={{opacity:1, x: 0}}
                            initial={{opacity:0, x:-100}}
                            transition={{duration: 1}}
                            className="w-full lg:w-1/4">

                            <img src={project.image}
                                width={300}
                                height={300}
                                alt={project.title}
                                className="mb-6 rounded"/>
                        </motion.div>
                        
                        <motion.div 
                            whileInView={{opacity: 1, x:0}}
                            initial={{opacity:0, x: 100}}
                            transition={{duration: 1}}
                            className="w-full max-w-xl lg:w-3/4">
                            
                            <h3 className="mb-2 font-semibold text-2xl">
                                {project.title}
                            </h3>

                            <p className="mb-4 text-stone-400"> 
                                {project.description}
                            </p>

                            <div className="mb-4">
                                {project.technologies.map((tech, index) =>(
                                    <span className="mr-2 mb-2 inline-block rounded bg-stone-900 p-2 
                                                     text-sm font-medium text-stone-300" key={index}>
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {project.github && (
                                <a 
                                    href={project.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block rounded bg-blue-600 text-white px-4 py-2 text-sm 
                                               font-medium hover:bg-blue-700 transition">
                                    View on GitHub
                                </a>
                            )}

                            {project.githubs && (
                                <div className="flex flex-wrap gap-2">
                                    {project.githubs.map((link, i) => (
                                        <a 
                                            key={i}
                                            href={link.url}
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-block rounded bg-blue-600 text-white px-4 py-2 
                                                        text-sm font-medium hover:bg-blue-700 transition">
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Projects
