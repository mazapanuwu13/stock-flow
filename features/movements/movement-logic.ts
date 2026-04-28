import type { Movement, MovementStatus, MovementType, Product, Branch } from "@/types";

export function simulateMovementProcessing(
  movementId: string,
  onStatusChange: (id: string, status: MovementStatus) => void
): void {
  // Simulate processing after 2-5 seconds with 85% success rate
  setTimeout(() => {
    const success = Math.random() > 0.15;
    onStatusChange(movementId, success ? "processed" : "failed");
  }, Math.random() * 3000 + 2000);
}

export function getMovementsByType(movements: Movement[]): Record<MovementType, number> {
  const counts: Record<MovementType, number> = { entry: 0, exit: 0, transfer: 0 };
  movements.forEach((m) => {
    counts[m.type]++;
  });
  return counts;
}

export function getMovementsByStatus(movements: Movement[]): Record<MovementStatus, number> {
  const counts: Record<MovementStatus, number> = { pending: 0, processed: 0, failed: 0 };
  movements.forEach((m) => {
    counts[m.status]++;
  });
  return counts;
}

export function getMovementsByBranch(
  movements: Movement[],
  branches: Branch[]
): Record<string, number> {
  const counts: Record<string, number> = {};
  branches.forEach((b) => (counts[b.id] = 0));

  movements.forEach((m) => {
    if (m.sourceBranchId) counts[m.sourceBranchId]++;
    if (m.destinationBranchId) counts[m.destinationBranchId]++;
  });

  return counts;
}

export function filterMovements(
  movements: Movement[],
  filters: {
    type?: MovementType | "all";
    status?: MovementStatus | "all";
    branchId?: string | "all";
    dateFrom?: Date;
    dateTo?: Date;
  }
): Movement[] {
  return movements.filter((movement) => {
    if (filters.type && filters.type !== "all" && movement.type !== filters.type) {
      return false;
    }
    if (filters.status && filters.status !== "all" && movement.status !== filters.status) {
      return false;
    }
    if (filters.branchId && filters.branchId !== "all") {
      if (
        movement.sourceBranchId !== filters.branchId &&
        movement.destinationBranchId !== filters.branchId
      ) {
        return false;
      }
    }
    if (filters.dateFrom && movement.createdAt < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && movement.createdAt > filters.dateTo) {
      return false;
    }
    return true;
  });
}
