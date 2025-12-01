import { App, Modal, normalizePath, Notice, Setting } from 'obsidian';
import type ContextsPlugin from '../main';
import { ConfirmOverwriteModal } from './confirm-overwrite-modal';
import { FileSelectorModal } from './file-selector-modal';

export class ManageContextsModal extends Modal {
    plugin: ContextsPlugin;
    newContextName: string = '';
    newContextItems: string[] = [];
    
    constructor(app: App, plugin: ContextsPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        this.display();
    }

    display() {
        const {contentEl} = this;
        contentEl.empty();
        
        new Setting(contentEl)
            .setName('Manage contexts')
            .setHeading();

        new Setting(contentEl)
            .setName('Add new context manually')
            .setHeading();
        
        new Setting(contentEl)
            .setName('Context name')
            .addText(text => text
                .setPlaceholder('My new context')
                .setValue(this.newContextName)
                .onChange(value => this.newContextName = value));

        new Setting(contentEl)
            .setName('Add files')
            .setDesc('Select files to add to this context.')
            .addButton(button => button
                .setButtonText('+ Add file')
                .onClick(() => {
                    new FileSelectorModal(this.app, (path) => {
                        const normalizedPath = normalizePath(path);
                        if (!this.newContextItems.includes(path)) {
                            this.newContextItems.push(path);
                            this.display();
                        } else {
                            new Notice('File already in list.');
                        }
                    }).open();
                }));

        if (this.newContextItems.length > 0) {
            const listDiv = contentEl.createDiv({ cls: 'selected-files-list' });
            listDiv.style.border = '1px solid var(--background-modifier-border)';
            listDiv.style.padding = '10px';
            listDiv.style.borderRadius = '5px';
            listDiv.style.marginBottom = '10px';

            this.newContextItems.forEach((path, index) => {
                const row = listDiv.createDiv();
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.alignItems = 'center';
                row.style.marginBottom = '5px';

                row.createSpan({ text: path });

                const deleteBtn = row.createEl('button', { text: '✕' });
                deleteBtn.style.marginLeft = '10px';
                deleteBtn.style.padding = '2px 8px';
                deleteBtn.addEventListener('click', () => {
                    this.newContextItems.splice(index, 1);
                    this.display();
                });
            });
        } else {
            const emptyDiv = contentEl.createDiv();
            emptyDiv.style.color = 'var(--text-muted)';
            emptyDiv.style.fontStyle = 'italic';
            emptyDiv.style.marginBottom = '10px';
            emptyDiv.setText('No files selected yet.');
        }

        new Setting(contentEl)
            .addButton(button => button
                .setButtonText('Create context')
                .setCta()
                .onClick(async () => {
                    if (!this.newContextName) {
                        new Notice('Please enter a context name.');
                        return;
                    }
                    if (this.newContextItems.length === 0) {
                        new Notice('Please add at least one file.');
                        return;
                    }

                    const executeSave = async () => {
                        this.plugin.settings.savedContexts = this.plugin.settings.savedContexts.filter(c => c.name !== this.newContextName);
                        
                        this.plugin.settings.savedContexts.push({
                            name: this.newContextName,
                            items: [...this.newContextItems]
                        });
                        
                        await this.plugin.saveSettings();
                        new Notice(`Context "${this.newContextName}" created.`);
                        
                        this.newContextName = '';
                        this.newContextItems = [];
                        this.display();
                    };

                    const exists = this.plugin.settings.savedContexts.some(c => c.name === this.newContextName);
                    if (exists) {
                        new ConfirmOverwriteModal(this.app, this.newContextName, executeSave).open();
                    } else {
                        await executeSave();
                    }
                }));

        contentEl.createEl('hr');

        new Setting(contentEl)
            .setName('Existing contexts')
            .setHeading();

        if (this.plugin.settings.savedContexts.length === 0) {
            contentEl.createEl('p', {text: 'No saved contexts yet.'});
        } else {
            this.plugin.settings.savedContexts.forEach(context => {
                new Setting(contentEl)
                    .setName(context.name)
                    .setDesc(`${context.items.length} items`)
                    .addButton(button => button
                        .setButtonText('Delete')
                        .setWarning()
                        .onClick(async () => {
                            this.plugin.settings.savedContexts = this.plugin.settings.savedContexts.filter(c => c.name !== context.name);
                            await this.plugin.saveSettings();
                            this.display(); 
                        }));
            });
        }
    }

    onClose() {
        const {contentEl} = this;
        contentEl.empty();
    }
}