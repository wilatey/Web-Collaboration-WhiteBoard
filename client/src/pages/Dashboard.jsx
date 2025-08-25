import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as fabric from 'fabric';


export const Dashboard = () => {
    const { state } = useLocation();
    const username = state?.username || "Guest";
    const canvasRef = useRef(null);
    const fabricCanvas = useRef(null);
    const wsRef = useRef(null);
    const [userOnline, setUsersOnline] = useState([]);
    const [drawing, setDrawing] = useState(true);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(5);

    useEffect(() => { 

        fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: true,
            backgroundColor: 'white',
            width: 2200,
            height: 900,
        });

        if (fabricCanvas.current.freeDrawingBrush) {
            fabricCanvas.current.freeDrawingBrush.color = brushColor;
            fabricCanvas.current.freeDrawingBrush.width = brushSize;
        }   
        
        fabricCanvas.current.on('path:created', (event) => { 
            const path = event.path;
            path.set({id : uuidv4()});
            const serializedPath = {
                type: 'draw',
                data: path.toObject(['id']),
            };
            wsRef.current.send(JSON.stringify(serializedPath));
            console.log("Path sent:", serializedPath);
        })

    fabricCanvas.current.on("object:modified", (event) => {
        const obj = event.target;
        if (obj && obj.id) {
            const serializedObj = {
            type: "modify",
            id: obj.id,
            data: obj.toObject(["id"]),
            };
            wsRef.current.send(JSON.stringify(serializedObj));
            console.log("Sent modified object:", serializedObj);
        }
    });


        wsRef.current = new WebSocket(`ws://localhost:8000?username=${encodeURIComponent(username)}`);        
        wsRef.onopen = () => { 
            console.log("Connected to WebSocket server");
            wsRef.send(JSON.stringify({ type: 'join', username }));
        }
        
        wsRef.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("WebSocket Received message:", message);
            switch (message.type) {
                case "userUpdate":
                    setUsersOnline(message.users || []);
                    console.log("Users:", message.users);
                    break;
                case "draw":
                    fabric.util.enlivenObjects([message.data], (objects) => {
                        const newObj = objects[0];
                        newObj.id = message.data.id;
                        if (!fabricCanvas.current.getObjects().find((obj) => obj.id === newObj.id)) {
                            fabricCanvas.current.add(newObj);
                            fabricCanvas.current.renderAll();
                        }
                    }, fabric);
                    break;
                case "modify":
                    fabricCanvas.current.getObjects().forEach((obj) => {
                        if (obj.id === message.id) {
                            fabric.util.enlivenObjects([message.data], (objects) => {
                                obj.set(objects[0]);
                                obj.setCoords();
                                fabricCanvas.current.renderAll();
                            }, fabric);
                        }
                    });
                    break;
                default:
                    console.warn("Unknown message type:", message.type);
            }
        }
                    
        wsRef.onclose = () => {
            console.log("WebSocket connection closed");
        }
        wsRef.onerror = (error) => {
            console.error("WebSocket error:", error);
        }

        return () => { 
            fabricCanvas.current.dispose();
            wsRef.current.close();
        }
    }, [username, brushColor, brushSize, drawing]);

    const toggleDrawingMode = () => {
        setDrawing(!drawing);
        fabricCanvas.current.isDrawingMode = !drawing;
    };

    const clearCanvas = () => {
        fabricCanvas.current.clear();
        fabricCanvas.current.backgroundColor = "white";
        fabricCanvas.current.renderAll();
        wsRef.current.send(JSON.stringify({ type: "clear" }));
    };

    return (
        <div className="w-full bg-gray-100 flex flex-col items-start justify-center p-5 rainbow-background">
            <div className="flex w-full space-x-2">
                <div className="w-1/8 bg-card border border-border rounded-lg p-4">
                    <h2 className="text-2xl font-serif mb-2">Online Users</h2>
                    <ul>
                        {userOnline.map((user) => (
                        <li key={user.username} className="text-lg font-sans">
                            {user.username} ({user.state.onlineStatus})
                        </li>
                        ))}
                        </ul>    
                </div>
                <div className="flex-1 flex flex-col items-center">
                    <h1 className="text-4xl font-serif mb-2">Welcome, {username}!</h1>
                    <p className="text-xl font-sans mb-2">Collaborative Whiteboard</p>

                    <div className="flex space-x-4 mb-4">
                        <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => setBrushColor(e.target.value)}
                        className="w-12 h-12"
                        />
                        <input
                        type="number"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        min="1"
                        max="50"
                        className="w-16 p-2 border border-input rounded-md"
                        />
                        <button onClick={toggleDrawingMode} className="cosmic-button">
                        {drawing ? "Select Mode" : "Draw Mode"}
                        </button>
                        <button onClick={clearCanvas} className="cosmic-button">
                        Clear Canvas
                        </button>
                    </div>
                    <canvas ref={canvasRef} className="border flex flex-col border-gray-300 rounded-lg shadow-lg" />
                </div>
            </div>
        </div>
    )
}