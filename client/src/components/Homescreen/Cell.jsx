import React, { useRef } from "react";

function Cell({ revealed, flagged, onLeftClick, onRightClick }) {
  const touchTimer = useRef(null);

  const handleTouchStart = () => {
    // Long press = 600ms to flag
    touchTimer.current = setTimeout(() => {
      onRightClick();
    }, 600);
  };

  const handleTouchEnd = () => {
    clearTimeout(touchTimer.current);
  };

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center cursor-pointer rounded-sm 
        ${revealed ? "bg-transparent" : "bg-gray-400 hover:bg-gray-500 "}`}
      onClick={onLeftClick}               // tap = reveal
      onTouchStart={handleTouchStart}     // start counting for long press
      onTouchEnd={handleTouchEnd}         // cancel if released early
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();                   // PC right click = flag
      }}
    >
      {flagged && "🚩"}
    </div>
  );
}

export default Cell;
