'use client';

import type { Project, Table } from '@/types/game';
import { FolderKanban, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface AppSidebarProps {
  // TODO: receive projects/tables from server component or context once API is ready
  projects?: Project[];
  tables?: (Table & { projectId: string; projectName: string })[];
  selectedProjectId?: string;
  selectedTableId?: string;
}

export function AppSidebar({
  projects = [],
  tables = [],
  selectedProjectId,
  selectedTableId,
}: AppSidebarProps) {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <div className="hidden md:flex shrink-0 border-r border-border-primary bg-bg-primary/50 flex-col items-center pt-3">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 text-text-secondary hover:text-text-primary cursor-pointer rounded-lg transition-colors"
          aria-label="Abrir sidebar"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside className="hidden md:flex w-[220px] shrink-0 border-r border-border-primary bg-bg-primary flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary">
        <span className="text-[11px] text-text-secondary tracking-[2px]">
          NAVEGAÇÃO
        </span>
        <button
          onClick={() => setOpen(false)}
          className="p-1 text-text-secondary hover:text-text-primary cursor-pointer rounded-lg transition-colors"
          aria-label="Fechar sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
        {/* Projects */}
        <div>
          <p className="text-[11px] text-text-secondary tracking-[2px] mb-2 px-1">
            MEUS PROJETOS
          </p>
          {projects.length === 0 ? (
            <p className="text-xs text-text-secondary px-1 py-2 opacity-50">
              Nenhum projeto ativo
            </p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projetos/${project.id}`}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                    selectedProjectId === project.id
                      ? 'bg-accent-primary/[0.08] text-accent-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02]'
                  }`}
                >
                  <FolderKanban className="w-[15px] h-[15px] shrink-0" />
                  <span className="text-[13px] truncate flex-1">
                    {project.name}
                  </span>
                  <span
                    className={`text-[8px] px-1.5 py-0.5 rounded shrink-0 tracking-[0.5px] border ${
                      project.gameType === 'cash_game'
                        ? 'bg-green-500/[0.08] text-green-500 border-green-500/15'
                        : 'bg-accent-primary/[0.08] text-accent-primary border-accent-primary/15'
                    }`}
                  >
                    {project.gameType === 'cash_game' ? 'CG' : 'T'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Tables */}
        {tables.length > 0 && (
          <div>
            <p className="text-[11px] text-text-secondary tracking-[2px] mb-2 px-1">
              MINHAS MESAS
            </p>
            <div className="flex flex-col gap-0.5">
              {tables.map((table) => (
                <Link
                  key={table.id}
                  href={`/projetos/${table.projectId}/mesa/${table.id}`}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                    selectedTableId === table.id
                      ? 'bg-accent-secondary/[0.05] text-accent-secondary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-accent-secondary shrink-0" />
                  <span className="text-[13px] truncate flex-1">
                    {table.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Activity player placeholder */}
      {/* TODO: implement activity timer player when bet tracking API is ready */}
    </aside>
  );
}
