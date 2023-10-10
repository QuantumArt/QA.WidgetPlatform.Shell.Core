import { SiteNode } from '../api-clients/widget-platform-api';

export interface PageNode {
  title: string;
  link: string;
  additionalData: unknown;
  children: PageNode[];
}

type convertingUrlHandler = (
  link: string,
  node: SiteNode,
) => {
  link: string;
  additionalData?: unknown;
};

export const getSiteMap = (
  maxDeepOrigin: number | undefined,
  homeTitle: string,
  publicPath: string,
  structure: undefined | SiteNode,
  convertingUrl?: convertingUrlHandler,
): PageNode[] => {
  if (!structure?.children) {
    return [];
  }

  const maxDeep = maxDeepOrigin ?? 5;
  const structureId = structure;
  const path = publicPath ?? '/';

  const getLevel = (basePath: string, node: SiteNode, level = maxDeep): PageNode => {
    const isRootPage = node.id === structureId;
    const path = isRootPage || level === maxDeep ? basePath : `${basePath}${node.alias}/`;
    let additionalData: unknown | undefined = undefined;

    let link = path;
    if (!!convertingUrl) {
      const urlParam = convertingUrl(path, node);
      link = urlParam.link;
      additionalData = urlParam.additionalData;
    }

    if (level === 0) {
      return;
    }

    return {
      title: isRootPage ? homeTitle : node.details?.title?.value,
      link,
      additionalData,
      children:
        node.children
          ?.filter(a => a.details?.isvisible.value)
          ?.sort((c1, c2) => {
            const v1 = c1.details?.indexorder?.value ?? 0;
            const v2 = c2.details?.indexorder?.value ?? 0;
            return v1 - v2;
          })
          ?.map(child => getLevel(path, child, level - 1)) ?? [],
    } as PageNode;
  };

  return getLevel(path, structure)?.children ?? [];
};
