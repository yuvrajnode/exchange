import { useId, useMemo } from "react";

/**
 * A price series drawn as a plain SVG path.
 *
 * The markets table renders one of these per row. A full charting library
 * instance per row costs several canvases each and locks up the page, and a
 * sparkline needs none of what that buys — no axes, crosshair or interaction.
 */
export function Sparkline({
  values,
  width = 112,
  height = 32,
  className,
  strokeWidth = 1.5,
  fill = true,
  color,
}: {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
  strokeWidth?: number;
  fill?: boolean;
  /** Defaults to up/down based on first vs last value. */
  color?: string;
}) {
  const gradientId = useId();

  const geometry = useMemo(() => {
    const points = values.filter((v) => Number.isFinite(v));
    if (points.length < 2) return null;

    const min = Math.min(...points);
    const max = Math.max(...points);
    // A flat series would divide by zero; centre it instead.
    const range = max - min || 1;
    const pad = strokeWidth;
    const usableHeight = height - pad * 2;

    const coords = points.map((value, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = pad + (1 - (value - min) / range) * usableHeight;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });

    return {
      line: `M${coords.join("L")}`,
      area: `M${coords.join("L")}L${width},${height}L0,${height}Z`,
      rising: points[points.length - 1] >= points[0],
    };
  }, [values, width, height, strokeWidth]);

  if (!geometry) {
    return (
      <div
        style={{ width, height }}
        className={className}
        aria-hidden
      />
    );
  }

  const stroke =
    color ?? (geometry.rising ? "var(--nx-up)" : "var(--nx-down)");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={geometry.rising ? "Price trending up" : "Price trending down"}
      preserveAspectRatio="none"
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={geometry.area} fill={`url(#${gradientId})`} />
        </>
      )}
      <path
        d={geometry.line}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
