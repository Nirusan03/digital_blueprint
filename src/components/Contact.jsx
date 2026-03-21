import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { CONTACT } from "../constants";
import { motion, AnimatePresence } from "framer-motion";

// ─── Replace these with your real EmailJS credentials ───────────────────────
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
// ────────────────────────────────────────────────────────────────────────────

const ContactInfo = ({ icon, children }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 shrink-0 text-stone-400">{icon}</span>
    <span className="text-stone-300 text-sm leading-relaxed break-all">{children}</span>
  </div>
);

const Contact = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 4000);
  };

  const inputClass =
    "mt-1.5 w-full rounded-lg bg-stone-800/80 border border-stone-700 text-white text-sm px-4 py-2.5 " +
    "placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 " +
    "transition-all duration-200";

  return (
    <motion.section
      id="contact"
      className="pb-24 pt-24 relative z-50 px-6 border-t border-stone-800/60"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="my-20 text-center text-4xl font-bold text-white"
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Get In Touch
      </motion.h2>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ── Left: Contact Info ─────────────────────────── */}
        <motion.div
          className="lg:col-span-2 flex flex-col gap-6 rounded-xl border border-stone-700/60
                     bg-stone-900/40 backdrop-blur-sm p-7"
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Contact Details</h3>
            <p className="text-stone-500 text-sm">Feel free to reach out anytime.</p>
          </div>

          <div className="flex flex-col gap-4">
            <ContactInfo
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              }
            >
              {CONTACT.address}
            </ContactInfo>

            <ContactInfo
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
              }
            >
              <a href={`tel:${CONTACT.phoneNo}`} className="hover:text-white transition">
                {CONTACT.phoneNo}
              </a>
            </ContactInfo>

            <ContactInfo
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              }
            >
              <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition">
                {CONTACT.email}
              </a>
            </ContactInfo>
          </div>

          {/* Decorative gradient blob */}
          <div className="mt-auto pt-6 hidden lg:block">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-600 to-transparent" />
            <p className="mt-4 text-xs text-stone-600 text-center">
              Colombo, Sri Lanka · Open to remote
            </p>
          </div>
        </motion.div>

        {/* ── Right: Form ────────────────────────────────── */}
        <motion.div
          className="lg:col-span-3 rounded-xl border border-stone-700/60
                     bg-stone-900/40 backdrop-blur-sm p-7"
          initial={{ x: 60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-white mb-1">Send a Message</h3>
          <p className="text-stone-500 text-sm mb-6">I'll get back to you as soon as possible.</p>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-400 uppercase tracking-wide">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="What would you like to say?"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-green-400 flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Message sent successfully!
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-400 flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    Something went wrong. Try again.
                  </motion.p>
                )}
                {(status === "idle" || status === "sending") && <span />}
              </AnimatePresence>

              <button
                type="submit"
                disabled={status === "sending"}
                className="ml-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500
                           disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium
                           px-6 py-2.5 transition-all duration-200 shadow-md hover:shadow-blue-600/30"
              >
                {status === "sending" ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;
