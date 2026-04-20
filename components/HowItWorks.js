import { 
  FileText, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2 
} from "lucide-react";

export default function HowItWorks() {
  // OOP: Object literal - data structure for process steps
  const steps = [
    {
      id: "01",
      title: "Report Lost or Found",
      description: "Submit a detailed report including photos, location, and category. Our AI helps categorize your item automatically.",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
      features: ["Easy submission form", "Image upload support", "Auto-categorization"]
    },
    {
      id: "02",
      title: "Smart Matching",
      description: "Our intelligent algorithm constantly scans for potential matches between lost reports and found items in real-time.",
      icon: Search,
      color: "bg-purple-100 text-purple-600",
      features: ["Real-time notifications", "Similarity scoring", "Location-based filtering"]
    },
    {
      id: "03",
      title: "Verify & Reclaim",
      description: "Connect securely with the finder/owner. Verify ownership through our guided process and arrange a safe return.",
      icon: ShieldCheck,
      color: "bg-green-100 text-green-600",
      features: ["Secure messaging", "Identity verification", "Safe meetup points"]
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-[10%] left-[5%] w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2" />
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How We Reunite You With Your Items
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We've streamlined the recovery process into three simple steps. 
            No complicated forms or waiting periods—just efficient matching.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.id} className="relative group">
              {/* Connector Line (Desktop) */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-100 -z-10">
                  <div className="absolute inset-0 bg-blue-600 w-0 group-hover:w-full transition-all duration-700 ease-out origin-left" />
                </div>
              )}

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 h-full">
                {/* Icon Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <span className="text-4xl font-bold text-gray-100 select-none group-hover:text-blue-50 transition-colors duration-300">
                    {step.id}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Feature List */}
                <ul className="space-y-3">
                  {step.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-500">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="/register" 
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 gap-2 group"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
