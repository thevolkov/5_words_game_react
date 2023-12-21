import React, {useEffect, useState} from "react"
import {wordsData} from './words.ts'

const KEYS_ARRAY = [
  ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ'],
  ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
  ['Enter', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', 'Backspace']
]

const App: React.FC = () => {
  const [randomWord, setRandomWord] = useState<string>('')
  const [attemptWord, setAttemptWord] = useState<string>('')
  const [attempts, setAttempts] = useState(new Array(6).fill(null))
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [showDictionary, setShowDictionary] = useState<boolean>(false)
  // const [letter, setLetter] = useState<string>('')

  const indexOfNull = attempts.indexOf(null)
  const enterKey = 'Enter'
  const bsKey = 'Backspace'

  const randomWordForGame = (): void => {
    if (!wordsData.length) return

    setRandomWord(wordsData[Math.floor(Math.random() * wordsData.length - 1)].toUpperCase())
  }

  const changeKeySymbol = (key: string): string => {
    if (key === bsKey) return '⌫'
    else if (key === enterKey) return '✓'
    else return key
  }

  const disableKey = (key: string): boolean => {
    if (key === enterKey && attemptWord.length < 5) return true
    else return key === bsKey && !attemptWord.length
  }

  const winOrLoseText = (): string => {
    if (gameOver && attempts.some(attempt => attempt === randomWord)) return 'ПОБЕДА 🥳'
    else return 'НЕУДАЧА ❌'
  }

  const restartGameHandler = (): void => {
    setGameOver(false)
    setAttempts(new Array(6).fill(null))
    randomWordForGame()
  }

  useEffect(() => {
    randomWordForGame()
  }, [])

  const screenKeyHandler = (event: React.MouseEvent): void => {
    const clickedKey = event.currentTarget.id

    if (attemptWord.length < 5 || clickedKey === bsKey) {
      setAttemptWord(word =>
        clickedKey === bsKey
          ? word.slice(0, -1)
          : word + clickedKey
      )
    }

    if (attemptWord.length === 5 && clickedKey === enterKey) updateAttempts()
  }

// Обработчик нажатий на клавиатуре компьютера
//   const keyDownHandler = (event: KeyboardEvent): void => {
//     const keysCheck = event.key !== bsKey && event.key !== enterKey
//
//     const shouldSkip =
//       attemptWord.length < 5 && event.key === enterKey ||
//       event.key.match(/[^а-яА-Я]+/g) && keysCheck ||
//       attemptWord.length === 5 && keysCheck ||
//       !attemptWord.length && event.key === bsKey
//
//     if (shouldSkip) return
//
//     if (attemptWord.length === 5 && event.key === enterKey) {
//       updateAttempts()
//       return
//     }
//
//     setAttemptWord(word =>
//       event.key === bsKey ? word.slice(0, -1) : word + event.key.toUpperCase()
//     )
//     setLetter(event.key)
//   }

  const updateAttempts = (): void => {
    if (indexOfNull !== -1) {
      attempts[indexOfNull] = attemptWord.toUpperCase()
      setAttempts([...attempts])
      setAttemptWord('')
    }
  }

  useEffect(() => {
    const isGameOver =
      attempts.length === 6 &&
      attempts.every(attempt => attempt !== null) ||
      attempts.some(attempt => attempt === randomWord)

    if (isGameOver) setGameOver(true)

    // document.addEventListener('keydown', keyDownHandler)
    // const clearLetter = setTimeout(() => setLetter(''), 300)

    // return () => {
    //   document.removeEventListener('keydown', keyDownHandler)
    //   clearTimeout(clearLetter)
    // }
  }, [attempts, randomWord])

  return (
    <>
      <div className="game-board">
        <WordsGrid
          attempts={attempts}
          randomWord={randomWord}
          attemptWord={attemptWord}
          indexOfNull={indexOfNull}
        />
        <div className="keyboard">
          {
            KEYS_ARRAY.map((keysRow, keysIndex) => (
              <div
                className="keys-row"
                key={keysIndex}
              >
                {
                  keysRow.map((key) => (
                    <button
                      id={key}
                      onClick={screenKeyHandler}
                      className="letter"
                      disabled={disableKey(key)}
                      key={key}
                    >
                      {changeKeySymbol(key)}
                    </button>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
      {
        gameOver && (
          <div className="game-over">
            <div>{winOrLoseText()}</div>
            <div className="random-word">
              <span>Правильное слово:</span>
              {randomWord.split('').map((letter, index) => (
                <div
                  className="letter correct-letter"
                  key={letter + index}
                >
                  {letter}
                </div>
              ))}
            </div>
            <button
              onClick={restartGameHandler}
              className="play-again-button">
              СЫГРАТЬ ЕЩЕ РАЗ
            </button>
          </div>
        )
      }
      {
          <div
            className={`dictionary ${!showDictionary && 'dictionary-closed'}`}
          >
            {
              wordsData.map(word => (
                <p key={word}>{word}</p>
              ))
            }
          </div>
      }
      <div
        onClick={() => setShowDictionary(!showDictionary)}
        className={`dictionary-toggle ${!showDictionary && 'dictionary-toggle-closed'}`}
      >
        {
          showDictionary
            ? "❌"
            : "📗"
        }
      </div>
    </>
  )
}

export default App

interface IWordsGridProps {
  attempts: string[] | null[]
  randomWord: string
  attemptWord: string
  indexOfNull: number
}

const WordsGrid: React.FC<IWordsGridProps> = (
  {
    attempts,
    randomWord,
    attemptWord,
    indexOfNull
  }
) => {

  const colorOfLetter = (
    randomWord: string,
    attempt: string,
    letterIndex: number
  ): string | void => {

    if (!attempt) return

    const isCorrectLetter = attempt[letterIndex] === randomWord[letterIndex]
    const isWrongPositionLetter = randomWord.includes(attempt[letterIndex]) &&
      attempt[letterIndex] !== randomWord[letterIndex]
    const isWrongLetter = !randomWord.includes(attempt[letterIndex])

    if (isCorrectLetter) {
      return 'correct-letter'
    } else if (isWrongPositionLetter) {
      return 'wrong-position-letter'
    } else if (isWrongLetter) {
      return 'wrong-letter'
    } else {
      return
    }
  }

  return (
    <>
      <div className="attempts">
        {
          attempts.map((attempt, rowIndex) => (
            <div
              className="row"
              key={rowIndex}
            >
              {
                [1, 2, 3, 4, 5].map((letter, letterIndex) => (
                  <div
                    className={`${attempt && colorOfLetter(randomWord, attempt, letterIndex)} letter`}
                    key={letter + letterIndex}
                  >
                    {
                      rowIndex === indexOfNull
                        ? attemptWord[letterIndex]
                        : (attempt && attempt[letterIndex])
                    }
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </>
  )
}
