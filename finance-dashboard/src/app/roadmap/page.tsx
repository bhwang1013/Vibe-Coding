"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { LevelCard } from "@/components/roadmap/LevelCard";
import { plan } from "@/lib/finance";

export default function RoadmapPage() {
  const [expandedId, setExpandedId] = useState<number | null>(
    plan.profile.currentLevelId,
  );

  return (
    <div>
      <PageHeader
        eyebrow="The Climb"
        title="Level Roadmap"
        description="Seven levels from Ignition to Empire. Each level locks in a bigger income engine, a defined lifestyle, and a hard reserve target before the next unlock."
      />
      <div className="space-y-4">
        {plan.levels.map((level, index) => (
          <LevelCard
            key={level.id}
            level={level}
            index={index}
            expanded={expandedId === level.id}
            onToggle={() =>
              setExpandedId((current) =>
                current === level.id ? null : level.id,
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
