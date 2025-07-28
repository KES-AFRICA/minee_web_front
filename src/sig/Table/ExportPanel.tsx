import React, { useState } from 'react';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import Modal from '../UI/Modal';
import Button from '../UI/Button';

const ExportPanel: React.FC = () => {
  const {
    showExportModal,
    toggleExportModal,
    exportData,
    selectedActifs,
    loading
  } = useAppStore();

  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [includeMap, setIncludeMap] = useState(false);

  const handleExport = async () => {
    await exportData(selectedFormat);
  };

  const formatOptions = [
    {
      value: 'csv' as const,
      label: 'CSV',
      description: 'Format texte séparé par des virgules',
      icon: Table,
      color: 'text-green-600'
    },
    {
      value: 'excel' as const,
      label: 'Excel',
      description: 'Classeur Microsoft Excel',
      icon: FileSpreadsheet,
      color: 'text-blue-600'
    },
    {
      value: 'pdf' as const,
      label: 'PDF',
      description: 'Document PDF avec mise en forme',
      icon: FileText,
      color: 'text-red-600'
    }
  ];

  return (
    <Modal
      isOpen={showExportModal}
      onClose={toggleExportModal}
      title="Exporter les données"
      size="md"
    >
      <div className="space-y-6">
        {/* Informations sur la sélection */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Download className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">
                {selectedActifs.length === 0 ? 'Aucun actif sélectionné' : 'Export des actifs sélectionnés'}
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                {selectedActifs.length === 0 
                  ? 'Sélectionnez des actifs dans le tableau ou sur la carte pour les exporter'
                  : `${selectedActifs.length} actif${selectedActifs.length > 1 ? 's' : ''} sélectionné${selectedActifs.length > 1 ? 's' : ''}`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Sélection du format */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Format d'export
          </h3>
          <div className="space-y-2">
            {formatOptions.map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value)}
                  className={`
                    w-full flex items-center p-3 rounded-lg border transition-all
                    ${selectedFormat === format.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 ${format.color}`} />
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {format.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format.description}
                    </div>
                  </div>
                  <div className="ml-auto">
                    {selectedFormat === format.value && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Options avancées */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Options avancées
          </h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeMap}
                onChange={(e) => setIncludeMap(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Inclure une carte dans l'export (PDF uniquement)
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={toggleExportModal}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={selectedActifs.length === 0}
            loading={loading}
            icon={Download}
          >
            Exporter
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportPanel;