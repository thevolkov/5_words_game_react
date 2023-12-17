import {useEffect, useMemo, useState} from "react"
import {wordsData} from './words.ts'

const YA_API_URL = 'https://dictionary.yandex.net/api/v1/dicservice.json'
const WORD = 'Жесть'
// const WORD_LENGHT = 5

function App() {
  const [word, setWord] = useState<string>('')
  const [attempts, setAttempts] = useState(new Array(6).fill(null))

  const randomWord = useMemo(() => {
    if(!wordsData.length) return

    return wordsData[Math.floor(Math.random() * wordsData.length - 1)].toUpperCase()
  },[])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (word.length && event.key === 'Backspace') setWord(word => word.slice(0, word.length - 1))

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

  useEffect(() => {
    fetch(`${YA_API_URL}/lookup?key=${import.meta.env.VITE_API_KEY}&lang=ru-ru&text=${WORD}`)
      .then(resolve => resolve.json())
      .then(data => console.log(data, 'API Словаря Яндекс', WORD))
  }, [])

  console.log()
  return (
    <>
      <div style={{color: 'green', marginBottom: '30px'}}>{randomWord}</div>
      <div>{word.toUpperCase()}</div>
      <div style={{margin: '30px 0'}}>
        {
          attempts.map((attempt, index) => (
            <div key={attempt + index}>{attempt}</div>
          ))
        }
      </div>
      <WordsGrid attempts={attempts}/>
    </>
  )
}

export default App

function WordsGrid({attempts}: {attempts: string[]}) {

  console.log(attempts)

  return (
    <>
      <div className="attempts">
        <div className="row">
          <div className="letter">Б</div>
          <div className="letter">у</div>
          <div className="letter">к</div>
          <div className="letter">в</div>
          <div className="letter">а</div>
        </div>
      </div>
    </>
  )
}