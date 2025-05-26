
import React from 'react';
import GlassmorphismCard from './GlassmorphismCard';

const SocialProofGlass = () => {
  const testimonials = [
    {
      quote: "Learning Bites ha trasformato la nostra cultura aziendale. I nostri team sono più competenti e motivati che mai.",
      author: "Marco Rossi",
      role: "CEO",
      company: "TechCorp Italia"
    },
    {
      quote: "ROI formativo del 340% in 6 mesi. I micro-learning personalizzati hanno rivoluzionato il nostro approccio HR.",
      author: "Laura Bianchi",
      role: "HR Director",
      company: "Innovation Hub"
    },
    {
      quote: "La personalizzazione AI ha permesso ai nostri manager di acquisire competenze specifiche in tempi record.",
      author: "Alessandro Verdi",
      role: "COO",
      company: "Future Systems"
    }
  ];

  const companies = ["TechCorp", "Innovation Hub", "Future Systems", "AI Dynamics", "Digital Leaders"];

  return (
    <div className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Trusted by <span className="text-amber-400">Industry Leaders</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Le aziende più innovative scelgono Learning Bites per formare i loro team
          </p>
        </div>

        {/* Company Logos */}
        <div className="flex flex-wrap justify-center gap-8 mb-20">
          {companies.map((company, index) => (
            <GlassmorphismCard key={company} className="px-8 py-4" size="small">
              <span className="text-white/80 font-semibold text-lg">{company}</span>
            </GlassmorphismCard>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <GlassmorphismCard 
              key={index} 
              className="p-8 h-full group hover:scale-105 transition-all duration-500"
              size="medium"
              elevated={index === 1}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="text-4xl text-blue-400 mb-4">"</div>
                  <p className="text-white/90 leading-relaxed mb-6 text-lg">
                    {testimonial.quote}
                  </p>
                </div>
                
                <div className="border-t border-white/20 pt-6">
                  <div className="font-semibold text-white text-lg">
                    {testimonial.author}
                  </div>
                  <div className="text-blue-400 font-medium">
                    {testimonial.role}
                  </div>
                  <div className="text-white/60">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </GlassmorphismCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProofGlass;
