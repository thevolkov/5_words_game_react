import React, {useEffect, useState} from "react"
import {wordsData} from './words.ts'

const KEYS_ARRAY = [
  ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ'],
  ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
  ['Enter', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', 'Backspace']
]

const App: React.FC = () => {
  const [randomWord, setRandomWord] = useState<string>('')
  const [letter, setLetter] = useState<string>('')
  const [attemptWord, setAttemptWord] = useState<string>('')
  const [attempts, setAttempts] = useState(new Array(6).fill(null))
  const [gameOver, setGameOver] = useState(false)

  const indexOfNull = attempts.indexOf(null)

  const screenKeyHandler = (event: React.MouseEvent) => {
    const clickedKey = event.currentTarget.id

    if (attemptWord.length && clickedKey === 'Backspace') setAttemptWord(word => word.slice(0, -1))

    if (attemptWord.length < 5 || clickedKey === 'Backspace') {
      setAttemptWord(word => clickedKey === 'Backspace'
        ? word.slice(0, -1)
        : word + clickedKey
      )
    }

    if (attemptWord.length === 5 && clickedKey === 'Enter') {
      const updatedAttempts = [...attempts]
      updatedAttempts[indexOfNull] = attemptWord.toUpperCase()
      setAttempts(updatedAttempts)
      setAttemptWord('')
    }
  }

  const randomWordForGame = (): void => {
    if (!wordsData.length) return

    setRandomWord(wordsData[Math.floor(Math.random() * wordsData.length - 1)].toUpperCase())
  }

  const changeKeySymbol = (key: string): string => {
    if (key === 'Backspace') return '⌫'
    else if (key === 'Enter') return '✓'
    else return key
  }

  const disableKey = (key: string): boolean => {
    if (key === 'Enter' && attemptWord.length < 5) return true
    else return key === 'Backspace' && !attemptWord.length
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

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (attemptWord.length === 5 && event.key !== 'Backspace' && event.key !== 'Enter') return
      if (!attemptWord.length && event.key === 'Backspace') return

      setLetter(event.key)

      if (attemptWord.length && event.key === 'Backspace') setAttemptWord(word => word.slice(0, -1))

      if (attemptWord.length === 5 && event.key === 'Enter') {
        const updatedAttempts = [...attempts]
        updatedAttempts[indexOfNull] = attemptWord.toUpperCase()
        setAttempts(updatedAttempts)
        setAttemptWord('')
      }

      if (attemptWord.length === 5 || event.key.match(/[^а-яА-Я]+/g)) return
      else setAttemptWord(word => word + event.key.toUpperCase())
    }

    document.addEventListener('keydown', keyDownHandler)

    const clearLetter = setTimeout(() => setLetter(''), 300)

    if (attempts.length === 6 && attempts.every(attempt => attempt !== null) || attempts.some(attempt => attempt === randomWord)) {
      setGameOver(true)
    }

    return () => {
      document.removeEventListener('keydown', keyDownHandler)
      clearTimeout(clearLetter)
    }
  }, [attempts, indexOfNull, randomWord, attemptWord])

  return (
    <>
      <div className="game-board">
        <div
          style={{
            marginTop: '30px',
            fontSize: '35px'
          }}>{randomWord}</div>
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
                      className={
                        key.toLowerCase() === letter && attemptWord.length <= 5
                          ? 'letter keyboard-pressed'
                          : 'letter'
                      }
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
            <button
              onClick={restartGameHandler}
              className="correct-letter">
              СЫГРАТЬ ЕЩЕ РАЗ
            </button>
          </div>
        )
      }
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
