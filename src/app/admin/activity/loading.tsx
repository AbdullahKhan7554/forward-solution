import { HeaderSkeleton, LoadingPage, TableSkeleton } from "@/components/admin/Skeleton";

export default function Loading() {
  return (
    <LoadingPage>
      <HeaderSkeleton button={false} />
      <TableSkeleton rows={10} thumb={false} />
    </LoadingPage>
  );
}
