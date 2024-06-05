import "./style.css";

import { CanvasEditor } from "./editor/canvas-editor";
import { ColorPicker } from "./tools/color-picker/color-picker";

const editor = new CanvasEditor(4000);
editor.addTool(new ColorPicker());
editor.setHeaderText("Try out the color picker tool!");

const appElement = document.getElementById("app")!;
appElement.appendChild(editor.getRootElement());

const exampleImage = new Image();
exampleImage.src = "/example-image.jpg";

const exampleImage2 = new Image();
exampleImage2.src = "/desert-transparent.png";

exampleImage.addEventListener("load", () => {
  editor.drawImage(exampleImage, 200, 200);
});

exampleImage2.addEventListener("load", () => {
  editor.drawImage(exampleImage2, 10, 50);
});
