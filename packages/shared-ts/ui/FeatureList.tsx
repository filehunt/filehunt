import { KEY_FEATURES } from '../utils/constants';

interface FeatureListProps {
  title?: string;
  features?: string[];
  variant?: 'default' | 'compact';
}

export function FeatureList({
  title = "Key Features",
  features = KEY_FEATURES,
  variant = 'default'
}: FeatureListProps) {
  const colors = ['bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-orange-400'];

  return (
    <div>
      <h3 className="text-white text-lg mb-4">{title}</h3>
      <div className={variant === 'compact' ? 'space-y-2' : 'space-y-3'}>
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-1.5 h-1.5 rounded-full ${colors[index % colors.length]} mt-2.5 flex-shrink-0`}></div>
            <span className="text-gray-300 leading-6">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
