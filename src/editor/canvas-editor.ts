import "./style.css";
import { EditorMouseEvent, EditorTool, Editor } from "./interfaces";

const CLASS_NAME = {
  CANVAS: "content-editor__canvas",
  CONTENT_EDITOR: "canvas-editor__content-editor",
  HEADER: "canvas-editor__header",
  MAIN: "canvas-editor__main",
  ROOT: "canvas-editor",
  TOOLBAR: "canvas-editor__toolbar",
};

export class CanvasEditor implements Editor {
  private htmlElements: {
    root: HTMLElement;
    toolbar: HTMLElement;
    contentEditor: HTMLElement;
    canvas: HTMLCanvasElement;
    header: HTMLElement;
  };
  private canvas: CanvasRenderingContext2D;
  private toolbarButtons: Map<EditorTool, HTMLElement> = new Map();

  constructor(resolution: number) {
    const rootElement = this.createRootElement(resolution);

    this.htmlElements = {
      root: rootElement,
      toolbar: rootElement.querySelector(`.${CLASS_NAME.TOOLBAR}`)!,
      contentEditor: rootElement.querySelector(
        `.${CLASS_NAME.CONTENT_EDITOR}`
      )!,
      canvas: rootElement.querySelector(`.${CLASS_NAME.CANVAS}`)!,
      header: rootElement.querySelector(`.${CLASS_NAME.HEADER}`)!,
    };

    this.canvas = this.htmlElements.canvas.getContext("2d", {
      willReadFrequently: true,
    })!;
  }

  private createRootElement(resolution: number): HTMLElement {
    const rootElement = document.createElement("div");
    rootElement.classList.add("canvas-editor");

    rootElement.innerHTML = `
    <header class="${CLASS_NAME.HEADER}"></header>
    <div class="${CLASS_NAME.MAIN}">
      <aside class="${CLASS_NAME.TOOLBAR}"></aside>
      <div class="${CLASS_NAME.CONTENT_EDITOR}">
        <canvas 
          class="${CLASS_NAME.CANVAS}" 
          width="${resolution}" 
          height="${resolution}">
        </canvas>
      </div>
    </div>
    `;

    return rootElement;
  }

  private addToolbarButton(tool: EditorTool) {
    const toolbarButton = tool.getToolbarButton();

    if (!toolbarButton) {
      return;
    }

    const { title, iconUrl, onClick } = toolbarButton;
    const button = document.createElement("button");
    button.classList.add("toolbar__button");
    button.addEventListener("click", () => onClick(this));
    button.innerHTML = `<img src="${iconUrl}" alt="${title}">`;

    this.htmlElements.toolbar.appendChild(button);
    this.toolbarButtons.set(tool, button);
  }

  public getRootElement(): HTMLElement {
    return this.htmlElements.root;
  }

  public selectToolbarButton(tool: EditorTool, selected: boolean) {
    const toolbarButton = this.toolbarButtons.get(tool);

    if (!toolbarButton) {
      return;
    }

    if (!selected) {
      toolbarButton.classList.remove("toolbar__button--selected");
      return;
    }

    toolbarButton.classList.add("toolbar__button--selected");
  }

  public addTool(tool: EditorTool) {
    this.htmlElements.contentEditor.appendChild(tool.getRootElement());
    tool.install(this);
    this.addToolbarButton(tool);
  }

  public setHeaderText(text: string) {
    this.htmlElements.header.textContent = text;
  }

  public setCursor(cursor: string) {
    this.htmlElements.canvas.style.cursor = cursor;
  }

  public getImageData(sx: number, sy: number, sw: number, sh: number) {
    return this.canvas.getImageData(sx, sy, sw, sh);
  }

  public drawImage(imageElement: HTMLImageElement, dx: number, dy: number) {
    this.canvas.drawImage(imageElement, dx, dy);
  }

  public onHover(listener: (event: EditorMouseEvent) => void) {
    this.htmlElements.canvas.addEventListener("mousemove", listener);
  }

  public onClick(listener: (event: EditorMouseEvent) => void) {
    this.htmlElements.canvas.addEventListener("click", listener);
  }
}
