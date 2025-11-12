const ProgressBar = ({ value = 0, max = 100 }) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>{value} pts</span>
        <span>{max} pts goal</span>
      </div>
    </div>
  );
};

export default ProgressBar;

