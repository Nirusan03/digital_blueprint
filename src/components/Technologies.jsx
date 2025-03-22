import { DiRedis } from "react-icons/di"
import { FaNodeJs } from "react-icons/fa"
import { RiReactjsLine } from "react-icons/ri"
import { SiAmazonecs, SiAngular, SiApachekafka, SiDocker, SiFastapi, SiFlask, SiJenkins, SiMongodb, SiMysql, SiSpring, SiSpringboot, SiVuedotjs } from "react-icons/si"
import { motion } from "framer-motion"

const iconVariants = (duration) => ({
    initial: {y: -10},
    animate: {
        y: [10, -10],
        transition:{
            duration: duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
        }
    }
})

const Technologies = () => {
    return(
        <div className="pb-24 relative z-50 px-6">

            <motion.h2
                whileInView={{opacity: 1, y:0}}
                initial={{opacity:0, y:-100}}
                transition={{duration:1.5}}
                className="my-20 text-center text-4xl"> 
                
                Technologies
            </motion.h2>
            
            <motion.div 
                whileInView={{opacity: 1, x:0}}
                initial={{opacity:0, x: -100}}
                transition={{duration: 1.5}}
                className="flex flex-wrap items-center justify-center gap-4">
                
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(2.5)}>
                    <SiSpringboot className="text-7xl text-green-500" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(3)}
                    className="p-4">
                    <SiSpring className="text-7xl text-green-500" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(5)}
                    className="p-4">
                    <FaNodeJs className="text-7xl text-green-500" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(2)}
                    className="p-4">
                    <SiFastapi className="text-7xl text-teal-500" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(6)}
                    className="p-4">
                    <SiFlask className="text-7xl text-teal-500" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(4)}
                    className="p-4">
                    <RiReactjsLine className="text-7xl text-cyan-400" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(2.5)}
                    className="p-4">
                    <SiAngular className="text-7xl text-red-500" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(3)}
                    className="p-4">
                    <SiVuedotjs className="text-7xl text-green-400" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(5)}
                    className="p-4">
                    <DiRedis className="text-7xl text-red-700" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(2)}
                    className="p-4">
                    <SiMysql className="text-7xl text-blue-500" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(6)}
                    className="p-4">
                    <SiMongodb className="text-7xl text-cyan-500" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(4)}
                    className="p-4">
                    <SiDocker className="text-7xl text-blue-500" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(2.5)}
                    className="p-4">
                    <SiAmazonecs className="text-7xl text-orange-500" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(3)}
                    className="p-4">
                    <SiJenkins className="text-7xl text-red-500" />
                </motion.div>

                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={iconVariants(3)}
                    className="p-4">
                    <SiApachekafka className="text-7xl text-white-500" />
                </motion.div>

            </motion.div>
        </div>
    )
}

export default Technologies