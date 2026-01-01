import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CEOImage from "@/assets/CEO-buildmart.jpg";

export default function Contact() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          </div>

          {/* Main Content - Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* LEFT COLUMN - CEO Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Our CEO</h2>
              <Card className="overflow-hidden h-full">
                <div className="p-6 space-y-4">
                  {/* CEO Image */}
                  <img
                    src={CEOImage}
                    alt="Joseph Nishimwe - CEO"
                    className="w-full h-80 rounded-lg shadow-lg object-cover"
                  />

                  {/* CEO Info */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Joseph Nishimwe</h3>
                    <p className="text-yellow-500 font-semibold">Chief Executive Officer</p>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    Joseph Nishimwe is the visionary leader and CEO of FARCA company. With a passion for quality and customer satisfaction, he has built FARCA into a trusted name for high-quality interior design and construction materials in Rwanda.
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      We are committed to making premium building materials accessible and affordable to everyone, ensuring fast delivery and expert guidance on every project.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <a
                      href="https://wa.me/250791646062"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-500 hover:underline text-sm font-medium block"
                    >
                      💬 WhatsApp: +250 791 646 062
                    </a>
                    <a
                      href="tel:+250935254080"
                      className="text-yellow-500 hover:underline text-sm font-medium block"
                    >
                      📞 Call: +250 93525408
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT COLUMN - Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                      <a
                        href="mailto:buildmart645@gmail.com"
                        className="text-yellow-500 hover:underline block"
                      >
                        buildmart645@gmail.com
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Phone</h3>
                      <div className="space-y-2">
                        <a
                          href="tel:+250935254080"
                          className="text-yellow-500 hover:underline block"
                        >
                          +250 93525408
                        </a>
                        <a
                          href="https://wa.me/250791646062"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-500 hover:underline block"
                        >
                          +250 791 646 062 (WhatsApp)
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                      <p className="text-gray-700">
                        Kigali, Rwanda
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Company Info Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* About */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">About BuildMart</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                High-quality interior design & construction materials | Fast delivery | Affordable prices | Helping you build with confidence
              </p>
            </Card>

            {/* Vision */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                To become the most trusted and accessible source of interior design and construction materials, empowering homeowners, builders, and professionals.
              </p>
            </Card>

            {/* Mission */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Our Mission</h3>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>✓ Provide high-quality materials</li>
                <li>✓ Fast and reliable delivery</li>
                <li>✓ Affordable prices</li>
                <li>✓ Expert guidance</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
