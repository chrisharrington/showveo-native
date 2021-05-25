export enum Screen {
    Movies = 'Movies',
    Cast = 'Cast'
}

export interface Navigation {
    navigate: (screen: Screen) => void;
    closeDrawer: () => void;
}