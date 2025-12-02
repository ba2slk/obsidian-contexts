import { App, Modal, Notice, Setting, WorkspaceLeaf, FileView } from 'obsidian';
import type ContextsPlugin from '../main';
import { SavedContext } from '../types';
import { ConfirmOverwriteModal } from './confirm-overwrite-modal';

export class SaveContextModal extends Modal {
    plugin: ContextsPlugin;
    
    constructor(app: App, plugin: ContextsPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const {contentEl} = this;
        let contextName = '';

        new Setting(contentEl)
            .setName('Save current context')
            .setHeading();
        
        const saveAndClose = async () => {
            if (!contextName) {
                new Notice("Please enter a context name.");
                return;
            }

            const leaves: WorkspaceLeaf[] = [];
            this.app.workspace.iterateRootLeaves((leaf) => {
                leaves.push(leaf);
            });

            const items = leaves.map(leaf => {
                const view = leaf.view;
                if (view instanceof FileView && view.file) {
                    return view.file.path;
                }
                return null;
            }).filter((path): path is string => !!path);
            
            if (items.length === 0) {
                new Notice("No open files to save.");
                return;
            }

            const executeSave = async () => {
                this.plugin.settings.savedContexts = this.plugin.settings.savedContexts.filter(c => c.name !== contextName);
                
                const newContext: SavedContext = { name: contextName, items: items };
                this.plugin.settings.savedContexts.push(newContext);
                
                await this.plugin.saveSettings();
                
                new Notice(`Context "${contextName}" saved with ${items.length} items.`);
                this.close();
            };

            const exists = this.plugin.settings.savedContexts.some(c => c.name === contextName);

            if (exists) {
                new ConfirmOverwriteModal(this.app, contextName, () => {
                    void executeSave();
                }).open();
            } else {
                await executeSave();
            }
        };

        new Setting(contentEl)
            .setName('Context name')
            .addText(text => text
                .setPlaceholder('e.g., coding, reading...')
                .onChange(value => contextName = value)
                .inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        void saveAndClose();
                    }
                })
            );

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Save')
                .setCta()
                .onClick(() => void saveAndClose()));
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}