import { EXPERIENCES } from "../constants";

const Experience = () => {
    return (
        <div className="pb-4 relative z-50 px-6">
            <h2 className="my-20 text-center text-4xl font-bold text-white">
                Experience
            </h2>

            <div className="max-w-5xl mx-auto">
                {EXPERIENCES.map((experience, index) => (
                    <div key={index} className="mb-12 flex flex-col lg:flex-row lg:justify-between">

                        {/* Year (Left Side) */}
                        <div className="w-full lg:w-1/4 mb-2 lg:mb-0">
                            <p className="text-sm text-stone-400">{experience.year}</p>
                        </div>

                        {/* Experience Details (Right Side) */}
                        <div className="w-full lg:w-3/4 space-y-2">
                            <h3 className="text-lg font-semibold text-white">
                                {experience.role} -{" "}
                                <span className="text-sm text-stone-500">{experience.company}</span>
                            </h3>

                            <p className="text-stone-400 leading-relaxed">
                                {experience.description}
                            </p>

                            {/* Tech Stack Badges */}
                            <div className="flex flex-wrap mt-3">
                                {experience.technologies.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="mr-2 mt-2 rounded bg-stone-900 px-3 py-1 text-sm font-medium text-stone-300">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experience;
