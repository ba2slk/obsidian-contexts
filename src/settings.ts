import { App, PluginSettingTab, Setting } from 'obsidian';
import type ContextsPlugin from './main';
import { ManageContextsModal } from './modals/manage-contexts-modal';

export class ContextsSettingTab extends PluginSettingTab {
    plugin: ContextsPlugin;

    constructor(app: App, plugin: ContextsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName('Show ribbon icon')
            .setDesc('Show the "save current context" icon in the left ribbon sidebar.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showRibbonIcon)
                .onChange(async (value) => {
                    this.plugin.settings.showRibbonIcon = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshRibbonIcon();
                }));
                
        new Setting(containerEl)
            .setName('Management')
            .setHeading();

        new Setting(containerEl)
            .setName('Manage contexts')
            .setDesc('Manually add, view, or delete saved contexts.')
            .addButton(button => button
                .setButtonText('Manage contexts')
                .setCta()
                .onClick(() => {
                    new ManageContextsModal(this.app, this.plugin).open();
                }));
    }
}