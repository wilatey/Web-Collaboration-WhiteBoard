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
import useWebSocket, { ReadyState } from "react-use-websocket";

export const Dashboard = ({ username, onLogout }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const { buttonText, toggleDrawing } = useDrawingToggle(canvas);
  const [users, setUsers] = useState([]);
  const ws_URL = `ws://127.0.0.1:8000?username=${encodeURIComponent(
    username || "Guest"
  )}`;
  const { sendJsonMessage, readyState } = useWebSocket(ws_URL, {
    share: false,
    shouldReconnect: () => true,
    onMessage: (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "userUpdate") {
          setUsers(
            message.users
              .filter((u) => u.state.onlineStatus === "Online")
              .map((u) => u.username)
          );
        } else if (message.type === "draw") {
          handleDrawMessage(message);
        }
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
      }
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
    },
  });

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        type: "join",
        username: username || "Guest",
      });
    }
  }, [readyState, sendJsonMessage, username]);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawing: false,
        backgroundColor: "#fff",
        width: Math.min(window.innerWidth * 0.6, 1000),
        height: Math.min(window.innerHeight * 0.6, 700),
      });
      initCanvas.freeDrawingBrush = new fabric.PencilBrush(initCanvas);
      initCanvas.freeDrawingBrush.width = 5;
      initCanvas.freeDrawingBrush.color = "#000000";
      initCanvas.renderAll();
      setCanvas(initCanvas);

      // Sync canvas changes
      initCanvas.on("object:added", handleObjectAdded);
      initCanvas.on("object:modified", handleObjectModified);
      initCanvas.on("path:created", handlePathCreated);

      return () => {
        initCanvas.off("object:added", handleObjectAdded);
        initCanvas.off("object:modified", handleObjectModified);
        initCanvas.off("path:created", handlePathCreated);
        initCanvas.dispose();
      };
    }
  }, []);

  const handleObjectAdded = (event) => {
    const obj = event.target;
    if (obj.isType("rect") || obj.isType("circle")) {
      sendJsonMessage({
        type: "draw",
        username,
        data: {
          type: obj.type,
          width: obj.width,
          height: obj.height,
          fill: obj.fill,
        },
      });
    }
  };

  const handleObjectModified = (event) => {
    const obj = event.target;
    if (obj.isType("rect") || obj.isType("circle")) {
      sendJsonMessage({
        type: "draw",
        username,
        data: {
          type: obj.type,
          width: obj.width,
          height: obj.height,
          fill: obj.fill,
        },
      });
    }
  };

  const handlePathCreated = (event) => {
    const path = event.path;
    sendJsonMessage({
      type: "draw",
      username,
      data: {
        type: "path",
        path: path.path,
        stroke: path.stroke,
        strokeWidth: path.strokeWidth,
      },
    });
  };

  const handleDrawMessage = (message) => {
    if (message.username === username || !canvas) return;
    const { data } = message;
    if (data.type === "rect") {
      const rect = new fabric.Rect({
        fill: data.fill,
        scaleX: data.scaleX,
        scaleY: data.scaleY,
        selectable: true,
      });
      canvas.add(rect);
    } else if (data.type === "circle") {
      const circle = new fabric.Circle({
        fill: data.fill,
        scaleX: data.scaleX,
        scaleY: data.scaleY,
        selectable: true,
      });
      canvas.add(circle);
    } else if (data.type === "path") {
      const path = new fabric.Path(data.path, {
        strokeWidth: data.strokeWidth,
        fill: "",
        selectable: false,
      });
      canvas.add(path);
    }
    canvas.renderAll();
  };

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
      sendJsonMessage({
        type: "draw",
        username,
        data: { type: "clear" },
      });
    }
  };

  return (
    <div className=" bg-gray-100 flex flex-col justify-center p-2 rainbow-background text-gray-700">
      <div className="flex w-full max-h-full space-x-4 justify-center">
        <div className="w-1/8 bg-card border border-border rounded-lg p-4">
          <h2 className="text-2xl font-serif mb-2">Online Users</h2>
          <ul>
            {users.length > 0 ? (
              users.map((user, index) => (
                <li
                  key={`${user}-${index}`}
                  className="text-lg font-sans mt-2 font-bold"
                >
                  {user}
                </li>
              ))
            ) : (
              <li className="text-lg font-sans mt-2 text-gray-500">
                No users online
              </li>
            )}
          </ul>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <div className="flex justify-between w-full mb-3">
            <h1 className="text-4xl font-serif space-x-4 mb-3 flex-wrap">
              Welcome! {username}
            </h1>
            <Button onClick={onLogout} variant="soft" className="cosmic-button">
              Logout
            </Button>
          </div>
          <p className="text-xl font-sans space-x-4 mb-3 flex-wrap">
            Collaborative Whiteboard
          </p>

          <div className="flex max-h-full overflow-auto max-w-full">
            <canvas
              id="canvas"
              ref={canvasRef}
              className="border w-full flex flex-1 flex-col rounded-lg shadow-lg"
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
