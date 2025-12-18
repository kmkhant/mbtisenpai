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

type ChartCSSVars = React.CSSProperties & {
  [key: `--color-${string}`]: string;
};

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
  const colorVars = Object.entries(config).reduce<ChartCSSVars>(
    (acc, [key, value], index) => {
      const cssVar = `--color-${key}` as `--color-${string}`;
      acc[cssVar] = value.color ?? `var(--chart-${index + 1})`;
      return acc;
    },
    {} as ChartCSSVars
  );

  return (
    <ChartContext.Provider value={config}>
      <div
        data-chart
        className={cn(
          "relative flex w-full items-center justify-center [&_.recharts-polar-grid-concentric-polygon]:stroke-border [&_.recharts-polar-angle-axis-tick text]:fill-muted-foreground",
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

export function ChartTooltip<
  TValue extends string | number = string | number,
  TName extends string | number = string | number
>(props: TooltipProps<TValue, TName>) {
  return <Tooltip {...props} />;
}

type TooltipContentProps = {
  active?: boolean;
  payload?: Array<{
    fill?: string;
    value?: string | number;
    payload?: {
      rawScore?: number;
    };
  }>;
  label?: string;
};

export function ChartTooltipContent({
  active,
  payload,
  label,
}: TooltipContentProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const rawScore = item.payload?.rawScore;

  return (
    <div className="rounded-xl border border-border bg-card/90 px-3 py-2 text-xs shadow-md">
      <div className="font-semibold text-card-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-2 text-muted-foreground">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: item.fill as string }}
        />
        <span className="font-medium">
          {typeof rawScore === "number" ? (
            <>
              {rawScore.toFixed(2)}{" "}
              <span className="text-muted-foreground/70">
                (normalized: {item.value})
              </span>
            </>
          ) : (
            item.value
          )}
        </span>
      </div>
    </div>
  );
}
