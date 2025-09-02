import { useEffect, useState } from "react";

function Settings({ canvas }) {
  const [selectedObject, setselectedObject] = useState(null);
  const [width, setwidth] = useState(null);
  const [height, setheight] = useState(null);
  const [diameter, setdiameter] = useState(null);
  const [color, setcolor] = useState(null);
  //   const [brushColor, setBrushColor] = useState("#000000");
  //   const [brushSize, setBrushSize] = useState(5);
  //   const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (event) => {
        handleObjectSelection(event.selectedObject[0]);
      });
      canvas.on("selection:update", (event) => {
        handleObjectSelection(event.selectedObject[0]);
      });
      canvas.on("selection:clear", () => {
        setselectedObject(null);
        clearSetting();
      });
      canvas.on("object:modified", (event) => {
        handleObjectSelection(event.target);
      });
      canvas.on("object:scaling", (event) => {
        handleObjectSelection(event.target);
      });
    }
  });

  const handleObjectSelection = (Object) => {
    if (!Object) return;

    setselectedObject(Object);

    if (Object.type == "rect") {
      setwidth(Math.round(Object.width * Object.scaleX));
      setheight(Math.round(Object.height * Object.scaleY));
      setcolor(Object.fill);
      setdiameter("");
    } else if (Object.type == "circle") {
      setdiameter(Math.round(Object.radius * 2 * Object.scaleX));
      setcolor(Object.fill);
      setheight("");
      setwidth("");
    }
  };

  const clearSetting = () => {
    setwidth("");
    setheight("");
    setcolor("");
    setdiameter("");
  };

  return <>Test</>;
}
export default Settings;
