import React from 'react';
import { Api, SiteNode, SiteNodeDetails, WidgetDetails } from '../../api-clients/widget-platform-api';
import { IAppSettingsShell } from '../../app-settings-shell/app-settings-shell-models';

export class WPApiStore {
  private readonly api: Api<unknown>;
  constructor(private readonly appSettings: IAppSettingsShell) {
    this.api = new Api({
      baseUrl: appSettings.widgetsPlatform.apiUrl,
    });
  }

  public structure = (fields?: string[]): Promise<SiteNode> =>
    this.api.site
      .structureList({
        dnsName: this.appSettings.widgetsPlatform.dnsName,
        fields: fields,
        fillDefinitionDetails: true,
      })
      .then(response => response.data);

  public node = (nodeId: number): Promise<SiteNodeDetails> =>
    this.api.site.nodeDetail(nodeId).then(response => response.data);

  public widgets = (nodeId: number): Promise<Record<string, WidgetDetails[]>> =>
    this.api.site
      .widgetsDetail(nodeId, {
        fillDefinitionDetails: true,
      })
      .then(response => response.data);
}

export const WPApiStoreContext = React.createContext<WPApiStore | undefined>(undefined);
export const useWPApiStore = (): WPApiStore => React.useContext(WPApiStoreContext)!;
