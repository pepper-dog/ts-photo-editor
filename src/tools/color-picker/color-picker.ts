import { Editor, EditorTool, ToolbarButton } from "../../editor/interfaces";

import "./style.css";
import colorPickerIcon from "./icon.svg";

const CLASS_NAME = {
  ROOT: "color-picker",
  COLOR_LABEL_CONTAINER: "color-picker__color-label-container",
  COLOR_LABEL: "color-picker__color-label",
  CANVAS: "color-picker__canvas",
};

const CONTEXT_WINDOW = 5;
const PIXEL_MAGNIFICATION = 10;
const BORDER_SIZE = 10;

export class ColorPicker implements EditorTool {
  private htmlElements: {
    root: HTMLElement;
    label: HTMLElement;
    canvas: HTMLCanvasElement;
  };

  private displaySize: number;
  private contextSize: number;
  private contextWindow: number;
  private pixelMagnification: number;
  private toolbarButton: ToolbarButton;
  private isOn: boolean = false;
  private canvas: CanvasRenderingContext2D;

  constructor(
    contextWindow: number = CONTEXT_WINDOW,
    pixelMagnification: number = PIXEL_MAGNIFICATION
  ) {
    this.contextSize = contextWindow * 2 + 1;
    this.contextWindow = contextWindow;
    this.displaySize = this.contextSize * pixelMagnification;
    this.pixelMagnification = pixelMagnification;

    const rootElement = this.createRootElement(this.displaySize);
    this.htmlElements = {
      root: rootElement,
      label: rootElement.querySelector(`.${CLASS_NAME.COLOR_LABEL}`)!,
      canvas: rootElement.querySelector(`.${CLASS_NAME.CANVAS}`)!,
    };
    this.canvas = this.htmlElements.canvas.getContext("2d")!;

    this.toolbarButton = {
      title: "Color Picker",
      iconUrl: colorPickerIcon,
      onClick: (editor: Editor) => {
        this.onToolbarButtonClick(editor);
      },
    };
  }

  public getRootElement(): HTMLElement {
    return this.htmlElements.root;
  }

  public getToolbarButton(): ToolbarButton {
    return this.toolbarButton;
  }

  public install(editor: Editor) {
    editor.onHover(async ({ offsetX, offsetY }) => {
      if (!this.isOn) {
        return;
      }

      this.updateColorPicker(editor, offsetX, offsetY);
    });

    editor.onClick(async ({ offsetX, offsetY }) => {
      if (!this.isOn) {
        return;
      }

      this.updateEditorHeaderWithColor(editor, offsetX, offsetY);
    });
  }

  public updateColorPicker(editor: Editor, offsetX: number, offsetY: number) {
    const contextImage = this.getContextImage(editor, offsetX, offsetY);
    const centerColor = this.getCenterColor(contextImage);

    this.drawZoomedPixels(contextImage);
    this.drawMiddlePixelRect();
    this.centerColorPicker(offsetX, offsetY);
    this.updateColorLabel(centerColor);
    this.updateBorderColor(centerColor);
  }

  public updateEditorHeaderWithColor(
    editor: Editor,
    offsetX: number,
    offsetY: number
  ) {
    const contextImage = this.getContextImage(editor, offsetX, offsetY);
    const centerColor = this.getCenterColor(contextImage);

    editor.setHeaderText(`Amazing color! ${centerColor}`);
  }

  public onToolbarButtonClick(editor: Editor) {
    this.isOn = !this.isOn;

    editor.selectToolbarButton(this, this.isOn);

    const cursor = this.isOn ? "none" : "default";
    editor.setCursor(cursor);

    const display = this.isOn ? "block" : "none";
    this.getRootElement().style.setProperty("display", display);
  }

  private createRootElement(displaySize: number) {
    const rootElement = document.createElement("div");
    rootElement.classList.add(CLASS_NAME.ROOT);
    rootElement.innerHTML = `
      <canvas 
        class="${CLASS_NAME.CANVAS}" 
        width="${displaySize}" 
        height="${displaySize}">
      </canvas>
      <div class="${CLASS_NAME.COLOR_LABEL_CONTAINER}">
        <span class="${CLASS_NAME.COLOR_LABEL}"></span>
      </div>
    `;

    return rootElement;
  }

  private updateColorLabel(color: string) {
    this.htmlElements.label.textContent = color;
  }

  private updateBorderColor(color: string) {
    this.getRootElement().style.setProperty(
      "border",
      `solid ${BORDER_SIZE}px ${color}`
    );
  }

  private getContextImage(
    editor: Editor,
    offsetX: number,
    offsetY: number
  ): ImageData {
    const x = offsetX - this.contextWindow;
    const y = offsetY - this.contextWindow;

    return editor.getImageData(x, y, this.contextSize, this.contextSize);
  }

  private drawZoomedPixels(contextImage: ImageData) {
    this.canvas.fillStyle = "rgba(40, 40, 40, 1)";
    this.canvas.fillRect(0, 0, this.displaySize, this.displaySize);

    for (let i = 0; i < contextImage.data.length; i += 4) {
      const x = (i / 4) % this.contextSize;
      const y = Math.floor(i / 4 / this.contextSize);

      const r = contextImage.data[i];
      const g = contextImage.data[i + 1];
      const b = contextImage.data[i + 2];
      const a = contextImage.data[i + 3];

      this.canvas.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      this.canvas.fillRect(
        x * this.pixelMagnification + 1,
        y * this.pixelMagnification + 1,
        this.pixelMagnification - 1,
        this.pixelMagnification - 1
      );
    }
  }

  private drawMiddlePixelRect() {
    const middleZoomedPixel = this.contextWindow;
    this.canvas.strokeStyle = "white";
    this.canvas.strokeRect(
      middleZoomedPixel * this.pixelMagnification,
      middleZoomedPixel * this.pixelMagnification,
      this.pixelMagnification,
      this.pixelMagnification
    );
  }

  private getCenterColor(contextImage: ImageData): string {
    const imagePixels = contextImage.data;
    const centerPixelIndex = ((imagePixels.length / 4 + 1) / 2 - 1) * 4;
    const centerPixel = imagePixels.slice(
      centerPixelIndex,
      centerPixelIndex + 4
    );

    const r = centerPixel[0].toString(16).padStart(2, "0");
    const g = centerPixel[1].toString(16).padStart(2, "0");
    const b = centerPixel[2].toString(16).padStart(2, "0");

    return `#${r}${g}${b}`.toUpperCase();
  }

  private centerColorPicker(offsetX: number, offsetY: number) {
    const colorPickerPositionX = offsetX - this.displaySize / 2 - BORDER_SIZE;
    const colorPickerPositionY = offsetY - this.displaySize / 2 - BORDER_SIZE;

    const colorPickerElement = this.getRootElement();
    colorPickerElement?.style.setProperty("left", `${colorPickerPositionX}px`);
    colorPickerElement?.style.setProperty("top", `${colorPickerPositionY}px`);
  }
}
