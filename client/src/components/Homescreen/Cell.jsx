import React from "react";

function Cell({ revealed, flagged, onLeftClick, onRightClick }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center  cursor-pointer 
        ${revealed ? "bg-transparent" : "bg-gray-400 hover:bg-gray-500 "}`}
      onClick={onLeftClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
    >
      {flagged && "🚩"}
    </div>
  );
}

export default Cell;
