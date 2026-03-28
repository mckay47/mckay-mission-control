import type { MCPServer, Command, Hook, FolderNode } from '../types';

export const mcpServers: MCPServer[] = [
  { name: 'GitHub', status: 'connected', tools: 24, description: 'Repository management, issues, PRs, code search' },
  { name: 'Supabase', status: 'connected', tools: 28, description: 'Database management, migrations, edge functions, SQL execution' },
  { name: 'Stitch', status: 'connected', tools: 12, description: 'AI-native design tool — screens, design systems, variants' },
  { name: 'Memory', status: 'connected', tools: 8, description: 'Knowledge graph — entities, relations, observations' },
  { name: '21st Magic', status: 'connected', tools: 4, description: 'UI component builder and inspiration engine' },
];

export const commands: Command[] = [
  { name: '/launch', description: 'Full launch protocol — research, strategy, brief, scaffold, build', status: 'active' },
  { name: '/build', description: 'Build a feature or fix a bug via build-agent', status: 'active' },
  { name: '/status', description: 'Show health of all active projects', status: 'active' },
  { name: '/brief', description: 'Generate daily briefing — projects, priorities, blockers', status: 'active' },
  { name: '/skills', description: 'List all available skills from REGISTRY.md', status: 'active' },
  { name: '/help', description: 'Show all available commands with descriptions', status: 'active' },
  { name: '/sync', description: 'Synchronize all project memories into global MEMORY.md', status: 'active' },
];

export const hooks: Hook[] = [
  { name: 'Safety Guard', event: 'PreToolUse', purpose: 'Blocks destructive commands (git push --force, git reset --hard, etc.)' },
  { name: 'Session Start', event: 'SessionStart', purpose: 'Updates terminal title based on current working directory' },
];

export const folderTree: FolderNode = {
  name: 'mckay-os',
  type: 'folder',
  children: [
    { name: 'DNA.md', type: 'file' },
    { name: 'REGISTRY.md', type: 'file' },
    { name: 'MEMORY.md', type: 'file' },
    { name: 'START_NEW_CHAT.md', type: 'file' },
    { name: 'context/', type: 'folder', children: [
      { name: 'mehti-chat-2026-03-28.md', type: 'file' },
      { name: 'mehti-communication-style.md', type: 'file' },
    ]},
    { name: 'projects/', type: 'folder', children: [
      { name: 'hebammenbuero/', type: 'folder', children: [{ name: 'CLAUDE.md', type: 'file' }] },
      { name: 'stillprobleme/', type: 'folder', children: [{ name: 'CLAUDE.md', type: 'file' }] },
      { name: 'mission-control/', type: 'folder', children: [{ name: 'CLAUDE.md', type: 'file' }] },
    ]},
    { name: '.claude/', type: 'folder', children: [
      { name: 'skills/', type: 'folder', children: [
        { name: 'core/', type: 'folder' },
        { name: 'project-types/', type: 'folder' },
        { name: 'domains/', type: 'folder' },
        { name: 'integrations/', type: 'folder' },
      ]},
      { name: 'agents/', type: 'folder', children: [
        { name: 'core/', type: 'folder' },
        { name: 'specialists/', type: 'folder' },
      ]},
      { name: 'commands/', type: 'folder' },
    ]},
  ],
};
