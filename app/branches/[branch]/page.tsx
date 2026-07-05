import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ branch: string }>;
};

export default async function BranchDetailRedirectPage({ params }: PageProps) {
  await params;
  redirect("/docs/ecosystem/versioning");
}
