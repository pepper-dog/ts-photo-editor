# Photo editor with color picker

This is a simple photo editor with a color picker. It is written in vanilla typescript using the Canvas API.

## Running the project

To run the project, you need to have Node 20 installed.

```
npm install
npm run dev
```

There are also some tests written with Jest. To run the tests:

```
npm run test
```

## Features

1.- The editor allows loading an image from an `<img>` element.

```
editor.drawImage(imageElement, 0, 0);
```

2.- The editor is extensible allowing the addition of tools.

```
editor.addTool(new AwesomeTool());
```

3.- Every tool decides its behavior by implementing the EditorTool interface and using the editor's API.

```
class MyAwesomeTool implements EditorTool {
  public install(editor: Editor) {
    editor.setHeaderText(...)

    editor.onHover(async ({ offsetX, offsetY }) => {...});

    editor.onClick(async ({ offsetX, offsetY }) => {...});

    ...
  }
}

```

4.- Tools get to decide how to render themselves. They all get appended to the editor's main container.

```

class MyAwesomeTool implements EditorTool {
  public getRootElement(): HTMLElement {
    // Element will be appended to the editor's main container.
    // The tool decides if it is displayed or not
    return this.myAwesomeToolRootElement;
  }
}

```

5.- Tools can define an action button to be displayed in the editor's toolbar.

```

class MyAwesomeTool implements EditorTool {
  public getToolbarButton(): ToolbarButton {
    return {
      title: "MyAwesomeTool",
      iconUrl: someIcon,
      onClick: (editor: Editor) => {
        ... go crazy!
      };
    }
}

```

6.- Anybody can be an editor, just implement the Editor interface and decide how it will manage tools installation.

```

export class NewAndBetterEditor implements Editor {
  ...
}

```

## Further improvements

### CanvasEditor

- Extract ToolBar into a separate class.
- Destroy event listeners.
- Instead of using `willReadFrequently` we could use a cache for the image data (or some chunks) and update it when the editor changes.
- Test the image capabilities of the editor.
- Improve styling inheritance.
- Improve flex layout.

### ColorPicker

- Test the main view with the zoomed pixels.
- Instead of reading the image context every time, we could load the whole editor image data, store it in a cache, and read from it.
- Would it be better to use SVG for the zoomed pixels?
- It should probably disappear when the mouse is out of the editor.
