import { useEffect, useState, useRef } from "react";

export default function Draw(props) {

    const canvasRef = useRef(null);
    const [ctx, setCtx] = useState(null);
    const [selectedTool, setSelectedTool] = useState('pencil');
    const [selectedColor, setSelectedColor] = useState('black');
    const [selectedWidth, setSelectedWidth] = useState(2);
    const [filledColor, setFilledColor] = useState(false);
    let isMouseDown = false;
    let prevX = 0, prevY = 0;

    useEffect(() => {
        const canva = canvasRef.current;
        const context = canva.getContext('2d');
        setCtx(context);
        const updateCanvasSize = () => {
            const parentDiv = canva.parentElement;
            canva.width = parentDiv.clientWidth;
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };

    }, [props.showBoard])

    const handleMouseDown = (e) => {
        const { clientX, clientY } = e;
        const { top, left } = canvasRef.current.getBoundingClientRect();
        const offsetX = clientX - left;
        const offsetY = clientY - top;
        ctx.beginPath();
        prevX = offsetX;
        prevY = offsetY;
        canvasRef.current.addEventListener('mousemove', handleMouseMove);
        canvasRef.current.addEventListener('mouseup', handleMouseUp);
        isMouseDown = true; // Set the flag to true when mouse is down
    }

    const handleMouseUp = () => {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
        canvasRef.current.removeEventListener('mouseup', handleMouseUp);
        ctx.save();
        isMouseDown = false; // Set the flag to false when mouse is up
    }

    const drawLine = (e) => {
        const { clientX, clientY } = e;
        const { left, top } = canvasRef.current.getBoundingClientRect();
        const offsetX = clientX - left;
        const offsetY = clientY - top;
        const path = new Path2D();
        path.moveTo(prevX, prevY);
        path.lineTo(offsetX, offsetY);
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = selectedWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke(path);
    };
    
    const drawRectangle = (e) => {
        const { clientX, clientY } = e;
        const { left, top } = canvasRef.current.getBoundingClientRect();
        const offsetX = clientX - left;
        const offsetY = clientY - top;
        const width = offsetX - prevX;
        const height = offsetY - prevY;
        const path = new Path2D();
        path.rect(prevX, prevY, width, height);
        if (filledColor) {
            ctx.fillStyle = selectedColor;
            ctx.fill(path);
        } else {
            ctx.strokeStyle = selectedColor;
            ctx.lineWidth = selectedWidth;
            ctx.stroke(path);
        }
    };
    
    const drawCircle = (e) => {
        const { clientX, clientY } = e;
        const { left, top } = canvasRef.current.getBoundingClientRect();
        const offsetX = clientX - left;
        const offsetY = clientY - top;
        const radius = Math.sqrt(Math.pow((prevX - offsetX), 2) + Math.pow((prevY - offsetY), 2));
        const path = new Path2D();
        path.arc(prevX, prevY, radius, 0, Math.PI * 2);
        if (filledColor) {
            ctx.fillStyle = selectedColor;
            ctx.fill(path);
        } else {
            ctx.strokeStyle = selectedColor;
            ctx.lineWidth = selectedWidth;
            ctx.stroke(path);
        }
    };
    
    const drawTriangle = (e) => {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY); 
        ctx.lineTo(e.offsetX, e.offsetY); 
        ctx.lineTo(prevX * 2 - e.offsetX, e.offsetY); 
        ctx.closePath(); 
        filledColor ? ctx.fill() : ctx.stroke(); 
    }
    

    const handleMouseMove = (e) => {
        if (isMouseDown) { // Check the flag to draw shapes only when mouse is down
            if (selectedTool == 'line') {
                drawLine(e);
            }
            else if (selectedTool == 'pencil' || selectedTool == 'erasor') {
                ctx.strokeStyle = selectedTool == 'pencil' ? selectedColor : '#fff';
                const { top, left } = canvasRef.current.getBoundingClientRect();
                ctx.lineTo(e.clientX - left, e.clientY - top);
                ctx.stroke();
            }
            else if (selectedTool == 'rectangle') {
                drawRectangle(e);
            }
            else if (selectedTool == 'circle') {
                drawCircle(e);
            }
            else if (selectedTool == 'triangle') {
                drawTriangle(e);
            }
            else if (selectedTool == 'addText') {
                addText(e);
            }
        }
    }

    return (
        <div className={`w-full ${props.showBoard ? 'visible' : 'hidden'} relative`}>
            <div className="absolute left-0 w-20 h-full space-y-1 px-2 z-50 bg-white bg-opacity-50">
                <div className="p-3 rounded-full shadow-xl shadow-blue-800 w-fit">
                    <img src="/editing/brushes.png" className="w-6 h-10" alt="Brushes" />
                </div>
                <div onClick={()=>{setSelectedTool('circle')}} className="p-3 rounded-full shadow-xl shadow-blue-800 w-fit">
                    <img src="/editing/circle.png" className="w-6 h-6" alt="Circle" />
                </div>
                <div onClick={()=>{setSelectedTool('line')}} className="p-3 rounded-full shadow-xl shadow-blue-800 w-fit">
                    <img src="/editing/diagonal-line.png" className="w-6 h-6" alt="Diagonal Line" />
                </div>
                <div onClick={()=>{setSelectedTool('erasor')}} className="p-3 rounded-full shadow-xl shadow-blue-800 w-fit">
                    <img src="/editing/erasor.png" className="w-6 h-6" alt="Eraser" />
                </div>
                <div onClick={()=>{setSelectedTool('addText')}} className="p-3 rounded-full shadow-xl shadow-blue-800 w-fit">
                    <img src="/editing/ext.png" className="w-6 h-6" alt="Ext" />
                </div>
                <div className="relative inline-block p-3 rounded-full shadow-xl shadow-blue-800 w-fit">
                    <input type="color" id="multicolor-file" className=" hidden" accept="image/*" />
                    <label htmlFor="multicolor-file">
                        <img src="/editing/multicolor.png" alt="Multicolor" className="w-7 h-7" />
                    </label>
                </div>

                <div onClick={()=>{setSelectedTool('pencil')}} className="p-3 rounded-full shadow-xl shadow-blue-800 w-fit">
                    <img src="/editing/pencil.png" className="w-6 h-6" alt="Pencil" />
                </div>
                <div onClick={()=>{setSelectedTool('rectangle')}} className="p-3 rounded-full shadow-xl shadow-blue-800 w-fit">
                    <img src="/editing/rectangle.png" className="w-6 h-6" alt="Rectangle" />
                </div>
                <div onClick={()=>{setSelectedTool('triangle')}} className="p-3 rounded-full shadow-xl shadow-blue-800 w-fit">
                    <img src="/editing/triangle.png" className="w-6 h-6" alt="Triangle" />
                </div>
            </div>

            <canvas width={300} height={500} onMouseDown={handleMouseDown} ref={canvasRef} className={`rounded-md bg-white`}></canvas>
        </div>
    )
}