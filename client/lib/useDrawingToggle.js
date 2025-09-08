import { useState, useCallback } from "react";

export const useDrawingToggle = (canvas) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [buttonText, setButtonText] = useState("Enter Drawing");

  const toggleDrawing = useCallback(() => {
    if (canvas) {
      canvas.isDrawingMode = !canvas.isDrawingMode;
      setIsDrawing(!isDrawing);
      setButtonText(canvas.isDrawingMode ? "Cancel Drawing" : "Enter Drawing");
    }
  }, [canvas, isDrawing]);

  return { isDrawing, buttonText, toggleDrawing };
};
