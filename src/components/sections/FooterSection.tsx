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
    <footer className="py-10 md:py-16 border-t border-border bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-8 md:mb-12"
        >
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <img
                src={logo}
                alt="MyRet Laundry"
                className="h-8 md:h-10 w-auto rounded-lg"
              />
              <span className="text-lg md:text-xl font-bold text-foreground">MyRet</span>
            </a>
            <p className="text-muted-foreground text-xs md:text-sm mb-4 md:mb-6 max-w-xs">
              Premium garment care for modern living. Your wardrobe deserves the best.
            </p>
            <div className="flex gap-3 md:gap-4">
              {["Twitter", "Instagram", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors text-xs md:text-sm"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-3 md:mb-4 text-sm md:text-base">{category}</h4>
              <ul className="space-y-2 md:space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="pt-6 md:pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <p className="text-xs md:text-sm text-muted-foreground text-center md:text-left">
            © 2026 MyRet Laundry. All rights reserved.
          </p>
          <div className="flex items-center gap-4 md:gap-6">
            <span className="text-xs md:text-sm text-muted-foreground">
              Made with care for your garments
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
