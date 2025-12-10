import { Plugin } from 'obsidian';
import { ContextsPluginSettings, DEFAULT_SETTINGS } from './types';
import { ContextsSettingTab } from './settings';
import { SaveContextModal } from './modals/save-context-modal';
import { SwitchContextModal } from './modals/switch-context-modal';
import { ManageContextsModal } from './modals/manage-contexts-modal';

export default class ContextsPlugin extends Plugin {
    settings: ContextsPluginSettings;
    ribbonIconEl: HTMLElement | null = null;

    async onload() {
        await this.loadSettings();

        this.refreshRibbonIcon();

        this.addSettingTab(new ContextsSettingTab(this.app, this));

        this.addCommand({
            id: 'save-context',
            name: 'Save current context',
            callback: () => {
                new SaveContextModal(this.app, this).open();
            }
        });

        this.addCommand({
            id: 'switch-context',
            name: 'Switch context',
            callback: () => {
                new SwitchContextModal(this.app, this).open();
            }
        });
        
        this.addCommand({
            id: 'manage-context',
            name: 'Manage context',
            callback: () => {
                new ManageContextsModal(this.app, this).open();
            }
        })
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    refreshRibbonIcon() {
        if (this.settings.showRibbonIcon) {
            if (!this.ribbonIconEl) {
                this.ribbonIconEl = this.addRibbonIcon('save', 'Save current context', () => {
                    new SaveContextModal(this.app, this).open();
                });
            }
        } else {
            if (this.ribbonIconEl) {
                this.ribbonIconEl.remove();
                this.ribbonIconEl = null;
            }
        }
    }
}