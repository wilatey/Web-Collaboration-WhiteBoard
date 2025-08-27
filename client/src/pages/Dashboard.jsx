import { useEffect, useRef } from "react";
import * as fabric from 'fabric';
import { BiRectangle, BiCircle } from "react-icons/bi"
import { Flex ,IconButton } from "@radix-ui/themes"


export const Dashboard = () => {
    const canvasRef = useRef(null);
    const fabricCanvas = useRef(null);

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
                fill: "red",
                width: 100,
                height: 60,
            });
            fabricCanvas.current.add(rect);
        }
    }

    const addCircle = () => {
        if (fabricCanvas.current) {
            const circle = new fabric.Circle({
                top: 100,
                left: 100,
                fill: "grey",
                radius: 50,
            });
            fabricCanvas.current.add(circle);
        }
    }

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
                        <li className="text-lg font-sans mt-5 font-bold"> U1
                        </li>
                    </ul>    
                </div>
                <div className="flex flex-1 flex-col items-center">
                    <h1 className="text-4xl font-serif mb-2">
                        Welcome!
                    </h1>
                    <p className="text-xl font-sans mb-2">
                        Collaborative Whiteboard
                    </p>
                    <div className="flex space-x-4 mb-4 flex-wrap ">
                        <button onClick={clearCanvas} className="cosmic-button">
                        Clear
                        </button>
                    </div>
                
                    <div className="flex max-h-full overflow-auto max-w-full">
                        <canvas ref={canvasRef} className="border flex flex-1 flex-col rounded-lg shadow-lg"/>
                    </div>
                </div>
                    <Flex gap="3" align="center" className="max-w-5 relative flex top-50 flex-1 flex-col justify-end items-center m-10">
                        <IconButton
                            size={1}
                            color="gray"
                            variant="classic"
                            onClick={addRectangle}
                            className="m-5"
                        >
                            <BiRectangle size={40}/>
                        </IconButton>
                        <IconButton
                            size={1}
                            color="gray"
                            variant="classic"
                            onClick={addRectangle}
                            className="m-5  "
                        >
                            <BiCircle size={40}  onClick={addCircle}/>
                        </IconButton>
                    </Flex>
            </div>
        </div>
    )
}