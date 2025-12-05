import { App, Modal, Notice, Setting, WorkspaceLeaf, TFile } from 'obsidian';
import type ContextsPlugin from '../main';

export class SwitchContextModal extends Modal {
    plugin: ContextsPlugin;

    constructor(app: App, plugin: ContextsPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const {contentEl} = this;

        new Setting(contentEl)
            .setName('Switch context')
            .setHeading();

        this.plugin.settings.savedContexts.forEach(context => {
            new Setting(contentEl)
                .setName(context.name)
                .setDesc(`${context.items.length} items`)
                .addButton(button => button
                    .setButtonText('Switch')
                    .setCta()
                    .onClick(() => {
                        void (async () => {
                            const filesToOpen: TFile[] = [];
                            
                            // items 순회
                            for (const path of context.items) {
                                const file = this.app.vault.getAbstractFileByPath(path);
                                if (file instanceof TFile) {
                                    filesToOpen.push(file);
                                } else {
                                    new Notice(`File not found: ${path}`);
                                }
                            }

                            if (filesToOpen.length === 0) {
                                new Notice(`No valid files found in context "${context.name}"`);
                                return;
                            }

                            const currentLeaves: WorkspaceLeaf[] = [];
                            this.app.workspace.iterateRootLeaves((leaf) => {
                                currentLeaves.push(leaf);
                            });

                            const isEmptyState = currentLeaves.length === 1 && currentLeaves[0].view.getViewType() === 'empty';
                            let leavesToDetach = [...currentLeaves]; 

                            for (let i = 0; i < filesToOpen.length; i++) {
                                const file = filesToOpen[i];
                                let leaf: WorkspaceLeaf;

                                if (i === 0 && isEmptyState) {
                                    leaf = currentLeaves[0];
                                    leavesToDetach = leavesToDetach.filter(l => l !== leaf);
                                } else {
                                    leaf = this.app.workspace.getLeaf('tab');
                                }

                                await leaf.openFile(file);
                            }

                            leavesToDetach.forEach(leaf => leaf.detach());

                            new Notice(`Switched to context "${context.name}"`);
                            this.close();
                        })();
                    }));
        });
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}