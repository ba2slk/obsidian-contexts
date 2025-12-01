import { App, Modal } from 'obsidian';

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
        contentEl.createEl('h2', { text: 'Duplicate Name' });
        contentEl.createEl('p', { text: `A context named "${this.contextName}" already exists.` });
        contentEl.createEl('p', { text: 'Saving now will overwrite the existing context. How would you like to proceed?' });

        const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });

        const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
        cancelButton.addEventListener('click', () => {
            this.close();
        });

        const confirmButton = buttonContainer.createEl('button', { cls: 'mod-cta', text: 'Save Anyway' });
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