import { App, Modal, Setting } from 'obsidian';

export class ConfirmOverwriteModal extends Modal {
    onConfirm: () => void;
    contextName: string;

    constructor(app: App, contextName: string, onConfirm: () => void) {
        super(app);
        this.contextName = contextName;
        this.onConfirm = onConfirm;
    }

    onOpen() {
        const { contentEl } = this;
        new Setting(contentEl)
            .setName('Duplicate name')
            .setHeading();
            
        contentEl.createEl('p', { text: `A context named "${this.contextName}" already exists.` });
        contentEl.createEl('p', { text: 'Saving now will overwrite the existing context. How would you like to proceed?' });

        const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });

        const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
        cancelButton.addEventListener('click', () => {
            this.close();
        });

        const confirmButton = buttonContainer.createEl('button', { cls: 'mod-cta', text: 'Save anyway' });
        confirmButton.addEventListener('click', () => {
            this.onConfirm();
            this.close();
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}