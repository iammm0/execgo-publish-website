import { redirect } from "next/navigation";

import { getBranchIdOrNull } from "@/lib/execgo-data";

type PageProps = {
  params: Promise<{ branch: string }>;
};

export default async function LegacyBranchRedirect({ params }: PageProps) {
  const { branch } = await params;
  const branchId = getBranchIdOrNull(branch) ?? branch;
  redirect(`/docs/execgo/${branchId}`);
}
