export default function ProgressBar({ current, total, sectionTitle }) {
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-cchp-blue truncate pr-2">{sectionTitle}</span>
          <span className="text-xs text-gray-400 shrink-0">
            {current + 1} of {total}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-cchp-blue h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
