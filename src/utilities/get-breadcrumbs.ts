import { SiteNode } from '../api-clients/widget-platform-api';

export interface BreadcrumbItem {
  title: string;
  link: string;
}

export const getBreadcrumbs = (
  pageId: number,
  homeTitle: string,
  publicPath: string,
  structure: undefined | SiteNode,
  pageHierarchy: { [nodeId: number]: number[] },
): BreadcrumbItem[] => {
  let path = publicPath ?? '/';

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: homeTitle,
      link: path,
    },
  ];

  if (!structure) {
    return breadcrumbs;
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
      breadcrumbs.push({
        title: nodeTree?.details?.title?.value,
        link: path,
      });
    }

    nodeLevel = nodeTree.children ?? [];
  }

  return breadcrumbs;
};
