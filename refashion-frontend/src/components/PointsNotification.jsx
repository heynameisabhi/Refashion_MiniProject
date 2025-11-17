import { useEffect, useState } from 'react';

const PointsNotification = ({ points, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="rounded-2xl border-2 border-brand bg-white px-6 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎉</span>
          <div>
            <p className="font-semibold text-brand">+{points} Points Earned!</p>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsNotification;
