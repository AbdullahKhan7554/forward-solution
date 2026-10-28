import { HeaderSkeleton, LoadingPage, TableSkeleton } from "@/components/admin/Skeleton";

export default function Loading() {
  return (
    <LoadingPage>
      <HeaderSkeleton />
      <TableSkeleton />
    </LoadingPage>
  );
}
