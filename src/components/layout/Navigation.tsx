import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpeg";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Membership", href: "/membership" },
  { label: "Community", href: "#community" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-card"
    >
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img
              src={logo}
              alt="MyRet Laundry"
              className="h-8 md:h-10 w-auto rounded-lg"
            />
            <span className="text-lg md:text-xl font-bold text-foreground">
              MyRet
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">
                    <User className="w-4 h-4 mr-1" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/order/new">New Order</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground relative z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu with enhanced animations */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden overflow-hidden relative"
            >
              {/* Blurred background overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-secondary/5 to-primary/5 backdrop-blur-md -z-10" />
              
              <div className="py-5 flex flex-col gap-2">
                {navLinks.map((link, index) =>
                  link.href.startsWith("/") ? (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.08, ease: "easeOut" }}
                    >
                      <Link
                        to={link.href}
                        className="text-foreground hover:text-primary transition-colors duration-300 text-base font-medium py-2.5 px-3 rounded-lg hover:bg-muted/50 block"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.08, ease: "easeOut" }}
                      className="text-foreground hover:text-primary transition-colors duration-300 text-base font-medium py-2.5 px-3 rounded-lg hover:bg-muted/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </motion.a>
                  )
                )}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                  className="flex flex-col gap-2 pt-4 mt-2 border-t border-border/50"
                >
                  {user ? (
                    <>
                      {isAdmin && (
                        <Button variant="ghost" className="w-full justify-center" asChild>
                          <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                            Admin Panel
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" className="w-full justify-center" asChild>
                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <User className="w-4 h-4 mr-1" />
                          My Dashboard
                        </Link>
                      </Button>
                      <Button variant="hero" className="w-full justify-center" asChild>
                        <Link to="/order/new" onClick={() => setMobileMenuOpen(false)}>
                          New Order
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-center text-destructive" 
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-center" asChild>
                        <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="hero" className="w-full justify-center" asChild>
                        <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                          Get Started
                        </Link>
                      </Button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
