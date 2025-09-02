import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { BiRectangle, BiCircle, BiEraser } from "react-icons/bi";
import { Flex, IconButton } from "@radix-ui/themes";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";
import Settings from "../component/Settings";

export const Dashboard = () => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  useEffect(() => {
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#fff",
      width: 1000,
      height: 700,
    });

    fabricCanvas.current.renderAll();

    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose();
      }
    };
  }, []);

  const addRectangle = () => {
    if (fabricCanvas.current) {
      const rect = new fabric.Rect({
        top: 100,
        left: 50,
        fill: "red",
        width: 150,
        height: 70,
      });
      fabricCanvas.current.add(rect);
    }
  };

  const addCircle = () => {
    if (fabricCanvas.current) {
      const circle = new fabric.Circle({
        top: 100,
        left: 100,
        fill: "blue",
        radius: 30,
      });
      fabricCanvas.current.add(circle);
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
            <Settings
              canvas={fabricCanvas.current}
              className="toolbar-border"
            />
          </div>
        </div>
        <div className="w-1/6 flex flex-col items-center justify-center sticky top-4">
          <div className="toolbar w-1/4 h-1/6 dark:bg-gray-800/70">
            <Flex direction="column" gap="5" align="center" className="w-full">
              <TooltipProvider>
                <Tooltip content="Draw Rectangle">
                  <IconButton
                    size="3"
                    color="white"
                    variant="soft"
                    onClick={addRectangle}
                  >
                    <BiRectangle
                      size={30}
                      className="fill-white graphic_hover m-2"
                    />
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
                    <BiCircle
                      size={30}
                      className="fill-white graphic_hover m-2"
                    />
                  </IconButton>
                </Tooltip>
              </TooltipProvider>
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
};
