import { motion } from "framer-motion";
import logo from "@/assets/logo.jpeg";

const footerLinks = {
  Services: ["Dry Cleaning", "Wash & Fold", "Express", "Alterations", "Shoe Care"],
  Company: ["About Us", "Careers", "Press", "Blog", "Partners"],
  Support: ["Help Center", "Contact", "FAQs", "Locations", "Track Order"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export function FooterSection() {
  return (
    <footer className="py-8 md:py-12 border-t border-border bg-muted/20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
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
              <span className="text-base md:text-lg font-bold text-foreground">MyRet</span>
            </a>
            <p className="text-muted-foreground text-[11px] md:text-sm mb-3 md:mb-5 max-w-xs">
              Premium garment care for modern living.
            </p>
            <div className="flex gap-3">
              {["Twitter", "Instagram", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-[11px] md:text-xs"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-2 md:mb-3 text-xs md:text-sm">{category}</h4>
              <ul className="space-y-1.5 md:space-y-2">
                {links.slice(0, 4).map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[11px] md:text-xs text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="pt-4 md:pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3">
          <p className="text-[11px] md:text-xs text-muted-foreground text-center md:text-left">
            © 2026 MyRet Laundry. All rights reserved.
          </p>
          <span className="text-[11px] md:text-xs text-muted-foreground">
            Made with care for your garments
          </span>
        </div>
      </div>
    </footer>
  );
}
