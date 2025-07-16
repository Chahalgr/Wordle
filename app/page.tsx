'use client';

import React, {useEffect, useRef, useState } from "react";
import { Button, Box } from "@chakra-ui/react"
// You will also need to import things from @chakra-ui/react
import {LetterClass, evaluate, evaluateLetter, randomWord, isWord} from '@/src/wordl';
import { Toaster, toaster } from "@/components/ui/toaster";


const CORRECT = 'green';
const INCORRECT = 'black';
const EMPTY = 'white';
const MISPLACED = 'yellow';

const praise = ["Genius", "Unbelievable", "Impressive", 
  "Splendid", "Good work", "Phew"];

// TODO: The solution has some helpers

const DEFAULT_LENGTH = 5;
const DEFAULT_GUESSES = 6;

export default function Page()
{
  const [target] = useState(randomWord(DEFAULT_LENGTH));
  const inputRef = useRef<HTMLInputElement>(null);
  const wordLength = DEFAULT_LENGTH;
  const numGuesses = DEFAULT_GUESSES;
  const [inputs, setInputs] = useState(Array(numGuesses).fill(null).map(() => Array(wordLength).fill("")));
  const [currRow, setCurrRow] = useState(0);
  const [guess, setGuess] = useState("");
  const line1 : string[] = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P" ];
  const line2 : string[] = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const line3 : string[] = ["Z", "X", "C", "V", "B", "N", "M"]
  const [colors, setColor] = useState(Array(numGuesses).fill(null).map(() => (Array(wordLength).fill("white"))));
  const [lineColors, setLineColor] = useState(Array(3).fill(null).map(() => Array(line1.length).fill(EMPTY)));
  useEffect(() => {
    if (guess !== "") 
    { 
      if (guess === target)
      {
        toaster.create({
          description: praise[currRow - 1],
          type: "success",
        })
        setCurrRow(() => 6); 
      }
      else if(currRow === numGuesses)
      {
        toaster.create({description : "You lost!", type : "info"});
      }
    }
  }, [guess]);
  

  function onClick(value: string, index: number)
   {
    setInputs((prev) => {
      const newInputs = prev.map((row) => [...row]);
      newInputs[currRow][index] = value;
      return newInputs; 
    });
  }

  function colorInputGrid(e: LetterClass, ind: number)
  {
      setColor((prev) => 
      {
          const newColors = prev.map((arr) => [...arr]);
          if(e === LetterClass.Misplaced)
          {
            newColors[currRow][ind] = MISPLACED;
          }
          else if (e === LetterClass.Located)
          {
            newColors[currRow][ind] = CORRECT;
          }
          else
          {
            newColors[currRow][ind] = "lightgray";
          }
          return newColors;
      })
  }

  function colorKeyboard(e: LetterClass, row:number, col: number)
  {
    setLineColor((prev: string[][]) => 
    {
      const newColors = prev.map((row) => [...row]);
      if(e === LetterClass.Located)
      {
        newColors[row][col] = CORRECT;
      }
      else if(e === LetterClass.NotPresent)
      {
        newColors[row][col] = INCORRECT;
      }
      return newColors;
    });
  }

  function onChange(letter: string)
  {
    
    if(currRow > 5)
    {
      toaster.create({description : "No more guesses", type : "error"});
      return;
    }
    const ind = inputs[currRow].indexOf("");
    if(ind !== -1)
    {
      onClick(letter, ind);
      inputRef.current?.focus();
    }
  }

  // TODO: use state
  const keyboard = () =>
  {
    const indexLine1 = 0;
    const indexLine2 = 1;
    const indexLine3 = 2;
    return(
      <><br/>
        <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "10px" }}>
          {line1.map((letter, index) => (
            <Button border = "1px solid gray" bg = {lineColors[indexLine1][index]} color = { lineColors[indexLine1][index] === EMPTY ? "black" : "white"} key = {index} onClick = {() => onChange(letter)} variant = "solid" size = 'xs'>{letter}</Button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "10px" }}>
          {line2.map((letter, index) => (
            <Button border = "1px solid gray" bg = {lineColors[indexLine2][index]} color = { lineColors[indexLine2][index] === EMPTY ? "black" : "white"} key = {index} onClick = {() => onChange(letter)} variant = "solid" size = 'xs' >{letter}</Button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "10px" }}>
          <Button border = "1px solid gray" onClick = {() => enter()} variant = "solid" size = 'xs' colorPalette = {'gray'}>Enter</Button>
          {line3.map((letter, index) => (
            <Button border = "1px solid gray" bg = {lineColors[indexLine3][index]} color = {lineColors[indexLine3][index] === EMPTY ? "black" : "white"} key = {index} onClick = {() => onChange(letter)} variant = "solid" size = 'xs'>{letter}</Button>
          ))}
          <Button border = "1px solid gray" onClick = {() => deleteKey()}  size = 'xs' >⌫</Button>
        </div>
      </>
    );
  }

  function InputGrid()
  {
    return(
      <><br/>
        <div style={{ display: "grid", gap: "10px", justifyContent: "center", marginBottom: "10px", color: 'black' }}>
          {inputs.map((row, rowIndex) => 
            <div key={rowIndex} style={{ display: "flex", gap: "10px" }}>
              {row.map((_val, colIndex: number) => 
              (
                <Box 
                  key = {colIndex}
                  style = {{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    fontSize: "20px",
                    backgroundColor: colors[rowIndex][colIndex],
                    border: "2px solid gray",}}>
                  {inputs[rowIndex][colIndex]}
                </Box>
              ))}
            </div>  
          )}
        </div> 
      </>
    )
  }
  
  function onKeyDown (e : React.KeyboardEvent) 
  {
    if(e.key === "Enter")
    {
      enter();
    }
    else if(e.key === "Backspace")
    {
      deleteKey();
    }
    else if(e.key.length === 1)
    {
      const key = e.key.toUpperCase();
      if(key >= 'A' && key <= 'Z')
      {
          onChange(key);
      }
      else
      {
        toaster.create({description : "Not a valid letter", type : "error"});
      }
    }
  }

  function deleteKey() 
  {
    if(currRow > 5)
    {
      toaster.create({description : "No more guesses", type : "error"});
      return;
    }
    if(inputs[currRow][0] == "")
    {
      toaster.create({description : "Nothing to delete", type : "error"});
      return;
    }
    let ind = -1;
    for (let i = wordLength - 1; i >= 0; --i) 
    {
      if (inputs[currRow][i] !== "") 
      {
        ind = i;
        break;
      }
    }
    if (ind !== -1) onClick("", ind);
  }

  function colorHelper(word: string) 
  {
    const targetMap: Map<string, number> = new Map(); 
    for (const letter of target)
    {
      targetMap.set(letter, (targetMap.get(letter) || 0) + 1);
    }
  
    for (let i = 0; i < word.length; i++) 
    {
      const evaluation = evaluate(word[i], i, target); 
      if (evaluation === LetterClass.Located) 
      {
        colorInputGrid(LetterClass.Located, i); 
        targetMap.set(word[i], targetMap.get(word[i])! - 1); 
      }
    }
  
    for (let i = 0; i < word.length; i++) 
    {
      if (evaluate(word[i], i, target) === LetterClass.Located) continue; 
  
      const evaluation = evaluate(word[i], i, target); 
      if (evaluation === LetterClass.Misplaced && targetMap.get(word[i])! > 0) 
      {
        colorInputGrid(LetterClass.Misplaced, i); 
        targetMap.set(word[i], targetMap.get(word[i])! - 1); 
      }
      else 
      {
        colorInputGrid(LetterClass.NotPresent, i); 
      }
    }
  }

  function enter()
  {
    if(currRow > 5)
    {
      toaster.create({description : "No more guesses", type : "error"});  
      return;
    }
    const word: string = inputs[currRow].join("").toUpperCase();
    if(word.length === 0) 
    {
      toaster.create({description: "No word entered", type : "error"});
      return;
    }
    if(!isWord(word) || word.length < 5)
    {
      toaster.create({description : `${word} is not in our dictionary`, type : "error"})
    }
    else
    {
      setGuess(() => word);
      colorHelper(word);
      const guesses : string[] = [];
      inputs.map((arr) => 
      {
        const word = arr.join("");
        guesses.push(word);
      })
      const letters = [line1, line2, line3];
      letters.map((row, rowIndex) => 
      {
        row.map((letter, colIndex) => 
        {
          const e = evaluateLetter(letter, target, guesses);
          colorKeyboard(e, rowIndex, colIndex);
        })
      })
      setCurrRow((prev) => ++prev);
    }
  }

  function Show()
  {
    return(
      <>
        <InputGrid />
        {keyboard()}
      </>
    )
  }
    // TODO: Many more helper functions

  return (
    <>
    <div data-testid="top-level" onKeyDown = {onKeyDown} tabIndex={-1} className="App">
      <div className="App-header">
        <h1 style={{textAlign: 'center', fontSize: '24px', color : 'black'}}>Wordl</h1>
      </div>
      <main>
        <Show />   
        <Toaster />
        <input
          ref={inputRef}
          style={{
            position: "absolute",
            opacity: 0,
            width: 0,
            height: 0,
            pointerEvents: "none",
          }}
        />
      </main>
    </div>
    </>
  );
}
