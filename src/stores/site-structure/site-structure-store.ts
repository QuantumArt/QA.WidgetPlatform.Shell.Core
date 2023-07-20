import React, { FunctionComponent } from 'react';
import { WPApiStore } from '../wp-api/wp-api-store';
import { RouteObject } from 'react-router-dom';
import { SiteNode } from '../../api-clients/widget-platform-api';
import { IAppSettingsShell } from '../../app-settings-shell/app-settings-shell-models';

export class SiteStructureStore {
  private _isInit: boolean = false;
  public get isInit(): boolean {
    return this._isInit;
  }

  private _structure?: SiteNode;
  public get structure(): undefined | SiteNode {
    return this._structure;
  }

  private _routes: RouteObject[] = [];
  public get routes(): RouteObject[] {
    return this._routes;
  }

  constructor(
    private readonly wpApi: WPApiStore,
    private readonly appSetting: IAppSettingsShell,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly page: FunctionComponent<any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly notFoundPage: FunctionComponent<any>,
    private maxDynamicPathLevel: number = 0,
  ) {
    this.maxDynamicPathLevel = Math.max(maxDynamicPathLevel, 0);
  }

  public init = async (): Promise<void> => {
    try {
      const response = await this.wpApi.structure(['IsVisible', 'IndexOrder', 'Title']);

      this._structure = response;

      //Создаем справочник роутов
      const routes: RouteObject[] = [];
      routes.push(this.getRouteObject('/', response));

      //Детей складываем в единый список роутов
      for (const child of response.children ?? []) {
        this.fillSiteStructure(routes, '', child);
      }
      //^^^^^^^^^^

      //Добавляем 404 страницу
      routes.push({
        path: '*',
        element: React.createElement(this.notFoundPage),
      });
      //^^^^^^^^^^

      this._routes = routes;
      this._isInit = true;
    } catch (ex) {
      console.error(ex);
    }
  };

  private fillSiteStructure = (routes: RouteObject[], prefixPath: string, node: SiteNode): void => {
    const path = !!node.alias ? `${prefixPath}/${node.alias}` : prefixPath;
    let tempPath = path;
    //Костыль для ререндеринга при одинаковых элементах на вложенных роутерах
    for (let i = 0; i <= this.maxDynamicPathLevel; i++) {
      routes.push(this.getRouteObject(tempPath, node));
      tempPath += `/:t${i}`;
    }
    //Детей складываем в единый список роутов
    for (const child of node.children ?? []) {
      this.fillSiteStructure(routes, path, child);
    }
  };

  private getRouteObject = (path: string, node: SiteNode) => {
    const route: RouteObject = {};
    route.id = node.id?.toString();
    route.path = path;

    const fcdm =
      this.appSetting.widgetsPlatform.forcedConfigurationOfDynamicModules?.[node.nodeType!];

    route.element = React.createElement(this.page, {
      key: node.id,
      node: node,
      componentInfo: {
        url: fcdm?.url ?? node.frontModuleUrl ?? '',
        moduleName: fcdm?.moduleName ?? node.frontModuleName ?? '',
        componentAlias: node.nodeType!,
      },
    });
    return route;
  };
}

export const SiteStructureStoreContext = React.createContext<SiteStructureStore | undefined>(
  undefined,
);

export const useSiteStructureStore = (): SiteStructureStore =>
  React.useContext(SiteStructureStoreContext)!;
