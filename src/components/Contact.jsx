import { CONTACT } from "../constants";

const Contact = () => {
    return (
        <div className="border-t border-stone-900 pb-20 relative z-50 px-6">
            {/* Section Title */}
            <h2 className="my-10 text-center text-5xl font-semibold text-white tracking-tight">
                Get In Touch
            </h2>

            {/* Contact Details */}
            <div className="text-center tracking-tighter text-lg text-gray-400 space-y-4">
                <p className="text-gray-300">{CONTACT.address}</p>

                {/* Phone Number */}
                <p className="hover:text-white transition-all duration-300">
                    <a href={`tel:${CONTACT.phoneNo}`} className="hover:underline">
                        {CONTACT.phoneNo}
                    </a>
                </p>

                {/* Email */}
                <p>
                    <a href={`mailto:${CONTACT.email}`} 
                       className="border-b border-gray-400 hover:text-white hover:border-white transition-all duration-300">
                        {CONTACT.email}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Contact;