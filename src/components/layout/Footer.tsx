import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';
import { Phone, Mail, MapPin, Share2, MessageCircle, Globe, Rss } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-12 pb-6 hidden md:block">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-5 gap-8 pb-10 border-b border-slate-700">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{BRAND.logo}</span>
              <span className="text-xl font-bold font-heading text-white">{BRAND.name}</span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              India's most trusted construction marketplace. Connect with verified professionals and source quality building materials—all escrow protected.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone size={14} className="text-blue-400" /><a href="tel:+918001234567" className="hover:text-white">1800-123-4567 (Toll Free)</a></div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-blue-400" /><a href="mailto:support@buildnexus.in" className="hover:text-white">support@buildnexus.in</a></div>
              <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-400" /><span>DLF Cyber City, Gurugram 122002</span></div>
            </div>
            <div className="flex gap-3 mt-4">
              {[Share2, MessageCircle, Globe, Rss].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-blue-600 flex items-center justify-center transition-colors" aria-label="Social media">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Professionals */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Hire Professionals</h4>
            <ul className="space-y-2 text-sm">
              {['Masons & Bricklayers', 'Electricians', 'Plumbers', 'Civil Contractors', 'Painters', 'Carpenters', 'Interior Designers', 'Architects'].map(s => (
                <li key={s}><Link to="/professionals" className="hover:text-white transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Building Materials</h4>
            <ul className="space-y-2 text-sm">
              {['Cement & Concrete', 'TMT Steel & Rebar', 'Bricks & Blocks', 'Sand & Aggregates', 'Tiles & Flooring', 'Paints & Coatings', 'Pipes & Fittings', 'Electrical Supplies'].map(s => (
                <li key={s}><Link to="/materials" className="hover:text-white transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              {['About BuildNexus', 'How It Works', 'Contractor Guarantee', 'Vendor Registration', 'Blog & Resources', 'Press & Media', 'Careers', 'Contact Us'].map(s => (
                <li key={s}><a href="#" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
            <h4 className="font-semibold text-white mb-3 text-sm mt-6">Legal</h4>
            <ul className="space-y-2 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Escrow Terms'].map(s => (
                <li key={s}><a href="#" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between pt-6 text-xs text-slate-500">
          <span>© 2026 {BRAND.name}. All rights reserved. <span className="badge badge-navy ml-2">DEMO DATA — Not a real marketplace</span></span>
          <div className="flex gap-4">
            <span>🔒 256-bit SSL</span>
            <span>💳 Escrow Protected</span>
            <span>✅ BIS Verified Products</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
