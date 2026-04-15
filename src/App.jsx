import JoinUs from './components/JoinUs'
import PasswordGate from './components/PasswordGate'

export default function App() {
  return (
    <PasswordGate>
      <JoinUs />
    </PasswordGate>
  )
}
