import { SiteNode } from '../api-clients/widget-platform-api';

export const getPage = (url: string, structure: undefined | SiteNode): undefined | SiteNode => {
  //Ищем нужную страницу
  const queryIndex = url.indexOf('?');
  const pageРierarchy = url
    .slice(0, queryIndex === -1 ? url.length : queryIndex)
    .split('/')
    .filter(s => !!s);

  let level = structure?.children ?? [];
  let page: undefined | SiteNode;

  for (let i = 0; i < pageРierarchy.length; i++) {
    const alias = pageРierarchy[i];
    let node: undefined | SiteNode;

    for (let j = 0; j < level.length; j++) {
      if (level[j].alias === alias) {
        node = level[j];
        break;
      }
    }

    if (!!node) {
      page = node;
      level = node.children ?? [];
    } else {
      // Мы не нашли в структуре нужную страницу
      // Выходим из загрузки
      return;
    }
  }
  //^^^^^^^^
  
  return page;
};
