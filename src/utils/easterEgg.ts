export const GOAT_CODE = ['18', '11', '18', '11']
export const GOAT_TIMEOUT_MS = 5000

// Merkt sich die zuletzt getippten Rückennummern; zu lange Pausen setzen die Eingabe zurück.
export const createCodeMatcher = (code: string[], timeoutMs: number) => {
  let eingabe: string[] = []
  let letzterTipp = 0

  return (nummer: string | number, jetzt = Date.now()): boolean => {
    if (jetzt - letzterTipp > timeoutMs) eingabe = []
    letzterTipp = jetzt

    eingabe = [...eingabe, String(nummer).trim()].slice(-code.length)
    const getroffen = eingabe.length === code.length && eingabe.every((n, i) => n === code[i])
    if (getroffen) eingabe = []
    return getroffen
  }
}

export const tippeGoatCode = createCodeMatcher(GOAT_CODE, GOAT_TIMEOUT_MS)
