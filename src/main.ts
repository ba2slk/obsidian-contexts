import { Plugin } from 'obsidian';
import { ContextsPluginSettings, DEFAULT_SETTINGS } from './types';
import { ContextsSettingTab } from './settings';
import { SaveContextModal } from './modals/save-context-modal';
import { SwitchContextModal } from './modals/switch-context-modal';

export default class ContextsPlugin extends Plugin {
    settings: ContextsPluginSettings;
    ribbonIconEl: HTMLElement | null = null;

    addCommands() {
        // @ts-ignore
        this.app.commands.listCommands().forEach(command => {
            if (command.id.startsWith('load-tab-group-') || command.id.startsWith('save-tab-group-')) {
                // @ts-ignore
                this.app.commands.removeCommand(command.id);
            }
        });
    }

    async onload() {
        await this.loadSettings();

        this.refreshRibbonIcon();

        this.addSettingTab(new ContextsSettingTab(this.app, this));

        this.addCommands();

        this.addCommand({
            id: 'save-context',
            name: 'Save Current Context',
            callback: () => {
                new SaveContextModal(this.app, this).open();
            }
        });

        this.addCommand({
            id: 'switch-context',
            name: 'Switch Context',
            callback: () => {
                new SwitchContextModal(this.app, this).open();
            }
        });

        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                this.addCommands();
            })
        );
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
                this.ribbonIconEl = this.addRibbonIcon('save', 'Save Current Context', () => {
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