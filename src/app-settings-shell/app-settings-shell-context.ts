import React from 'react';
import { IAppSettingsShell } from './app-settings-shell-models';

export const AppSettingsShellContext = React.createContext<IAppSettingsShell | undefined>(
  undefined,
);
export const useAppSettingsShell = <T extends IAppSettingsShell = IAppSettingsShell>(): T =>
  React.useContext(AppSettingsShellContext)! as T;
