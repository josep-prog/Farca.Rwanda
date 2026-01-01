import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import buildmartLogo from "@/assets/buildmart-logo.png";

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={buildmartLogo} alt="BuildMart Logo" className="h-8 w-auto" />
              <h3 className="font-display text-xl font-bold text-gradient">BuildMart</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium interior materials for building your dream spaces. Quality products with expert guidance.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products?category=tiles" className="hover:text-primary transition-colors">Tiles</Link></li>
              <li><Link to="/products?category=toilets-sanitary" className="hover:text-primary transition-colors">Toilets & Sanitary</Link></li>
              <li><Link to="/products?category=paints" className="hover:text-primary transition-colors">Paints</Link></li>
              <li><Link to="/products?category=fixtures" className="hover:text-primary transition-colors">Fixtures</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Kigali, Rwanda
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +250 788 123 456
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                info@buildmart.rw
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BuildMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
