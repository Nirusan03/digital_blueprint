import { PROJECTS } from "../constants"

const Projects = () => {
    return(
        <div className="pb-4 relative z-50 px-6">
            <h2 className="my-20 text-center text-4xl">
                Projects
            </h2>

            <div>
                {PROJECTS.map((projects, index) => (
                    <div key={index} className="mb-8 flex flex-wrap lg:justify-center"> 
                        <div className="w-full lg:w-1/4"> 
                            <img src={projects.image}
                                width={250}
                                height={250}
                                alt={projects.title}
                                className="mb-6 rounded"/>
                        </div>
                        <div className="w-full max-w-xl lg:w-3/4">
                            <h3 className="mb-2 font-semibold text-2xl">
                                {projects.title}
                            </h3>

                            <p className="mb-4 text-stone-400"> 
                                {projects.description}
                            </p>

                            {projects.technologies.map((tech, index) =>(
                                <span className="mr-2 rounded bg-stone-900 p-2 text-sm font-medium text-stone-300" key={index}>
                                     {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Projects