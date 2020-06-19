import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import styled from 'styled-components'

const width = 1200
const height = 630
const paddingWidth = 200
const fontSize = 50
const lineHeight = fontSize * 1.25

const splitByDelimiter = (text: string, position: number) => {
  const regexp = new RegExp(`([^，．、。\\s]+[，．、。\s]){${position}}`)

  return text
    .replace(regexp, '$&\n')
    .split('\n')
    .filter((text) => text !== '')
}

const autoSplit = (context: CanvasRenderingContext2D, text: string): string | string[] => {
  const measurement = context.measureText(text)
  const possiblyOverflow = checkOverflow(measurement)

  if (possiblyOverflow) {
    const splittedText = text.split('')
    let array: string[] = []

    for (const text of splittedText) {
      const joinedText = `${array.join('')}${text}`
      const currentMeasurement = context.measureText(joinedText)
      const overflow = checkOverflow(currentMeasurement)
      if (overflow === false) {
        array = [...array, text]
      }
    }

    const remainingText = splittedText.filter((_text, index) => index >= array.length)
    
    return [array.join(''), autoSplit(context, remainingText.join(''))].flat()
  }

  return text
}

const autoSplitStringArray = (context: CanvasRenderingContext2D, texts: string[]): string[] => {
  return texts.map((text) => autoSplit(context, text)).flat()
}

const sortByLength = (texts: string | any[]) => {
  return [...texts].sort((a, b) => b.length - a.length)
}

const getMaxLengthText = (texts: string[]) => {
  return sortByLength(texts).find((_text, index) => index === 0)
}

const checkOverflow = (measurement: TextMetrics) => {
  return measurement.width > width - paddingWidth
}

const getTextArray = (context: CanvasRenderingContext2D, text: string, returnPosition: number) => {
  return autoSplitStringArray(context, splitByDelimiter(text, returnPosition))
}

const scoreCandidates = (texts: string[][]) => {
  const sortedByLength = [...sortByLength(texts)].reverse() as string[][]
  const minLength = Math.min(...(sortedByLength.map((element) => element.length)))
  const filteredByMinLength = sortedByLength.filter((element) => element.length <= minLength)

  if (filteredByMinLength.length > 1) {
    return [...filteredByMinLength]
      .sort((a, b) => a[0].length - b[0].length)
      .find((_element, index) => index === 0)
      ?? filteredByMinLength[0]
  }

  return filteredByMinLength.find((_element, index) => index === 0) ?? filteredByMinLength[0]
}

export const AutoLayoutText = () => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [text, setText] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setContext(canvasRef.current.getContext('2d'))
    canvasRef.current.width = width
    canvasRef.current.height = height
  }, [])

  useEffect(() => {
    if (context) {
      context.clearRect(0, 0, width, height)
      context.beginPath()
      context.font = `bold ${fontSize}px sans-serif`

      const singleLineMeasurement = context.measureText(text)
      const possiblyOverflow = checkOverflow(singleLineMeasurement)


      if (possiblyOverflow) {
        const candidates = [...Array(3)].map((_element, index) => {
          return getTextArray(context, text, index + 1)
        })


        const texts = scoreCandidates(candidates)
        const maxLengthText = getMaxLengthText(texts)

        if (maxLengthText === undefined) {
          return
        }

        const maxLengthMeasurement = context.measureText(maxLengthText)
        const x = (width - maxLengthMeasurement.width) / 2
        const y = height / 2

        texts.forEach((text, index) => {
          const lineLength = texts.length
          const distance = index - lineLength / 2
          const offsetY = y + lineHeight * distance
          context.fillText(text, x, offsetY, width)
        })

        return
      }


      const x = (width - singleLineMeasurement.width) / 2
      const y = height / 2
      context.fillText(text, x, y, width)
    }
  }, [context, text])

  const onInputText = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value
    setText(value || '')
  }

  return (
    <Container>
      <InputContainer>
        <Text>テキストを入力:　</Text>
        <Input onInput={onInputText} autoFocus={true} />
      </InputContainer>
      <Canvas ref={canvasRef} />
    </Container>
  )
}

const Container = styled.div`
`

const Canvas = styled.canvas`
  width: 1200px;
  height: 630px;
  border: 1px solid #ccc;
`

const InputContainer = styled.div`
  display: flex;
`

const Text = styled.div``

const Input = styled.input`
  display: block;
  margin-bottom: 16px;
`
