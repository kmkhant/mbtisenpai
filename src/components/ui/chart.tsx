"use client";

import * as React from "react";
import { Tooltip, type TooltipProps } from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartConfig | null>(null);

export function useChartConfig() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) {
    throw new Error("useChartConfig must be used within a ChartContainer");
  }
  return ctx;
}

export function ChartContainer({
  config,
  className,
  style,
  children,
  ...props
}: ChartContainerProps) {
  const colorVars = Object.entries(config).reduce<React.CSSProperties>(
    (acc, [key, value], index) => {
      const cssVar = `--color-${key}` as const;
      acc[cssVar] = value.color ?? `var(--chart-${index + 1})`;
      return acc;
    },
    {} as React.CSSProperties
  );

  return (
    <ChartContext.Provider value={config}>
      <div
        data-chart
        className={cn(
          "relative flex w-full items-center justify-center [&_.recharts-polar-grid-concentric-polygon]:stroke-zinc-200 [&_.recharts-polar-angle-axis-tick text]:fill-zinc-400",
          className
        )}
        style={{ ...(style as React.CSSProperties), ...colorVars }}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

export function ChartTooltip(props: TooltipProps<any, any>) {
  return <Tooltip {...props} />;
}

export function ChartTooltipContent({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-xl border border-pink-50 bg-white/90 px-3 py-2 text-xs shadow-md">
      <div className="font-semibold text-zinc-800">{label}</div>
      <div className="mt-1 flex items-center gap-2 text-zinc-600">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: item.fill as string }}
        />
        <span className="font-medium">{item.value}</span>
      </div>
    </div>
  );
}
