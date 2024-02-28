import _ from 'lodash';
import { SiteNode, WidgetDetails } from '../api-clients/widget-platform-api';
import { WPApiStore } from '../stores/wp-api/wp-api-store';
import { ZoneTypes } from './get-zone-info';

export const getZones = async (
  url: string,
  pageId: number,
  wpApi: WPApiStore,
  structure: undefined | SiteNode,
  pageHierarchy: { [nodeId: number]: number[] },
): Promise<Record<string, WidgetDetails[]>> => {
  // Собираем рекурсивно виджет зоны по иерархии страниц
  const zones: Record<string, WidgetDetails[]> = {};

  for (const nodeId of pageHierarchy[pageId]) {
    const zonesWithWidgets = await wpApi.widgets(nodeId);
    let zonesName: string[] = [];
    if (pageId === structure?.id) {
      //Если рендерим ИМЕННО главную, то туда попадает все виджиты
      zonesName = Object.keys(zonesWithWidgets);
    } else if (nodeId === structure?.id) {
      //Если рендерим не главную, но, НА ТЕКУЩЕЙ ИТЕРАЦИИ, рендерим ИМЕННО главную, то туда попадает только виджеты глобальных зон или рекурсивные
      zonesName = Object.keys(zonesWithWidgets).filter(
        zoneName =>
          zoneName.startsWith(ZoneTypes.Global) ||
          zoneName.startsWith(ZoneTypes.Site) ||
          zoneName.startsWith(ZoneTypes.Recursive),
      );
    } else if (pageId === nodeId) {
      //Если рендерим не главную, но, НА ТЕКУЩЕЙ ИТЕРАЦИИ, рендерим ИМЕННО нашу страницу, то туда попадает все виджеты кроме глобальных зон
      zonesName = Object.keys(zonesWithWidgets).filter(
        zoneName => !(zoneName.startsWith(ZoneTypes.Global) || zoneName.startsWith(ZoneTypes.Site)),
      );
    } else {
      //Если рендерим не главную, и, НА ТЕКУЩЕЙ ИТЕРАЦИИ, рендерим верхнестоящую страницу, то туда попадают только виджеты рекурсивных зон
      zonesName = Object.keys(zonesWithWidgets).filter(zoneName =>
        zoneName.startsWith(ZoneTypes.Recursive),
      );
    }
    for (const zoneName of zonesName) {
      //Фильтруем виджеты по доcтупным url
      const allowedWidgets = zonesWithWidgets[zoneName].filter(w => {
        if (
          (!w.allowedUrlPatterns || w.allowedUrlPatterns.length === 0) &&
          (!w.deniedUrlPatterns || w.deniedUrlPatterns.length === 0)
        ) {
          return true;
        }

        const getPattern = (pattern: string) => {
          const placeholder = '__fake_123_';
          const stabalePattern = _.trim(pattern, '/')
            .replace('*', placeholder)
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          return RegExp(`^${stabalePattern.replace(placeholder, '[\\w+-_]*')}$`);
        };

        const stabaleUrl = _.trim(url, '/');
        if (!!w.deniedUrlPatterns?.length) {
          if (w.deniedUrlPatterns?.some(dup => !!stabaleUrl.match(getPattern(dup)))) {
            return false;
          }
        }

        if (!!w.allowedUrlPatterns?.length) {
          return w.allowedUrlPatterns?.some(aup => stabaleUrl.match(getPattern(aup)));
        }

        return true;
      });
      zones[zoneName] = [...(zones[zoneName] ?? []), ...allowedWidgets];
    }
  }
  return zones;
};
