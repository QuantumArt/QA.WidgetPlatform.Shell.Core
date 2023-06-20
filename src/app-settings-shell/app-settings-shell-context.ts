import React from 'react';
import { IAppSettingsShell } from './app-settings-shell-models';

export const AppSettingsShellContext = React.createContext<IAppSettingsShell | undefined>(undefined);
export const useAppSettingsShell = (): IAppSettingsShell => React.useContext(AppSettingsShellContext)!;
