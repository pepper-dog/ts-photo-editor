import { CanvasEditor } from "./canvas-editor";

describe("CanvasEditor", () => {
  it("returns the root html element when calling getRootElement()", () => {
    const editor = new CanvasEditor(100);
    const rootElement = editor.getRootElement();

    expect(rootElement).toBeInstanceOf(HTMLElement);
    expect(rootElement.innerHTML).toBe(`
    <header class="canvas-editor__header"></header>
    <div class="canvas-editor__main">
      <aside class="canvas-editor__toolbar"></aside>
      <div class="canvas-editor__content-editor">
        <canvas class="content-editor__canvas" width="100" height="100">
        </canvas>
      </div>
    </div>
    `);
  });

  it("installs a tool and adds it to the toolbar", () => {
    const editor = new CanvasEditor(100);

    const tool = {
      getRootElement: jest.fn(() => document.createElement("div")),
      getToolbarButton: jest.fn(() => ({
        title: "My Tool",
        iconUrl: "icon.png",
        onClick: jest.fn(),
      })),
      install: jest.fn(),
    };

    editor.addTool(tool);

    expect(tool.install).toHaveBeenCalledWith(editor);

    const toolButtonImage = editor
      .getRootElement()
      .querySelector(".toolbar__button  > img[alt='My Tool']");

    expect(toolButtonImage).not.toBeNull();
  });

  it("calls the tool's onClick method when the toolbar button is clicked", () => {
    const editor = new CanvasEditor(100);

    const onClick = jest.fn();
    const tool = {
      getRootElement: jest.fn(() => document.createElement("div")),
      getToolbarButton: jest.fn(() => ({
        title: "My Tool",
        iconUrl: "icon.png",
        onClick,
      })),
      install: jest.fn(),
    };

    editor.addTool(tool);

    const toolButton = editor
      .getRootElement()
      .querySelector(".toolbar__button")!;

    toolButton.dispatchEvent(new MouseEvent("click"));

    expect(onClick).toHaveBeenCalledWith(editor);
  });

  it("sets the canvas cursor", () => {
    const editor = new CanvasEditor(100);

    editor.setCursor("none");

    const canvas = editor.getRootElement().querySelector("canvas")!;
    expect(canvas.style.cursor).toBe("none");
  });

  it("sets the header text", () => {
    const editor = new CanvasEditor(100);

    editor.setHeaderText("Hello, World!");

    const header = editor
      .getRootElement()
      .querySelector(".canvas-editor__header")!;
    expect(header.textContent).toBe("Hello, World!");
  });
});
