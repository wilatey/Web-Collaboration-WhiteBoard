import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import {
  BiRectangle,
  BiCircle,
  BiEraser,
  BiDownArrowAlt,
  BiCard,
} from "react-icons/bi";
import { Button, Flex, IconButton } from "@radix-ui/themes";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";
import Settings from "../component/Settings";
import { useDrawingToggle } from "../../lib/useDrawingToggle";

export const Dashboard = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const { buttonText, toggleDrawing } = useDrawingToggle(canvas);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawing: false,
        backgroundColor: "#fff",
        width: 1000,
        height: 700,
      });
      initCanvas.freeDrawingBrush = new fabric.PencilBrush(initCanvas);
      initCanvas.renderAll();

      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  const addRectangle = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        top: 100,
        left: 50,
        fill: "#0000ff",
        width: 150,
        height: 70,
        selectable: true,
      });
      canvas.add(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new fabric.Circle({
        top: 100,
        left: 100,
        fill: "#00ff00",
        radius: 30,
        selectable: true,
      });
      canvas.add(circle);
    }
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "#fff";
      canvas.renderAll();
    }
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
              id="canvas"
              ref={canvasRef}
              className="border flex flex-1 flex-col rounded-lg shadow-lg"
            />
            <Settings canvas={canvas} />
          </div>
        </div>
        <div className="w-1/6 flex flex-col items-center justify-center sticky top-4">
          <div className="toolbar w-2/8 h-1/4 dark:bg-gray-800/70">
            <Flex direction="column" gap="3" align="center" className="w-full">
              <TooltipProvider>
                <Tooltip content="Draw Rectangle">
                  <IconButton
                    size="3"
                    color="white"
                    variant="soft"
                    onClick={addRectangle}
                  >
                    <div className="graphic_hover">
                      <BiRectangle size={30} className="fill-white m-2" />
                    </div>
                  </IconButton>
                </Tooltip>
                <Tooltip content="Draw Circle">
                  <IconButton
                    size="3"
                    color="white"
                    variant="soft"
                    onClick={addCircle}
                    className="toolbar-button"
                  >
                    <div className="graphic_hover">
                      <BiCircle size={30} className="fill-white m-2" />
                    </div>
                  </IconButton>
                </Tooltip>
                <Tooltip content="Clear Canvas">
                  <IconButton
                    size="3"
                    color="white"
                    variant="soft"
                    onClick={clearCanvas}
                    className="toolbar-button"
                  >
                    <div className="graphic_hover">
                      <BiEraser size={30} className="fill-white m-2" />
                    </div>
                  </IconButton>
                </Tooltip>
              </TooltipProvider>
            </Flex>
          </div>
          <div className="flex mt-5">
            <button onClick={toggleDrawing} className="cosmic-button">
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
