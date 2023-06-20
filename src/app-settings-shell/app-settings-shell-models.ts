export interface IGraphQLSettings {
  readonly apiUrl: string;
  readonly apiKey: string;
}

export interface IWidgetsPlatform {
  readonly apiUrl: string;
  readonly graphql?: IGraphQLSettings;
  readonly dnsName: string;
  readonly baseModuleName?: string;
  readonly forcedConfigurationOfDynamicModules?: {
    [componentAlias: string]: IComponentInfo;
  };
}

export interface ISSRSettings {
  readonly active: boolean;
  readonly ttl?: number;
}

export interface IComponentInfo {
  readonly url?: string;
  readonly moduleName: string;
}

export interface IAppSettingsShell {
  readonly widgetsPlatform: IWidgetsPlatform;
  readonly useDynamicModules?: boolean;
  readonly publicPath: string;
  readonly ssr?: ISSRSettings;
}
