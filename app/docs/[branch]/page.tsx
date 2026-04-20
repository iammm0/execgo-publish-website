import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ branch: string }>;
};

export default async function LegacyBranchRedirect({ params }: PageProps) {
  const { branch } = await params;
  redirect(`/docs/execgo/${branch}`);
}
