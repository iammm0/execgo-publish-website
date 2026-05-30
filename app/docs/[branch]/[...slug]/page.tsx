import { redirect } from "next/navigation";

import { getBranchIdOrNull } from "@/lib/execgo-data";

type PageProps = {
  params: Promise<{ branch: string; slug: string[] }>;
};

export default async function LegacySlugRedirect({ params }: PageProps) {
  const { branch, slug } = await params;
  const branchId = getBranchIdOrNull(branch) ?? branch;
  redirect(`/docs/execgo/${branchId}/${slug.map(encodeURIComponent).join("/")}`);
}
