"use client";

import { useState, useMemo } from "react";
import { CalendarIcon, TrendingUp, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { getMovementsByStatus } from "@/features/movements/movement-logic";
import type { Movement, Branch } from "@/types";

interface ReportsViewProps {
  movements: Movement[];
  branches: Branch[];
}

export function ReportsView({ movements, branches }: ReportsViewProps) {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      if (dateRange.from && m.createdAt < dateRange.from) return false;
      if (dateRange.to && m.createdAt > dateRange.to) return false;
      return true;
    });
  }, [movements, dateRange]);

  const movementsByType = useMemo(() => {
    const counts = { entry: 0, exit: 0, transfer: 0 };
    filteredMovements.forEach((m) => {
      counts[m.type]++;
    });
    return [
      { type: "Entry", count: counts.entry, fill: "var(--chart-2)" },
      { type: "Exit", count: counts.exit, fill: "var(--chart-4)" },
      { type: "Transfer", count: counts.transfer, fill: "var(--chart-1)" },
    ];
  }, [filteredMovements]);

  const movementsByBranch = useMemo(() => {
    const counts: Record<string, number> = {};
    branches.forEach((b) => (counts[b.id] = 0));

    filteredMovements.forEach((m) => {
      if (m.sourceBranchId) counts[m.sourceBranchId]++;
      if (m.destinationBranchId) counts[m.destinationBranchId]++;
    });

    return branches.map((b, i) => ({
      branch: b.name.split(" ")[0],
      fullName: b.name,
      count: counts[b.id],
      fill: `var(--chart-${(i % 5) + 1})`,
    }));
  }, [filteredMovements, branches]);

  const statusCounts = getMovementsByStatus(filteredMovements);

  const chartConfig = {
    count: { label: "Movements" },
    entry: { label: "Entry", color: "var(--chart-2)" },
    exit: { label: "Exit", color: "var(--chart-4)" },
    transfer: { label: "Transfer", color: "var(--chart-1)" },
  };

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Report Period
          </CardTitle>
          <CardDescription>Select a date range to filter the reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    <>
                      {dateRange.from.toLocaleDateString()} -{" "}
                      {dateRange.to?.toLocaleDateString() || "..."}
                    </>
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setDateRange({
                    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    to: new Date(),
                  })
                }
              >
                Last 7 days
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setDateRange({
                    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    to: new Date(),
                  })
                }
              >
                Last 30 days
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{filteredMovements.length}</div>
            <p className="text-sm text-muted-foreground">Total Movements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-emerald-400">{statusCounts.processed}</div>
            <p className="text-sm text-muted-foreground">Processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-amber-400">{statusCounts.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-400">{statusCounts.failed}</div>
            <p className="text-sm text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Movements by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Movements by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={movementsByType} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="type" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Movements by Branch */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Movements by Branch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={movementsByBranch}>
                <XAxis dataKey="branch" />
                <YAxis />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => (
                        <>
                          <span className="font-medium">{item.payload.fullName}</span>: {value}
                        </>
                      )}
                    />
                  }
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
