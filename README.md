# Obsidian Contexts

**Contexts** allows you to save your open tabs as a "context" and switch between them seamlessly.

Contexts supports **all file types** including **PDFs, Canvases, Images, and Markdown notes**. It also works well **across desktop and mobile**.

![contexts-demo](https://github.com/user-attachments/assets/4d46b30b-631c-4a41-afdb-61fe9230b553)

## Key Features

- **Universal Support:** Save and restore groups of tabs containing Markdown, PDF, Canvas, and Images.
- **Cross-Device Friendly:** Context data contains only the relative file paths in your Vault. This design avoids the `workspaces.json` inconsistency issue in Core Workspaces, particularly when syncing a vault across devices. Tab gropus created on one device load consistently on the other without conflict. (_Note: layout arrangement is not preserved._)
- **Safe Switching:** Switches contexts smoothly without leaving empty panes or glitches.
- **Save & Overwrite:** Easily save your current layout. Includes protection against accidental overwrites.
- **Management UI:**
    - View and delete saved contexts.
    - **Manually create contexts** using a built-in **File Picker**.
- **Minimalist:** Toggle the ribbon icon on/off via settings.

## How to Use

### 1. Saving a Context
1. Click the **Save** icon in the ribbon (or use the command `Contexts: Save current context`).
2. Enter a name for your context (e.g., "Research Mode", "Project Alpha").
3. Press Enter. Your current open tabs are now saved!

### 2. Switching Contexts
1. Use the command `Contexts: switch context`.
2. Select a context from the list and click **Switch**.
3. Your current tabs will close, and the saved context will load instantly.

### 3. Managing Contexts
![contexts-settings-demo](https://github.com/user-attachments/assets/976a9e2c-c411-4526-b003-385d28429618)

1. Go to **Settings** > **Contexts**.
2. Click **Manage contexts**.
3. In this modal, you can:
    - **Delete** unwanted contexts.
    - **Manually create** a new context by selecting files from the **File picker**.

## Installation

### From Community Plugins (Coming Soon!)
1. Open **Settings** > **Community plugins**.
2. Turn off **Safe Mode**.
3. Click **Browse** and search for `Contexts`.
4. Click **Install** and then **Enable**.

### Manual Installation
1. Download the `main.js`, `manifest.json`, and `styles.css` from the [Latest Release](https://github.com/ba2slk/obsidian-contexts/releases).
2. Create a folder named `contexts` inside your vault's plugin folder: `.obsidian/plugins/`.
3. Move the downloaded files into that folder.
4. Reload Obsidian and enable the plugin in settings.

## Contributing

Contributions are welcome! If you have ideas for improvements or bugs to report, please open an issue or submit a pull request.

## License

MIT License
