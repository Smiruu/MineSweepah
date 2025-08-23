import React, {useState} from 'react'
import { generateBoard } from '../../utils/generateBoard';

const DIFFICULTY = {
  easy: {rows: 10, cols:10, mines:10},
  medium: {rows: 20, cols: 20, mines: 40},
  hard: {rows: 50, cols:50, mines: 100}
}

function Board({difficulty}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-lg font-bold">Mines:</h3>

      <div
        className="grid gap-1 bg-gray-700 rounded-sm  p-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, 2rem)`, // fixed size
        }}
      >
        {cells.map((_, index) => (
          <div
            key={index}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 flex items-center justify-center
                       rounded-sm cursor-pointer text-black text-xs"
          >
            {/* Future: show numbers, flags, or mines */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Board
