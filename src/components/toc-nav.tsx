"use client";

import { useEffect, useState } from "react";
import { ChevronRight, FileText } from "lucide-react";

export interface TocSection {
    id: string;
    number: string;
    title: string;
}
export function TocNav({ sections }: { sections: TocSection[] }) {
    const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

    useEffect(() => {
        const elements = sections
            .map((section) => document.getElementById(section.id))
            .filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((entry) => entry.isIntersecting);
                if (visible.length === 0) return;
                const topMost = visible.reduce((closest, entry) =>
                    entry.boundingClientRect.top < closest.boundingClientRect.top ? entry : closest,
                );
                setActiveId(topMost.target.id);
            },
            {
                rootMargin: "-96px 0px -70% 0px",
                threshold: 0,
            },
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [sections]);

    return (
        <>
            <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-ink" />

                <p className="text-sm font-semibold font-display uppercase tracking-[0.16em] text-ink/50">
                    Contents
                </p>
            </div>

            <nav className="mt-5 border-l border-hairline">
                {sections.map((section) => {
                    const isActive = section.id === activeId;
                    return (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={() => setActiveId(section.id)}
                            aria-current={isActive ? "true" : undefined}
                            className={`group flex items-center gap-3 border-l-2 py-2 pl-4 text-sm transition-colors ${
                                isActive
                                    ? "border-ink text-ink"
                                    : "border-transparent text-ink/55 hover:border-ink hover:text-ink"
                            }`}
                        >
                            <span className={`text-xs ${isActive ? "text-ink/60" : "text-ink/30"}`}>
                                {section.number}
                            </span>

                            <span>{section.title}</span>

                            <ChevronRight
                                className={`ml-auto h-3.5 w-3.5 transition-opacity ${
                                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                }`}
                            />
                        </a>
                    );
                })}
            </nav>
        </>
    );
}
