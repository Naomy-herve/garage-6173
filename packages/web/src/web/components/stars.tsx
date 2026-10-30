import { Star } from "lucide-react";

export function Stars({ value, onChange, size = 16 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          aria-label={`${n} étoile${n > 1 ? "s" : ""}`}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star style={{ width: size, height: size }} className={n <= value ? "fill-[#f5b301] text-[#f5b301]" : "text-[#3a3f4a]"} />
        </button>
      ))}
    </div>
  );
}
