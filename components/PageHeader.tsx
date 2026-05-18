import React from 'react';

interface PageHeaderProps {
  title: React.ReactNode;
  description: string;
  centered?: boolean;
}

export default function PageHeader({ title, description, centered = true }: PageHeaderProps) {
  return (
    <section className={`${centered ? 'text-center' : ''} mb-16 py-16 bg-black text-white rounded-3xl border-b-4 border-makerlab shadow-2xl relative overflow-hidden`}>
      {/* Element de design industriel */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-makerlab -mr-16 -mt-16 rotate-45 hidden md:block opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 border-l-4 border-b-4 border-makerlab ml-4 mb-4 opacity-30"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase italic leading-tight">
          {title}
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  );
}
