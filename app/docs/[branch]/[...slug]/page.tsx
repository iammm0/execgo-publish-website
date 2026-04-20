import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ branch: string; slug: string[] }>;
};

export default async function LegacySlugRedirect({ params }: PageProps) {
  const { branch, slug } = await params;
  redirect(`/docs/execgo/${branch}/${slug.join("/")}`);
}
