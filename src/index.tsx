import { h, render } from 'preact'

const Main = () => {
  return (
    <div>auto text layout</div>
  )
}

const root = document.getElementById('root')

if (root) {
  render(<Main />, root)
}
