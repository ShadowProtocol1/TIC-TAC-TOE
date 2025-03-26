'use client'
import { useState } from 'react'
import Image from "next/image";

function Square({ value, onSquareClick }) {
  return (
    <button 
      className="w-16 h-16 border border-gray-400 m-1 text-2xl font-bold hover:bg-gray-100"
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [turnCount, setTurnCount] = useState(0)
  const [moveHistory, setMoveHistory] = useState([])

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return

    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? 'X' : 'O'
    
    // Store move in history
    const move = {
      position: i,
      player: xIsNext ? 'X' : 'O',
      turn: turnCount + 1
    }
    setMoveHistory([...moveHistory, move])
    
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
    setTurnCount(turnCount + 1)
  }

  function handleReset() {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setTurnCount(0)
    setMoveHistory([])
  }

  function undoLastMove() {
    if (turnCount === 0) return
    
    const newHistory = [...moveHistory]
    newHistory.pop()
    const newSquares = Array(9).fill(null)
    
    // Reconstruct board state from remaining history
    newHistory.forEach(move => {
      newSquares[move.position] = move.player
    })
    
    setMoveHistory(newHistory)
    setSquares(newSquares)
    setXIsNext(!xIsNext)
    setTurnCount(turnCount - 1)
  }

  const winner = calculateWinner(squares)
  const status = winner 
    ? `Winner: ${winner}`
    : turnCount === 9 
    ? "Game Draw!"
    : `Next player: ${xIsNext ? 'X' : 'O'}`

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col lg:flex-row gap-4 items-start max-w-7xl w-full p-8">
        {/* Main game section */}
        <div className="flex-1 flex flex-col items-center justify-center lg:mr-[-100px]">
          <h1 className="text-4xl font-bold mb-8">Tic Tac Toe</h1>
          <div className="mb-4 text-xl font-bold">{status}</div>
          <div className="mb-4">Turn: {turnCount}</div>
          <div className="grid grid-cols-3 gap-2 mb-8">
            {Array(9).fill(null).map((_, i) => (
              <Square 
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <button 
              className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleReset}
            >
              Reset Game
            </button>
            <button 
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={undoLastMove}
              disabled={turnCount === 0}
            >
              Undo Move
            </button>
          </div>
        </div>

        {/* Move history section */}
        <div className="lg:w-[400px] bg-gray-50 p-6 rounded-lg shadow-lg sticky top-8">
          <h2 className="text-2xl font-bold mb-4">Move History</h2>
          <ul className="list-disc pl-5 max-h-[600px] overflow-y-auto">
            {moveHistory.map((move, index) => (
              <li key={index} className="mb-3 text-lg">
                Turn {move.turn}: Player {move.player} moved to position {move.position + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default function Home() {
  return <Board />
}
