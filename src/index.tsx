import { h, render } from 'preact'
import { AutoLayoutText } from './AutoLayoutText'

const Main = () => {
  return (
    <AutoLayoutText />
  )
}

const root = document.getElementById('root')

if (root) {
  render(<Main />, root)
}
