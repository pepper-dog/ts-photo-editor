import { ColorPicker } from "./color-picker";
import { Editor } from "../../editor/interfaces";

describe("ColorPicker", () => {
  let editorMock: jest.Mocked<Editor>;

  beforeEach(() => {
    editorMock = {
      addTool: jest.fn(),
      drawImage: jest.fn(),
      getImageData: jest.fn(),
      getRootElement: jest.fn(),
      onClick: jest.fn(),
      onHover: jest.fn(),
      selectToolbarButton: jest.fn(),
      setHeaderText: jest.fn(),
      setCursor: jest.fn(),
    };
  });

  it("returns the root html element when calling getRootElement()", () => {
    const colorPicker = new ColorPicker();
    const rootElement = colorPicker.getRootElement();

    expect(rootElement).toBeInstanceOf(HTMLElement);
    expect(rootElement.innerHTML).toBe(`
      <canvas class="color-picker__canvas" width="110" height="110">
      </canvas>
      <div class="color-picker__color-label-container">
        <span class="color-picker__color-label"></span>
      </div>
    `);
  });

  it("returns the toolbar button when calling getToolbarButton()", () => {
    const colorPicker = new ColorPicker();
    const toolbarButton = colorPicker.getToolbarButton();

    expect(toolbarButton.title).toBe("Color Picker");
  });

  it("toggles the color picker and cursor when clicking the toolbar button", () => {
    const colorPicker = new ColorPicker();
    const rootElement = colorPicker.getRootElement();

    colorPicker.onToolbarButtonClick(editorMock);
    expect(editorMock.setCursor).toHaveBeenCalledWith("none");
    expect(rootElement.style.display).toBe("block");

    colorPicker.onToolbarButtonClick(editorMock);
    expect(editorMock.setCursor).toHaveBeenCalledWith("default");
    expect(rootElement.style.display).not.toBe("block");
  });

  it("updates color picker's border and label", async () => {
    const colorPicker = new ColorPicker();
    editorMock.getImageData.mockReturnValueOnce({
      // 11x11 context image with a single color (100)
      data: new Uint8ClampedArray(11 * 11 * 4).fill(100),
      colorSpace: "srgb",
      height: 11,
      width: 11,
    });

    colorPicker.updateColorPicker(editorMock, 10, 10);
    const rootElement = colorPicker.getRootElement();

    expect(rootElement.style.borderColor).toBe("#646464");
    expect(
      rootElement.querySelector(".color-picker__color-label")?.textContent
    ).toBe("#646464");
  });

  it("updates the editor's header with the color", async () => {
    const colorPicker = new ColorPicker();

    // 11x11 context image with a single color (100)
    const imageData = new Uint8ClampedArray(11 * 11 * 4).fill(100);
    // update pixel at the center of the context image
    imageData.set([255, 255, 255, 255], 4 * 5 + 4 * 5 * 11);
    editorMock.getImageData.mockReturnValueOnce({
      data: imageData,
      colorSpace: "srgb",
      height: 11,
      width: 11,
    });

    colorPicker.updateEditorHeaderWithColor(editorMock, 10, 10);

    expect(editorMock.setHeaderText).toHaveBeenCalledWith(
      "Amazing color! #FFFFFF"
    );
  });
});
