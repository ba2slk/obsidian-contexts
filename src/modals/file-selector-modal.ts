import { App, Modal, TFile, TFolder } from 'obsidian';

export class FileSelectorModal extends Modal {
    onSelect: (path: string) => void;
    currentPath: string;

    constructor(app: App, onSelect: (path: string) => void) {
        super(app);
        this.onSelect = onSelect;
        this.currentPath = '/';
    }

    onOpen() {
        this.display();
    }

    display() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: `Select file: ${this.currentPath}` });

        const listContainer = contentEl.createDiv();
        
        const folder = this.app.vault.getAbstractFileByPath(this.currentPath);

        if (!(folder instanceof TFolder)) {
            contentEl.createEl('p', { text: 'Invalid directory path.' });
            return;
        }

        if (this.currentPath !== '/' && folder.parent) {
            const backItem = listContainer.createDiv();
            backItem.addClass('contexts-file-item');
            backItem.addClass('contexts-back-button');
            
            backItem.createSpan({ text: '📁 ..' });
            backItem.onClickEvent(() => {
                if (folder.parent) {
                    this.currentPath = folder.parent.path;
                    this.display();
                }
            });
        }

        const children = folder.children.slice().sort((a, b) => {
            if (a instanceof TFolder && b instanceof TFile) return -1;
            if (a instanceof TFile && b instanceof TFolder) return 1;
            return a.name.localeCompare(b.name);
        });

        children.forEach(file => {
            const item = listContainer.createDiv();
            item.addClass('contexts-file-item');
            
            if (file instanceof TFolder) {
                item.createSpan({ text: `📁 ${file.name}` });
                item.onClickEvent(() => {
                    this.currentPath = file.path;
                    this.display();
                });
            } 
            else if (file instanceof TFile) {
                item.createSpan({ text: `📄 ${file.name}` });
                item.onClickEvent(() => {
                    this.onSelect(file.path);
                    this.close();
                });
            }
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}