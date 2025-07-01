import { CheckCircle, HelpCircle } from 'lucide-react';
import { Button } from './button';
import { UPLOAD_GUIDELINES } from '../utils/constants';

interface UploadGuidelinesProps {
  variant?: 'sidebar' | 'inline';
  showHelpButton?: boolean;
  onHelpClick?: () => void;
}

export function UploadGuidelines({
  variant = 'inline',
  showHelpButton = true,
  onHelpClick
}: UploadGuidelinesProps) {
  if (variant === 'sidebar') {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <div className="flex items-start space-x-3 mb-4">
          <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <h3 className="text-lg font-semibold text-gray-900">Upload Guidelines</h3>
        </div>

        <div className="space-y-3 mb-6">
          {UPLOAD_GUIDELINES.map((guideline, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600 leading-5">{guideline}</span>
            </div>
          ))}
        </div>

        {showHelpButton && (
          <>
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-500 mb-4">
                Contact our support team if you experience any issues with your uploads.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onHelpClick}
                className="w-full"
              >
                Go to Settings
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-white text-lg mb-4">Upload Guidelines</h3>
      <div className="space-y-3">
        {UPLOAD_GUIDELINES.map((guideline, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2.5 flex-shrink-0"></div>
            <span className="text-gray-300 leading-6">{guideline}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
