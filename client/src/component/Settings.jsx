import { useEffect, useState } from "react";

function Settings ({canvas}) {
    const [selectedObject, setselectedObject] = useState(null);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushSize, setBrushSize] = useState(5);
    const [width, setwidth] = useState(null);
    const [height, setheight] = useState(null);
    const [diameter, setdiameter] = useState(null);
    const [color, setcolor] = useState(null);
    const [drawing, setDrawing] = useState(false);

    useEffect(() => {

    });
    

    return (
        <>
            Test
        </>
    );
}