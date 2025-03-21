import { useState } from "react";
import { CONTACT } from "../constants";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000); 
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh] border-t border-stone-900 pb-20 relative z-50 px-6">
            <div className="w-full max-w-5xl border border-gray-700 rounded-lg p-10 shadow-lg bg-stone-900/80">
                <h2 className="my-10 text-center text-5xl font-semibold text-white tracking-tight">
                    Get In Touch
                </h2>

                <div className="flex flex-col lg:flex-row items-start gap-12">
                    <div className="w-full lg:w-1/2 text-lg text-gray-400 space-y-4">
                        <p className="text-gray-300">{CONTACT.address}</p>
                        <p className="hover:text-white transition-all duration-300">
                            <a href={`tel:${CONTACT.phoneNo}`} className="hover:underline">
                                {CONTACT.phoneNo}
                            </a>
                        </p>
                        <p>
                            <a href={`mailto:${CONTACT.email}`} 
                            className="border-b border-gray-400 hover:text-white hover:border-white transition-all duration-300">
                                {CONTACT.email}
                            </a>
                        </p>
                    </div>

                    <div className="w-full lg:w-1/2">
                        <form onSubmit={handleSubmit} className="space-y-4 text-white">
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Your Name</label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your name"
                                        className="mt-2 w-full rounded-md bg-stone-800 border border-gray-600 text-white px-4 py-2 focus:outline-none 
                                                    focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                                    />
                                </div>

                                <div className="w-1/2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Your Email</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                        className="mt-2 w-full rounded-md bg-stone-800 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 
                                                    focus:ring-gray-500 focus:border-gray-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Your Message</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    rows="3"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your message"
                                    className="mt-2 w-full rounded-md bg-stone-800 border border-gray-600 text-white px-4 py-2 focus:outline-none focus:ring-2 
                                                focus:ring-gray-500 focus:border-gray-500 transition-all resize-none"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    type="submit"
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-all duration-300 shadow-md hover:shadow-lg">
                                    Send
                                </button>
                            </div>

                            {submitted && (
                                <p className="text-center text-green-400 mt-4">
                                    Your message has been sent successfully!
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;