"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { Project } from "@/types/modrinth";
import { OverviewTab } from "./tabs/OverviewTab";
import { CommunityWikiTab } from "./tabs/CommunityWikiTab";
import { DiscussionsTab } from "./tabs/DiscussionsTab";
import { Book, MessageSquare, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectTabsProps {
  project: Project;
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-6">
      <Tabs.List className="flex overflow-x-auto scrollbar-hide border-b border-[var(--color-border-subtle)] pb-px bg-[var(--color-background-base)] sticky top-16 z-40 p-1 rounded-t-xl">
        <Tabs.Trigger
          value="overview"
          className={cn(
            "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none",
            activeTab === "overview"
              ? "border-[var(--color-brand)] text-[var(--color-brand)]"
              : "border-transparent text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-border-subtle)]"
          )}
        >
          <List className="h-4 w-4" />
          Overview
        </Tabs.Trigger>
        <Tabs.Trigger
          value="wiki"
          className={cn(
            "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none",
            activeTab === "wiki"
              ? "border-[var(--color-brand)] text-[var(--color-brand)]"
              : "border-transparent text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-border-subtle)]"
          )}
        >
          <Book className="h-4 w-4" />
          Community Wiki
        </Tabs.Trigger>
        <Tabs.Trigger
          value="discussions"
          className={cn(
            "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none",
            activeTab === "discussions"
              ? "border-[var(--color-brand)] text-[var(--color-brand)]"
              : "border-transparent text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-border-subtle)]"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Discussions
        </Tabs.Trigger>
      </Tabs.List>

      <div className="w-full min-w-0">
        <Tabs.Content value="overview" className="focus-visible:outline-none animate-in fade-in zoom-in-95 duration-200">
          <OverviewTab project={project} />
        </Tabs.Content>
        <Tabs.Content value="wiki" className="focus-visible:outline-none animate-in fade-in zoom-in-95 duration-200">
          <CommunityWikiTab project={project} />
        </Tabs.Content>
        <Tabs.Content value="discussions" className="focus-visible:outline-none animate-in fade-in zoom-in-95 duration-200">
          <DiscussionsTab project={project} />
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
}
