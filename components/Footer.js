import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* OOP: Object literal - data structure for links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-600">Lost & Found</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Helping students and staff recover lost items quickly and securely. 
              A smart solution for our campus community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/report-lost" className="hover:text-blue-600 transition-colors">Report Lost Item</Link>
              </li>
              <li>
                <Link href="/post-found" className="hover:text-blue-600 transition-colors">Post Found Item</Link>
              </li>
              <li>
                <Link href="/matches" className="hover:text-blue-600 transition-colors">Browse Matches</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/claim" className="hover:text-blue-600 transition-colors">How to Claim</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors">Help Center</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:support@campus-lostfound.com" className="hover:text-blue-600 transition-colors">
                  support@campus-lostfound.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Student Center, Room 101</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {currentYear} Smart Lost-Item Recovery System. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Facebook</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
