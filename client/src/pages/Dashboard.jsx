import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { BiRectangle, BiCircle, BiEraser } from "react-icons/bi";
import { Flex, IconButton } from "@radix-ui/themes";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";

export const Dashboard = () => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const [fillColor, setFillColor] = useState("#000000");
  const [shapeSize, setShapeSize] = useState(50);
  const [inputValue, setInputValue] = useState("50");
  const [isInputValid, setIsInputValid] = useState(true);

  useEffect(() => {
    const container = canvasRef.current.parentElement;
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#fff",
      width: 1000,
      height: 700,
    });

    fabricCanvas.current.renderAll();

    const handleResize = () => {
      fabricCanvas.current.setDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
      fabricCanvas.current.renderAll();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const addRectangle = () => {
    if (fabricCanvas.current) {
      const rect = new fabric.Rect({
        top: 100,
        left: 50,
        fill: fillColor,
        width: shapeSize,
        height: shapeSize * 0.6,
      });
      fabricCanvas.current.add(rect);
    }
  };

  const addCircle = () => {
    if (fabricCanvas.current) {
      const circle = new fabric.Circle({
        top: 100,
        left: 100,
        fill: fillColor,
        radius: shapeSize / 2,
      });
      fabricCanvas.current.add(circle);
    }
  };

  const handleShapeSizeKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = Number(e.target.value);
      if (value >= 10 && value <= 100) {
        setShapeSize(value);
        setInputValue(value.toString());
        setIsInputValid(true);
      } else {
        setIsInputValid(false);
      }
    }
  };

  const handleShapeSizeChange = (e) => {
    setInputValue(e.target.value);
    const value = Number(e.target.value);
    setIsInputValid(value >= 10 && value <= 100);
  };

  const clearCanvas = () => {
    fabricCanvas.current.clear();
    fabricCanvas.current.backgroundColor = "white";
    fabricCanvas.current.renderAll();
  };

  return (
    <div className=" bg-gray-100 flex flex-col justify-center p-2 rainbow-background">
      <div className="flex w-full max-h-full space-x-4 justify-center">
        <div className="w-1/8 bg-card border border-border rounded-lg p-4">
          <h2 className="text-2xl font-serif mb-2">Online Users</h2>
          <ul>
            <li className="text-lg font-sans mt-5 font-bold"> U1</li>
          </ul>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <h1 className="text-4xl font-serif space-x-4 mb-3 flex-wrap">
            Welcome!
          </h1>
          <p className="text-xl font-sans space-x-4 mb-3 flex-wrap">
            Collaborative Whiteboard
          </p>

          <div className="flex max-h-full overflow-auto max-w-full">
            <canvas
              ref={canvasRef}
              className="border flex flex-1 flex-col rounded-lg shadow-lg"
            />
          </div>
        </div>
        <div className="w-1/6 flex flex-col items-center justify-center sticky top-4">
          <div className="toolbar">
            <h3 className="text-lg text-wrap font-semibold text-foreground mb-4 text-center">
              Toolbar
            </h3>
            <Flex direction="column" gap="4" align="center" className="w-full">
              <TooltipProvider>
                <Tooltip content="Draw Rectangle">
                  <IconButton
                    size="3"
                    color="gray"
                    variant="soft"
                    onClick={addRectangle}
                    className="toolbar-button"
                  >
                    <BiRectangle size={30} className="text-foreground" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Draw Circle">
                  <IconButton
                    size="3"
                    color="gray"
                    variant="soft"
                    onClick={addCircle}
                    className="toolbar-button"
                  >
                    <BiCircle size={30} className="text-foreground" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Clear Canvas">
                  <IconButton
                    size="3"
                    color="gray"
                    variant="soft"
                    onClick={clearCanvas}
                    className="toolbar-button"
                  >
                    <BiEraser size={30} className="text-foreground" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Select Fill Color">
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="toolbar-color-picker"
                  />
                </Tooltip>
                <Tooltip content="Set Shape Size">
                  <div className="w-full">
                    <h3 size="2" className="text-foreground mb-2 block">
                      Shape Size: {shapeSize}px
                    </h3>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={inputValue}
                      onChange={handleShapeSizeChange}
                      onKeyDown={handleShapeSizeKeyDown}
                      className={`toolbar-size-input ${
                        !isInputValid ? "toolbar-size-input--invalid" : ""
                      }`}
                      placeholder="10-100"
                    />
                  </div>
                </Tooltip>
              </TooltipProvider>
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
};
