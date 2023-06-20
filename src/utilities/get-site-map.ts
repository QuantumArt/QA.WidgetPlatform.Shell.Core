import { SiteNode } from '../api-clients/widget-platform-api';

export interface PageNode {
  title: string;
  link: string;
  children: PageNode[];
  isvisible: true;
}

export const getSiteMap = (
  maxDeepOrigin: number | undefined,
  homeTitle: string,
  publicPath: string,
  structure: undefined | SiteNode,
): PageNode[] => {
  if (!structure?.children) {
    return [];
  }

  const maxDeep = maxDeepOrigin ?? 5;
  const structureId = structure;
  const path = publicPath ?? '/';

  const getLevel = (basePath: string, node: SiteNode, level = maxDeep): any => {
    const isRootPage = node.id === structureId;
    const path = isRootPage || level === maxDeep ? basePath : `${basePath}${node.alias}/`;

    if (level === 0) {
      return;
    }

    return {
      title: isRootPage ? homeTitle : node.details?.title?.value,
      link: path,
      isvisible: node.details?.isvisible.value,
      children:
        node.children
          ?.sort((c1, c2) => {
            const v1 = c1.details?.indexorder?.value ?? 0;
            const v2 = c2.details?.indexorder?.value ?? 0;
            return v1 - v2;
          })
          ?.map(child => getLevel(path, child, level - 1)) ?? [],
    };
  };

  return getLevel(path, structure)?.children ?? [];
};
