import { SiteNode } from '../api-clients/widget-platform-api';

export const getTailUrl = (
  pageId: number,
  publicPath: string,
  structure: undefined | SiteNode,
  pageHierarchy: { [nodeId: number]: number[] },
  href: string,
): string => {
  let path = publicPath ?? '/';

  if (!structure) {
    return href.substring(path.length);
  }

  let nodeLevel = [structure];

  for (const nodeId of pageHierarchy[pageId] ?? []) {
    const nodeTree = nodeLevel.find(n => n?.id === nodeId);
    if (!nodeTree) {
      break;
    }
    const isRootPage = nodeId === structure.id;
    if (!isRootPage) {
      path = `${path}${nodeTree.alias}/`;
    }
    nodeLevel = nodeTree.children ?? [];
  }

  return href.substring(path.length);
};
