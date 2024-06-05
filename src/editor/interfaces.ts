export interface Editor {
  addTool(tool: EditorTool): void;
  drawImage(imageElement: HTMLImageElement, dx: number, dy: number): void;
  getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
  getRootElement(): HTMLElement;
  onClick(listener: (event: EditorMouseEvent) => void): void;
  onHover(listener: (event: EditorMouseEvent) => void): void;
  selectToolbarButton(tool: EditorTool, selected: boolean): void;
  setCursor(cursor: string): void;
  setHeaderText(text: string): void;
}

export interface EditorTool {
  getRootElement(): HTMLElement;
  getToolbarButton(): ToolbarButton;
  install(editor: Editor): void;
}

export type EditorMouseEvent = {
  offsetX: number;
  offsetY: number;
};

export type ToolbarButton = {
  iconUrl: string;
  onClick: (editor: Editor) => void;
  title: string;
};
