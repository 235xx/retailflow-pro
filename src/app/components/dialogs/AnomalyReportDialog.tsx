import { useState } from 'react';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { MobileDrawer } from './MobileDrawer';

interface AnomalyReportDialogProps {
  onClose: () => void;
  onSubmit: (data: { type: string; description: string; photos: File[] }) => void;
  forceMobile?: boolean;
}

export function AnomalyReportDialog({ onClose, onSubmit, forceMobile }: AnomalyReportDialogProps) {
  const [anomalyType, setAnomalyType] = useState('Quantity Discrepancy');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Please fill in the anomaly description');
      return;
    }
    onSubmit({ type: anomalyType, description, photos });
  };

  return (
    <MobileDrawer
      isOpen={true}
      onClose={onClose}
      title="Anomaly Report"
      forceMobile={forceMobile}
      footer={
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-bold rounded-xl transition-colors"
            style={{ background: '#F0EDE8', color: '#9AA0A8' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full text-white py-3 text-sm font-bold rounded-xl transition-colors"
            style={{ background: '#BF8888' }}
          >
            Submit Report
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Anomaly Type */}
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: '#2C3540' }}>Anomaly Type</label>
          <select
            value={anomalyType}
            onChange={(e) => setAnomalyType(e.target.value)}
            className="w-full p-2.5 rounded-xl text-sm outline-none"
            style={{ border: '1.5px solid #E5E0D8', color: '#2C3540', background: '#ffffff' }}
          >
            <option value="Quantity Discrepancy">Quantity Discrepancy</option>
            <option value="Quality Issue">Quality Issue</option>
            <option value="Damaged Packaging">Damaged Packaging</option>
            <option value="Wrong Item">Wrong Item</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: '#2C3540' }}>
            Description <span style={{ color: '#BF8888' }}>*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe the anomaly in detail..."
            className="w-full p-3 rounded-xl h-24 resize-none text-sm outline-none"
            style={{ border: '1.5px solid #E5E0D8', color: '#2C3540' }}
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-bold mb-1.5" style={{ color: '#2C3540' }}>Photos (Optional)</label>
          <div
            className="rounded-xl p-3 text-center transition-colors cursor-pointer"
            style={{ border: '2px dashed #E5E0D8', background: '#F7F6F4' }}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer block">
              <Camera className="w-8 h-8 mx-auto mb-1" style={{ color: '#9AB3C4' }} />
              <p className="text-xs font-medium" style={{ color: '#9AA0A8' }}>Tap to capture or upload</p>
            </label>
          </div>

          {photos.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {photos.map((_, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 w-16 h-16 rounded-lg p-1 bg-white"
                  style={{ border: '1px solid #E5E0D8' }}
                >
                  <Upload className="w-6 h-6 mx-auto mt-2" style={{ color: '#E5E0D8' }} />
                  <button
                    onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm"
                    style={{ background: '#BF8888' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: '#F5EDE0', border: '1px solid #DECA9A' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#A87A45' }} />
          <p className="text-[11px] leading-relaxed" style={{ color: '#8B5E2A' }}>
            This report will notify warehouse supervisors and purchasing department. Please ensure accuracy.
          </p>
        </div>
      </div>
    </MobileDrawer>
  );
}