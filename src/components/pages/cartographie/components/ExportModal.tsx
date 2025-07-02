import React, { useState } from 'react';
import { X, Download, Share2, Copy, FileText, Database, Map, Globe, Check, Sparkles, Zap, Star } from 'lucide-react';
import {useMapStore} from "@/store/mapStore.ts";
import {type ExportOptions, exportSelection, generateShareableLink, copyToClipboard} from "@/utils/exportUtils.ts";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { selectedElements, filters, selectionArea } = useMapStore();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeImages: true,
    includeCoordinates: true,
    includeFilters: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const formatOptions = [
    { 
      value: 'json', 
      label: 'JSON', 
      icon: Database, 
      description: 'Format structuré pour développeurs',
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    { 
      value: 'csv', 
      label: 'CSV', 
      icon: FileText, 
      description: 'Compatible Excel et tableurs',
      color: 'from-green-500 to-green-600',
      popular: false
    },
    { 
      value: 'geojson', 
      label: 'GeoJSON', 
      icon: Map, 
      description: 'Format géospatial standard',
      color: 'from-purple-500 to-purple-600',
      popular: false
    },
    { 
      value: 'kml', 
      label: 'KML', 
      icon: Globe, 
      description: 'Compatible Google Earth',
      color: 'from-orange-500 to-orange-600',
      popular: false
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportSelection(selectedElements, exportOptions, filters, selectionArea);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateShareLink = () => {
    const link = generateShareableLink(selectedElements, filters);
    setShareLink(link);
  };

  const handleCopyLink = async () => {
    if (shareLink) {
      const success = await copyToClipboard(shareLink);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 scale-100">
        {/* Header */}
        <div className="relative p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200/50 rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-t-3xl"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Exporter la sélection
                </h2>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{selectedElements.length} élément{selectedElements.length > 1 ? 's' : ''} sélectionné{selectedElements.length > 1 ? 's' : ''}</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="font-medium text-green-600">
                  {selectedElements.reduce((sum, el) => sum + el.price, 0)}€ total
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group p-3 hover:bg-white/50 rounded-xl transition-all duration-200 transform hover:scale-110"
            >
              <X className="h-6 w-6 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Format Selection */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Format d'export</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formatOptions.map((format) => {
                const Icon = format.icon;
                const isSelected = exportOptions.format === format.value;
                return (
                  <button
                    key={format.value}
                    onClick={() => setExportOptions({ ...exportOptions, format: format.value as 'json' | 'csv' | 'geojson' | 'kml' })}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                      isSelected
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-lg'
                    }`}
                  >
                    {format.popular && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-current" />
                        <span>Populaire</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-4 mb-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${format.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className={`text-lg font-bold ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {format.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{format.description}</p>
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Options d'export</h3>
            <div className="space-y-4">
              {[
                {
                  key: 'includeImages',
                  title: 'Inclure les images',
                  description: 'URLs des images des éléments sélectionnés',
                  icon: '🖼️'
                },
                {
                  key: 'includeCoordinates',
                  title: 'Inclure les coordonnées',
                  description: 'Latitude et longitude de chaque élément',
                  icon: '📍'
                },
                {
                  key: 'includeFilters',
                  title: 'Inclure les filtres appliqués',
                  description: 'Critères de filtrage utilisés lors de la sélection',
                  icon: '🔍'
                }
              ].map((option) => (
                <label key={option.key} className="group flex items-center space-x-4 p-4 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-gray-200 hover:border-gray-300">
                  <input
                    type="checkbox"
                    checked={exportOptions[option.key as keyof ExportOptions] as boolean}
                    onChange={(e) => setExportOptions({ ...exportOptions, [option.key]: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <span className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {option.title}
                      </span>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Share Section */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-blue-500" />
              <span>Partager la sélection</span>
            </h3>
            <div className="space-y-4">
              <button
                onClick={handleGenerateShareLink}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-2xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Share2 className="h-5 w-5" />
                <span className="font-semibold">Générer un lien de partage</span>
              </button>

              {shareLink && (
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-semibold text-gray-700 flex items-center space-x-2">
                      <span>🔗</span>
                      <span>Lien de partage généré</span>
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                        copied 
                          ? 'bg-green-500 text-white shadow-lg' 
                          : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
                      }`}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span>{copied ? 'Copié!' : 'Copier'}</span>
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-200 break-all font-mono">
                    {shareLink}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold transform hover:scale-105"
            >
              Annuler
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || selectedElements.length === 0}
              className="flex-1 flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Download className="h-5 w-5" />
              <span>{isExporting ? 'Export en cours...' : 'Exporter la sélection'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;