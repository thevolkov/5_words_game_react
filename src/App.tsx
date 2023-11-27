import {useEffect, useMemo, useState} from "react"
import {wordsData} from './words.ts'

const WORD = 'Жесть'

function App() {
  const [word, setWord] = useState<string>('')
  // const [attempt, setAttempt] = useState<string[]>(new Array(6).fill(null))

  const randomWord = useMemo(() => {
    if(!wordsData.length) return

    return wordsData[Math.floor(Math.random() * wordsData.length - 1)]
  },[])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (word.length && event.key === 'Backspace') {
        setWord(word => word.slice(0, word.length - 1))
      }

      if (word.length === 5 && event.key === 'Enter') {
        console.log('Enter')
      }

      if (word.length >= 5 || event.key.match(/[^а-яА-Я]+/g)) return
      setWord(word => word + event.key)
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [word.length])

  useEffect(() => {
    fetch(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=
    ${import.meta.env.VITE_API_KEY}&lang=ru-ru&text=${WORD}`)
      .then(resolve => resolve.json())
      .then(data => console.log(data, 'API Словаря Яндекс', WORD))
  }, [])

  return (
    <>
      <div>Слово: {word}</div>
      {randomWord}
    </>
  )
}

export default App
