import React, {useEffect, useMemo, useState} from "react"
import {wordsData} from './words.ts'

// const YA_API_URL = 'https://dictionary.yandex.net/api/v1/dicservice.json'
const KEYS_ARRAY = ['Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', 'Backspace']

// const WORD_LENGHT = 5

const App: React.FC = () => {
  const [word, setWord] = useState<string>('')
  const [letter, setLetter] = useState<string>('');
  const [attempts, setAttempts] = useState(new Array(6).fill(null))

  const randomWord = useMemo(() => {
    if (!wordsData.length) return

    return wordsData[Math.floor(Math.random() * wordsData.length - 1)].toUpperCase()
  }, [])

  const screenKeyPressHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const clickedKey = event.currentTarget.id

    if (word.length < 5 || clickedKey === 'Backspace') {
      setWord(prevWord => clickedKey === 'Backspace'
        ? prevWord.slice(0, -1)
        : prevWord + clickedKey
      )
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setLetter(event.key.toUpperCase())

      if (word.length && event.key === 'Backspace') setWord(word => word.slice(0, -1))

      if (word.length === 5 && event.key === 'Enter') {
        if (attempts.every(item => item !== null)) return

        const updatedAttempts = [...attempts]
        const indexOfNull = updatedAttempts.indexOf(null)
        updatedAttempts[indexOfNull] = word.toUpperCase()
        setAttempts(updatedAttempts)
        setWord('')
      }

      if (word.length >= 5 || event.key.match(/[^а-яА-Я]+/g)) return
      else setWord(word => word + event.key)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [attempts, word, word.length])

  // Todo: Здесь будет логика проверка слова
  // useEffect(() => {
  //   fetch(`${YA_API_URL}/lookup?key=${import.meta.env.VITE_API_KEY}&lang=ru-ru&text=${WORD}`)
  //     .then(resolve => resolve.json())
  //     .then(data => console.log(data, 'API Словаря Яндекс', WORD))
  // }, [])

  return (
    <>
      <div className="game-board">
        <div style={{color: 'green', marginTop: '30px', fontSize: '35px'}}>{randomWord}</div>
        <div>СЛОВО: {word.toUpperCase()}</div>
        <WordsGrid attempts={attempts}/>
        <div className="keyboard">
          {
            KEYS_ARRAY.map((keyboardKey) => (
              <div
                id={keyboardKey}
                onClick={screenKeyPressHandler}
                className={
                  keyboardKey.toUpperCase() === letter && word.length < 5
                    ? 'letter keyboard-pressed'
                    : 'letter'
                }
                key={keyboardKey}
              >
                {
                  keyboardKey === 'Backspace'
                    ? '⌫'
                    : keyboardKey
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

const WordsGrid: React.FC<{ attempts: string[] }> = ({attempts}) => {
  return (
    <>
      <div className="attempts">
        {
          attempts.map((_value, index) => (
            <div className="row" key={index}>
              <div className="letter"></div>
              <div className="letter"></div>
              <div className="letter"></div>
              <div className="letter"></div>
              <div className="letter"></div>
            </div>
          ))
        }
      </div>
    </>
  )
}