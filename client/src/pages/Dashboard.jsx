// Dashboard.jsx (updated for collaborative syncing with unique IDs, full object data, and remote update flag to prevent loops)
import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { BiRectangle, BiCircle, BiEraser } from "react-icons/bi";
import { Button, Flex, IconButton } from "@radix-ui/themes";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";
import Settings from "../component/Settings";
import { useDrawingToggle } from "../../lib/useDrawingToggle";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { v4 as uuidv4 } from "uuid";

export const Dashboard = ({ username, onLogout }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const { buttonText, toggleDrawing } = useDrawingToggle(canvas);
  const [users, setUsers] = useState([]);
  const [isRemoteUpdate, setIsRemoteUpdate] = useState(false);
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

      const throttle = (func, delay) => {
        let last = 0;
        return (...args) => {
          const now = Date.now();
          if (now - last > delay) {
            last = now;
            func(...args);
          }
        };
      };

      const throttledSendObject = throttle((obj) => {
        sendObjectUpdate(obj);
      }, 50);

      initCanvas.on("object:added", handleObjectAdded);
      initCanvas.on("object:modified", handleObjectModified);
      initCanvas.on("path:created", handlePathCreated);
      initCanvas.on("object:moving", (e) => throttledSendObject(e.target));
      initCanvas.on("object:scaling", (e) => throttledSendObject(e.target));
      initCanvas.on("object:rotating", (e) => throttledSendObject(e.target));

      return () => {
        initCanvas.off("object:added", handleObjectAdded);
        initCanvas.off("object:modified", handleObjectModified);
        initCanvas.off("path:created", handlePathCreated);
        initCanvas.off("object:moving", (e) => throttledSendObject(e.target));
        initCanvas.off("object:scaling", (e) => throttledSendObject(e.target));
        initCanvas.off("object:rotating", (e) => throttledSendObject(e.target));
        initCanvas.dispose();
      };
    }
  }, []);

  const sendObjectUpdate = (obj) => {
    if (!obj.id) return;
    const common = {
      id: obj.id,
      left: obj.left,
      top: obj.top,
      scaleX: obj.scaleX,
      scaleY: obj.scaleY,
      angle: obj.angle,
    };
    let specific = {};
    if (obj.type === "rect") {
      specific = {
        type: "rect",
        width: obj.width,
        height: obj.height,
        fill: obj.fill,
      };
    } else if (obj.type === "circle") {
      specific = {
        type: "circle",
        radius: obj.radius,
        fill: obj.fill,
      };
    } else if (obj.type === "path") {
      specific = {
        type: "path",
        path: obj.path,
        stroke: obj.stroke,
        strokeWidth: obj.strokeWidth,
      };
    } else {
      return;
    }
    sendJsonMessage({
      type: "draw",
      username,
      data: { ...specific, ...common },
    });
  };

  const handleObjectAdded = (event) => {
    if (isRemoteUpdate) return;
    const obj = event.target;
    if (obj.type === "path") return; // Handled in path:created
    sendObjectUpdate(obj);
  };

  const handleObjectModified = (event) => {
    if (isRemoteUpdate) return;
    const obj = event.target;
    sendObjectUpdate(obj);
  };

  const handlePathCreated = (event) => {
    if (isRemoteUpdate) return;
    const path = event.path;
    path.id = uuidv4();
    sendObjectUpdate(path);
  };

  const handleDrawMessage = (message) => {
    const data = message.data;
    if (data.type === "clear") {
      setIsRemoteUpdate(true);
      canvas.clear();
      setIsRemoteUpdate(false);
      return;
    }

    const existingObj = canvas.getObjects().find((obj) => obj.id === data.id);
    setIsRemoteUpdate(true);

    if (existingObj) {
      existingObj.set({
        left: data.left,
        top: data.top,
        scaleX: data.scaleX,
        scaleY: data.scaleY,
        angle: data.angle,
      });
      if (data.type === "rect") {
        existingObj.set({
          width: data.width,
          height: data.height,
          fill: data.fill,
        });
      } else if (data.type === "circle") {
        existingObj.set({
          radius: data.radius,
          fill: data.fill,
        });
      } else if (data.type === "path") {
        existingObj.set({
          path: data.path,
          stroke: data.stroke,
          strokeWidth: data.strokeWidth,
        });
      }
      existingObj.setCoords();
    } else {
      let newObj;
      if (data.type === "rect") {
        newObj = new fabric.Rect({
          id: data.id,
          left: data.left,
          top: data.top,
          width: data.width,
          height: data.height,
          scaleX: data.scaleX,
          scaleY: data.scaleY,
          angle: data.angle,
          fill: data.fill,
        });
      } else if (data.type === "circle") {
        newObj = new fabric.Circle({
          id: data.id,
          left: data.left,
          top: data.top,
          radius: data.radius,
          scaleX: data.scaleX,
          scaleY: data.scaleY,
          angle: data.angle,
          fill: data.fill,
        });
      } else if (data.type === "path") {
        newObj = new fabric.Path(data.path, {
          id: data.id,
          left: data.left,
          top: data.top,
          scaleX: data.scaleX,
          scaleY: data.scaleY,
          angle: data.angle,
          stroke: data.stroke,
          strokeWidth: data.strokeWidth,
          fill: "",
        });
      }
      if (newObj) {
        canvas.add(newObj);
      }
    }
    canvas.renderAll();
    setIsRemoteUpdate(false);
  };

  const addRectangle = () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 50,
      height: 50,
      fill: canvas.freeDrawingBrush.color || "red",
      id: uuidv4(),
    });
    canvas.add(rect);
  };

  const addCircle = () => {
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 25,
      fill: canvas.freeDrawingBrush.color || "blue",
      id: uuidv4(),
    });
    canvas.add(circle);
  };

  const clearCanvas = () => {
    canvas.clear();
    sendJsonMessage({
      type: "draw",
      username,
      data: { type: "clear" },
    });
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
            <botton
              onClick={onLogout}
              variant="soft"
              className="text-stone-800 cosmic-button flex items-center justify-center"
            >
              Logout
            </botton>
          </div>
          <p className="text-2xl font-sans font-bold space-x-4 mb-3 flex-wrap">
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
          <div className="toolbar w-2/8 h-1/3 dark:bg-gray-800/70">
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
