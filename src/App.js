import { useState, useEffect } from "react";
import ScoreBoard from "./components/ScoreBoard";
import blueCandy from './images/blue-candy.png';
import greenCandy from './images/green-candy.png';
import orangeCandy from './images/orange-candy.png';
import purpleCandy from './images/purple-candy.png';
import redCandy from './images/red-candy.png';
import yelloCandy from './images/yellow-candy.png';
import blank from './images/blank.png';

const width = 8;
const candyColors = [
    blueCandy,
    greenCandy,
    orangeCandy,
    purpleCandy,
    redCandy,
    yelloCandy,  
];

const App = () => {
  const [currentColorAggrangement, setCurrentColorArragement] = useState();
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const checkForColumnOfFour = () => {
    if (!currentColorAggrangement) return;

    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorAggrangement[i];
      const isBlank = currentColorAggrangement[i] === blank;

      if (columnOfFour.every((square) => currentColorAggrangement[square] === decidedColor && !isBlank)) {
          setScoreDisplay((score) => score + 4);
          columnOfFour.forEach(square =>currentColorAggrangement[square] = blank);
          return true;
      }
    }
  };

  const checkForRowOfFour = () => {
    if (!currentColorAggrangement) return;

    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorAggrangement[i];
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64];
      const isBlank = currentColorAggrangement[i] === blank;

      if (notValid.includes(i)) continue;

      if (rowOfFour.every((square) => currentColorAggrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 4);  
        rowOfFour.forEach(square =>currentColorAggrangement[square] = blank)
          return true;
      }
    }
  };

  const checkForColumnOfThree = () => {
    if (!currentColorAggrangement) return;

    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorAggrangement[i];
      const isBlank = currentColorAggrangement[i] === blank;

      if (columnOfThree.every((square) => currentColorAggrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3);
          columnOfThree.forEach(square =>currentColorAggrangement[square] = blank);
          return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    if (!currentColorAggrangement) return;

    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorAggrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
      const isBlank = currentColorAggrangement[i] === blank;

      if (notValid.includes(i)) continue;

      if (rowOfThree.every((square) => currentColorAggrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay((score) => score + 3);
          rowOfThree.forEach(square =>currentColorAggrangement[square] = blank);
          return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
        if (!currentColorAggrangement) return;

        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);

        if (isFirstRow && currentColorAggrangement[i] === blank) {
            let randomNumber = Math.floor(Math.random() * candyColors.length);
            currentColorAggrangement[i] = candyColors[randomNumber];
        }

        if ((currentColorAggrangement[i + width]) === blank) {
            currentColorAggrangement[i + width] = currentColorAggrangement[i];
            currentColorAggrangement[i] = blank;
        }
    }
  }

  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  }

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  }

  const dragEnd = (e) => {
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));

    currentColorAggrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');
    currentColorAggrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');

    const validMoves = [
      squareBeingDraggedId - 1, 
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isARowOfFour = checkForRowOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfThree = checkForRowOfThree();

    if (squareBeingReplacedId &&
        validMove && 
        (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } 
    else {
      currentColorAggrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
      currentColorAggrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');
      setCurrentColorArragement([...currentColorAggrangement]);
    }
  }

  const createdBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomNumber = Math.floor(Math.random() * candyColors.length);
      const randomColor = candyColors[randomNumber];
      randomColorArrangement.push(randomColor);
    }

    setCurrentColorArragement(randomColorArrangement);
  };

  useEffect(() => {
    createdBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow()
      setCurrentColorArragement([...currentColorAggrangement]);
    }, 100)

    return () => clearInterval(timer);

  }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorAggrangement]);

  return (
    <div className="app">
      <div className="game">
        {currentColorAggrangement?.map((candyColor, index) => (
          <img
            key={index}
            alt={candyColor}
            src={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
};

export default App;
