export default function StatusBadge({ read, person }: { read: boolean; person: string }) {
  return (
    <button
      className={`relative min-w-[30px] rounded-lg border px-2 py-1 text-sm transition-all hover:cursor-default sm:min-w-[60px] sm:px-4 sm:py-2 ${
        read
          ? "border-green-600 bg-green-100 text-green-800 shadow-inner"
          : "border-foreground bg-background hover:bg-background"
      }`}
      disabled={read}
    >
      {read && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
          ✓
        </span>
      )}
      <span className="text-sm">{person}</span>
    </button>
  );
}
