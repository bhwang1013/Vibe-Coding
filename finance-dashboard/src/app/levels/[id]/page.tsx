import { notFound } from "next/navigation";
import { plan } from "@/lib/finance";
import { LevelDetail } from "@/components/levels/LevelDetail";

export function generateStaticParams() {
  return plan.levels.map((level) => ({ id: String(level.id) }));
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const levelId = Number(id);
  const level = plan.levels.find((l) => l.id === levelId);
  if (!level) notFound();
  return <LevelDetail levelId={levelId} />;
}
