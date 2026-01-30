import { motion } from "framer-motion";
import logo from "@/assets/logo.jpeg";

const footerLinks = {
  Services: ["Dry Cleaning", "Wash & Fold", "Express Service", "Stain Removal", "Eco Care"],
  Company: ["About Us", "Careers", "Press", "Blog", "Partners"],
  Support: ["Help Center", "Contact", "FAQs", "Locations", "Track Order"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export function FooterSection() {
  return (
    <footer className="relative py-8 md:py-12 overflow-hidden">
      {/* Bluish water splash gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-blue-500/30" />
      
      {/* Animated water effect overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-300 via-transparent to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-300 via-transparent to-transparent animate-pulse" style={{ animationDelay: "1s" }} />
      </div>
      
      {/* Bubble decorations */}
      <div className="absolute top-8 left-[10%] w-4 h-4 rounded-full bg-white/20 animate-float" />
      <div className="absolute top-16 right-[15%] w-3 h-3 rounded-full bg-white/15 animate-float" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-20 left-[20%] w-5 h-5 rounded-full bg-white/10 animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-12 right-[25%] w-2 h-2 rounded-full bg-white/20 animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-6 md:mb-10"
        >
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-2 md:mb-3">
              <img
                src={logo}
                alt="MyRet Laundry"
                className="h-7 md:h-9 w-auto rounded-lg"
              />
              <span className="text-base md:text-lg font-bold text-white">MyRet</span>
            </a>
            <p className="text-white/80 text-[11px] md:text-sm mb-3 md:mb-5 max-w-xs">
              Premium garment care for modern living.
            </p>
            <div className="flex gap-3">
              {["Twitter", "Instagram", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-white/70 hover:text-white transition-colors text-[11px] md:text-xs"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-2 md:mb-3 text-xs md:text-sm">{category}</h4>
              <ul className="space-y-1.5 md:space-y-2">
                {links.slice(0, 4).map((link) => (
                  <li key={link}>
                    <a
                      href={category === "Services" ? `/services/${link.toLowerCase().replace(/\s+/g, '-')}` : "#"}
                      className="text-[11px] md:text-xs text-white/70 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom */}
        <div className="pt-4 md:pt-6 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3">
          <p className="text-[11px] md:text-xs text-white/70 text-center md:text-left">
            © 2026 MyRet Laundry. All rights reserved.
          </p>
          <span className="text-[11px] md:text-xs text-white/70">
            Made with care for your garments
          </span>
        </div>
      </div>
    </footer>
  );
}
