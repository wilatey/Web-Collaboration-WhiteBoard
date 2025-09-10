import { Box, Card, Grid, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";

function Settings({ canvas }) {
  const [selectedObject, setselectedObject] = useState(null);
  const [width, setwidth] = useState("");
  const [height, setheight] = useState("");
  const [diameter, setdiameter] = useState("");
  const [color, setcolor] = useState("");

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (event) => {
        handleObjectSelection(event.selected[0]);
      });
      canvas.on("selection:updated", (event) => {
        handleObjectSelection(event.selected[0]);
      });
      canvas.on("selection:cleared", () => {
        setselectedObject(null);
        clearSetting();
      });
      canvas.on("object:modified", (event) => {
        handleObjectSelection(event.target);
      });
      canvas.on("object:scaling", (event) => {
        handleObjectSelection(event.target);
      });

      return () => {
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
        canvas.off("object:modified");
        canvas.off("object:scaling");
      };
    }
  });

  const handleObjectSelection = (object) => {
    if (!object) return;

    setselectedObject(object);

    if (object.type == "rect") {
      setwidth(Math.round(object.width * object.scaleX));
      setheight(Math.round(object.height * object.scaleY));
      setcolor(object.fill);
      setdiameter("");
    } else if (object.type == "circle") {
      setdiameter(Math.round(object.radius * 2 * object.scaleX));
      setcolor(object.fill);
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

  const handleWidthChange = (e) => {
    const value = e.target.value.replace(/,/g, "");

    const intValue = parseInt(value, 10) || 0;

    setwidth(intValue);

    if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
      selectedObject.set({ width: intValue / selectedObject.scaleX });
      canvas.renderAll();
    }
  };
  const handleHeightChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10) || 0;

    setheight(intValue);

    if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
      selectedObject.set({ height: intValue / selectedObject.scaleY });
      canvas.renderAll();
    }
  };
  const handleDiameterChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    const intValue = parseInt(value, 10);

    setdiameter(intValue);

    if (selectedObject && selectedObject.type === "circle" && intValue >= 0) {
      selectedObject.set({ radius: intValue / (2 * selectedObject.scaleX) });
      canvas.renderAll();
    }
  };
  const handleColorChange = (e) => {
    const value = e.target.value;

    setcolor(value);

    if (selectedObject) {
      selectedObject.set({ fill: value });
      canvas.renderAll();
    }
  };

  return (
    <div className="settings">
      {selectedObject && (
        <Box maxWidth="600px">
          <Card size={3}>
            <Flex direction="column" gap="4">
              {selectedObject.type === "rect" && (
                <>
                  <Grid gap={1}>
                    <h3 className=" text-xl text-white/95">Width</h3>
                    <input
                      type="number"
                      value={width || ""}
                      onChange={handleWidthChange}
                      className="border border-gray-300 bg-white rounded-lg focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/80 focus:ring-opacity-50"
                    />
                  </Grid>
                  <Grid gap={1}>
                    <h3 className=" text-xl text-white/95">Height</h3>
                    <input
                      type="number"
                      value={height || ""}
                      onChange={handleHeightChange}
                      className="border border-gray-300 bg-white rounded-lg focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/80 focus:ring-opacity-50"
                    />
                  </Grid>
                  <Grid gap={1}>
                    <h3 className=" text-xl text-white/95">Color</h3>
                    <input
                      type="color"
                      value={color || "#000000"}
                      onChange={handleColorChange}
                      className="w-full h-10"
                    />
                  </Grid>
                </>
              )}
              {selectedObject.type === "circle" && (
                <>
                  <Grid gap={1}>
                    <h3 className=" text-xl text-white/95">Diameter</h3>
                    <input
                      type="number"
                      value={diameter || ""}
                      onChange={handleDiameterChange}
                      className="border border-gray-300 bg-white rounded-lg focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/80 focus:ring-opacity-50"
                    />
                  </Grid>
                  <Grid gap={1}>
                    <h3 className=" text-xl text-white/95">Color</h3>
                    <input
                      type="color"
                      value={color || "#000000"}
                      onChange={handleColorChange}
                      className="w-full h-10"
                    />
                  </Grid>
                </>
              )}
            </Flex>
          </Card>
        </Box>
      )}
    </div>
  );
}

export default Settings;
