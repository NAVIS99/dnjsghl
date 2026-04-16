import SignUp from './components/SignUp'
import PasswordGate from './components/PasswordGate'

export default function App() {
  return (
    <PasswordGate>
      <SignUp />
    </PasswordGate>
  )
}
