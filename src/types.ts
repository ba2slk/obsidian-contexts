export interface SavedContext {
    name: string;
    items: string[]; // file routes
}

export interface ContextsPluginSettings {
    savedContexts: SavedContext[];
    showRibbonIcon: boolean;
}

export const DEFAULT_SETTINGS: ContextsPluginSettings = {
    savedContexts: [],
    showRibbonIcon: true
}