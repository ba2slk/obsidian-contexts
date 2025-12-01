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
        contentEl.createEl('h2', { text: `Select File: ${this.currentPath}` });

        const listContainer = contentEl.createDiv();
        
        const folder = this.app.vault.getAbstractFileByPath(this.currentPath);

        if (!(folder instanceof TFolder)) {
            contentEl.createEl('p', { text: 'Invalid directory path.' });
            return;
        }

        if (this.currentPath !== '/' && folder.parent) {
            const backItem = listContainer.createDiv({ cls: 'nav-file-title' });
            backItem.createSpan({ text: '📁 .. (Go Back)', cls: 'nav-file-title-content' });
            backItem.style.cursor = 'pointer';
            backItem.style.padding = '5px';
            backItem.style.fontWeight = 'bold';
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
            const item = listContainer.createDiv({ cls: 'nav-file-title' });
            item.style.cursor = 'pointer';
            item.style.padding = '5px';
            
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