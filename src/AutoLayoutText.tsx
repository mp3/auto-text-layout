import { h } from 'preact'
import { useState, useEffect, useRef } from 'preact/hooks'
import styled from 'styled-components'

const width = 1200
const height = 630

export const AutoLayoutText = () => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setContext(canvasRef.current.getContext('2d'))
    canvasRef.current.width = width
    canvasRef.current.height = height
  }, [])

  useEffect(() => {
    if (context) {
      context.beginPath()
      context.font = 'bold 16px sans-serif'
      const text = 'auto layout text'
      const textMeasurement = context.measureText(text)
      const x = (width - textMeasurement.width) / 2
      const y = height / 2
      context.fillText(text, x, y, width)
    }
  }, [context])

  return <Canvas ref={canvasRef} />
}

const Canvas = styled.canvas`
  width: 1200px;
  height: 630px;
`
