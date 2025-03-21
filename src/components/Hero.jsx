import profilePic from "../assets/nirusanHariharan.webp";
import { MY_CONTENT } from "../constants";

const Hero = () => {
    return (
        <div className="pb-4 lg:mb-36 relative z-50 px-6">
            <div className="flex flex-wrap lg:flex-row-reverse">
                
                {/* Image Container */}
                <div className="w-full lg:w-1/2">
                    <div className="flex justify-center lg:p-8">
                        <img src={profilePic} 
                             alt="Nirusan Hariharan" 
                             className="border border-stone-900 rounded-3xl w-[650px] h-[650px] object-cover shadow-lg" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col items-center lg:items-start mt-10">
                        
                        <h2 className="pb-2 text-4xl tracking-tighter lg:text-6xl">
                            Nirusan Hariharan
                        </h2>
                        
                        <span className="bg-gradient-to-r from-stone-300 to-stone-600 bg-clip-text text-3xl tracking-tight text-transparent">
                            Software Engineer
                        </span>

                        <p className="my-2 max-w-lg py-6 text-xl leading-relaxed tracking-tighter">
                            {MY_CONTENT}
                        </p>

                        <a href="/Nirusan_Resume.pdf" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           download 
                           className="bg-white rounded-full p-4 text-sm text-stone-800 mb-10">
                            Download Resume
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
