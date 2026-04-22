import { notFound, redirect } from "next/navigation";

import { getBranchIdOrNull } from "@/lib/execgo-data";

type PageProps = {
  params: Promise<{ branch: string }>;
};

export default async function BranchDetailRedirectPage({ params }: PageProps) {
  const { branch } = await params;
  const branchId = getBranchIdOrNull(branch);

  if (!branchId) {
    notFound();
  }

  redirect(`/docs/execgo/${branchId}`);
}
