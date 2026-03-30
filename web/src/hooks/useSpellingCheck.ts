/**
 * Maps phonetic letter names (as a speech recogniser might hear them) to their
 * corresponding alphabet letter.  Covers the most common English pronunciations
 * plus NATO phonetic alphabet.
 */
const PHONETIC_TO_LETTER: Record<string, string> = {
  // Standard letter-name pronunciations
  ay: 'a',
  bee: 'b',
  be: 'b',
  sea: 'c',
  see: 'c',
  dee: 'd',
  ee: 'e',
  ef: 'f',
  eff: 'f',
  gee: 'g',
  ji: 'g',
  aitch: 'h',
  haitch: 'h',
  eye: 'i',
  jay: 'j',
  kay: 'k',
  el: 'l',
  em: 'm',
  en: 'n',
  oh: 'o',
  owe: 'o',
  pee: 'p',
  pe: 'p',
  cue: 'q',
  queue: 'q',
  ar: 'r',
  are: 'r',
  es: 's',
  ess: 's',
  tee: 't',
  te: 't',
  you: 'u',
  yoo: 'u',
  vee: 'v',
  ve: 'v',
  'double you': 'w',
  'double-you': 'w',
  doubleyou: 'w',
  ex: 'x',
  why: 'y',
  wi: 'y',
  zee: 'z',
  zed: 'z',
  // NATO phonetic alphabet
  alpha: 'a',
  bravo: 'b',
  charlie: 'c',
  delta: 'd',
  echo: 'e',
  foxtrot: 'f',
  golf: 'g',
  hotel: 'h',
  india: 'i',
  juliet: 'j',
  kilo: 'k',
  lima: 'l',
  mike: 'm',
  november: 'n',
  oscar: 'o',
  papa: 'p',
  quebec: 'q',
  romeo: 'r',
  sierra: 's',
  tango: 't',
  uniform: 'u',
  victor: 'v',
  whiskey: 'w',
  xray: 'x',
  'x-ray': 'x',
  yankee: 'y',
  zulu: 'z',
}

/**
 * Normalise a raw speech transcript into a plain lowercase string of letters
 * that can be compared against the target word.
 *
 * Handles three input formats:
 *   1. Letter-by-letter:  "C A T"          → "cat"
 *   2. Phonetic names:    "see ay tee"      → "cat"
 *   3. Full word:         "cat"             → "cat"
 */
function normaliseTranscript(transcript: string): string {
  const lower = transcript.toLowerCase().trim()

  // Remove punctuation that speech recognition occasionally inserts
  const cleaned = lower.replace(/[.,!?;:'"]/g, '').trim()

  const tokens = cleaned.split(/\s+/)

  // 1. Letter-by-letter: every token is a single alphabet character
  if (tokens.every((t) => t.length === 1 && /^[a-z]$/.test(t))) {
    return tokens.join('')
  }

  // 2. Phonetic names: try to map every token to a letter
  //    Handle "double you" which spans two tokens
  const letters: string[] = []
  let i = 0
  while (i < tokens.length) {
    // Check for two-token phonetic ("double you")
    if (i + 1 < tokens.length) {
      const twoToken = `${tokens[i]} ${tokens[i + 1]}`
      if (PHONETIC_TO_LETTER[twoToken]) {
        letters.push(PHONETIC_TO_LETTER[twoToken])
        i += 2
        continue
      }
    }

    const mapped = PHONETIC_TO_LETTER[tokens[i]]
    if (mapped) {
      letters.push(mapped)
    } else {
      // At least one token isn't a phonetic name → fall through to full-word
      letters.length = 0
      break
    }
    i++
  }

  if (letters.length > 0) {
    return letters.join('')
  }

  // 3. Full word: return cleaned string (no spaces)
  return cleaned.replace(/\s+/g, '')
}

/**
 * Check whether a voice transcript matches the target word.
 *
 * @param transcript - Raw string from SpeechRecognition
 * @param targetWord - The word the player is supposed to spell
 * @returns true if the normalised transcript matches the target word
 */
export function useSpellingCheck() {
  function checkSpelling(transcript: string, targetWord: string): boolean {
    const normalised = normaliseTranscript(transcript)
    const target = targetWord.toLowerCase().trim()
    return normalised === target
  }

  return { checkSpelling, normaliseTranscript }
}
