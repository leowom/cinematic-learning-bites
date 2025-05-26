
import React from 'react';
import { Download, FileText, Table, Presentation } from 'lucide-react';

const ExportActions = () => {
  const exportOptions = [
    { icon: FileText, label: 'PDF Report', format: 'PDF' },
    { icon: Table, label: 'Excel Data', format: 'XLSX' },
    { icon: Presentation, label: 'PowerPoint', format: 'PPTX' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="analytics-container bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Export Analytics</h3>
            <p className="text-blue-200/80 text-sm">Generate professional reports for executive presentation</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {exportOptions.map((option, index) => (
              <button
                key={index}
                className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
              >
                <option.icon className="w-4 h-4 text-gray-600" />
                <span className="text-gray-900 font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportActions;
