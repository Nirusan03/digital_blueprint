import { useState } from "react";
import { CONTACT } from "../constants";
import { motion } from "framer-motion";

// Reusable Input Field Component
const FormField = ({ label, type = "text", name, value, onChange, placeholder }) => (
  <div className="w-full">
    <label htmlFor={name} className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={name}
        name={name}
        rows="3"
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-md bg-stone-800 border border-gray-600 text-white px-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all resize-none"
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-md bg-stone-800 border border-gray-600 text-white px-4 py-2 
                   focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
      />
    )}
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-[70vh] border-t border-stone-900 pb-20 relative z-50 px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-5xl border border-gray-700 rounded-lg p-10 shadow-lg bg-stone-900/80"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h2
          className="my-10 text-center text-5xl font-semibold text-white tracking-tight"
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h2>

        <div className="flex flex-col lg:flex-row items-start gap-12">
          <motion.div
            className="w-full lg:w-1/2 text-lg text-gray-400 space-y-4"
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gray-300">{CONTACT.address}</p>
            <p>
              <a href={`tel:${CONTACT.phoneNo}`} className="hover:underline hover:text-white transition">
                {CONTACT.phoneNo}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${CONTACT.email}`}
                className="border-b border-gray-400 hover:text-white hover:border-white transition"
              >
                {CONTACT.email}
              </a>
            </p>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2"
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 text-white">
              <div className="flex gap-4">
                <FormField
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
                <FormField
                  label="Your Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
              <FormField
                label="Your Message"
                name="message"
                type="textarea"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition shadow-md hover:shadow-lg"
                >
                  Send
                </button>
              </div>
              {submitted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-green-400 mt-4"
                >
                  Your message has been sent successfully!
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Contact;