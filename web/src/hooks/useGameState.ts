import { useState, useCallback, useMemo } from 'react'
import wordsData from '../data/words.json'

export type Level = 'Easy' | 'Medium' | 'Hard'

export interface GameState {
  playerName: string
  level: Level
  score: number
  lives: number
  wordIndex: number
  words: string[]
  isGameOver: boolean
}

interface UseGameStateReturn extends GameState {
  currentWord: string | null
  totalWords: number
  nextWord: () => void
  addScore: (points: number) => void
  loseLife: () => void
  resetGame: (playerName?: string, level?: Level) => void
  setPlayerName: (name: string) => void
  setLevel: (level: Level) => void
}

const INITIAL_LIVES = 3

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function getWordsForLevel(level: Level): string[] {
  return shuffleArray(wordsData[level] ?? [])
}

export function useGameState(
  initialPlayerName = '',
  initialLevel: Level = 'Easy',
): UseGameStateReturn {
  const [playerName, setPlayerName] = useState(initialPlayerName)
  const [level, setLevel] = useState<Level>(initialLevel)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(INITIAL_LIVES)
  const [wordIndex, setWordIndex] = useState(0)
  const [words, setWords] = useState<string[]>(() => getWordsForLevel(initialLevel))

  const isGameOver = lives <= 0 || wordIndex >= words.length

  const currentWord = useMemo(() => {
    if (wordIndex < words.length) return words[wordIndex]
    return null
  }, [words, wordIndex])

  const nextWord = useCallback(() => {
    setWordIndex((prev) => prev + 1)
  }, [])

  const addScore = useCallback((points: number) => {
    setScore((prev) => prev + points)
  }, [])

  const loseLife = useCallback(() => {
    setLives((prev) => Math.max(0, prev - 1))
  }, [])

  const resetGame = useCallback(
    (newPlayerName?: string, newLevel?: Level) => {
      const resolvedLevel = newLevel ?? level
      setPlayerName(newPlayerName ?? playerName)
      setLevel(resolvedLevel)
      setScore(0)
      setLives(INITIAL_LIVES)
      setWordIndex(0)
      setWords(getWordsForLevel(resolvedLevel))
    },
    [level, playerName],
  )

  // When level changes externally, reload the word list
  const handleSetLevel = useCallback((newLevel: Level) => {
    setLevel(newLevel)
    setWords(getWordsForLevel(newLevel))
    setWordIndex(0)
    setScore(0)
    setLives(INITIAL_LIVES)
  }, [])

  return {
    playerName,
    level,
    score,
    lives,
    wordIndex,
    words,
    isGameOver,
    currentWord,
    totalWords: words.length,
    nextWord,
    addScore,
    loseLife,
    resetGame,
    setPlayerName,
    setLevel: handleSetLevel,
  }
}
