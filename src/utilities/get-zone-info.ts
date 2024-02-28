export enum ZoneTypes {
  Site = 'Site',
  Recursive = 'Recursive',
  Global = 'Global',
}

export interface IZoneInfo {
  isGlobal: boolean;
  isRecursive: boolean;
}

export const getZoneInfo = (zoneName: string): IZoneInfo => {
  const isGlobal = zoneName.startsWith(ZoneTypes.Global) || zoneName.startsWith(ZoneTypes.Site);
  const isRecursive = zoneName.startsWith(ZoneTypes.Recursive);
  return {
    isGlobal,
    isRecursive,
  };
};
