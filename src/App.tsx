import React, {useEffect, useMemo, useState} from "react"
import {wordsData} from './words.ts'

// const YA_API_URL = 'https://dictionary.yandex.net/api/v1/dicservice.json'
const KEYS_ARRAY = [
  ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ'],
  ['Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э'],
  ['Enter', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', 'Backspace']
]

const App: React.FC = () => {
  const [word, setWord] = useState<string>('')
  const [letter, setLetter] = useState<string>('')
  // const [checkWord, setCheckWord] = useState<boolean>(false)
  const [attempts, setAttempts] = useState(new Array(6).fill(null))

  const randomWord = useMemo(() => {
    if (!wordsData.length) return

    return wordsData[Math.floor(Math.random() * wordsData.length - 1)]
  }, [])

  // const checkWordHandler = async (word: string) => {
  //   return await fetch(`${YA_API_URL}/lookup?key=${import.meta.env.VITE_API_KEY}&lang=ru-ru&text=${word}`)
  //     .then(resolve => resolve.json())
  //     .then(data => {
  //       console.log(data.def.length)
  //     })
  // }

  const screenKeyHandler = (event: React.MouseEvent) => {
    const clickedKey = event.currentTarget.id

    if (word.length < 5 || clickedKey === 'Backspace') {
      setWord(word => clickedKey === 'Backspace'
        ? word.slice(0, -1)
        : word + clickedKey
      )
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (attempts.length === 6 && attempts.every(attempt => attempt !== null)) return
      if (word.length === 5 && event.key !== 'Backspace' && event.key !== 'Enter') return
      if (!word.length && event.key === 'Backspace') return

      setLetter(event.key)

      if (word.length && event.key === 'Backspace') setWord(word => word.slice(0, -1))

      if (word.length === 5 && event.key === 'Enter') {
        // if (attempts.every(item => item !== null)) return

        const updatedAttempts = [...attempts]
        const indexOfNull = updatedAttempts.indexOf(null)
        updatedAttempts[indexOfNull] = word
        setAttempts(updatedAttempts)
        setWord('')
      }

      if (word.length === 5 || event.key.match(/[^а-яА-Я]+/g)) return
      else setWord(word => word + event.key)
    }

    document.addEventListener('keydown', handleKeyDown)

    const clearLetter = setTimeout(() => setLetter(''), 300)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(clearLetter)
    }
  }, [attempts, word])

  return (
    <>
      <div className="game-board">
        <div style={{color: 'green', marginTop: '30px', fontSize: '35px'}}>{randomWord}</div>
        <div>СЛОВО: {word}</div>
        <WordsGrid attempts={attempts} word={word}/>
        <div className="keyboard">
          {
            KEYS_ARRAY.map((keysRow, keysIndex) => (
              <div className="keys-row" key={keysIndex}>
                {
                  keysRow.map((key) => (
                    <button
                      id={key}
                      onClick={screenKeyHandler}
                      className={
                        key.toLowerCase() === letter && word.length <= 5
                          ? 'letter keyboard-pressed'
                          : 'letter'
                      }
                      disabled={key === 'Backspace' || key === 'Enter'}
                      key={key}
                    >
                      {
                        key === 'Backspace'
                          ? '⌫'
                          : key === 'Enter'
                            ? '✓'
                            : key
                      }
                    </button>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default App


const WordsGrid: React.FC<{ attempts: string[] | null[], word: string }> = ({attempts, word}) => {

  const indexOfNull = [...attempts].indexOf(null)

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
                    className="letter"
                    key={letter + letterIndex}
                  >
                    {/*{attempt && attempt[letterIndex]}*/}
                    {rowIndex === indexOfNull ? word[letterIndex] : (attempt && attempt[letterIndex])}
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