import './ProgressIndicator.css'

export default function ProgressIndicator({ currentStep, onStepClick, labels }) {
  return (
    <div className="progress">
      <div className="progress__track">
        <div
          className="progress__fill"
          style={{ width: `${((currentStep - 1) / (labels.length - 1)) * 100}%` }}
        />
      </div>
      <div className="progress__steps">
        {labels.map((label, i) => {
          const stepNum = i + 1
          const isDone = stepNum < currentStep
          const isActive = stepNum === currentStep
          return (
            <button
              key={i}
              className="progress__step progress__step--clickable"
              onClick={() => onStepClick(stepNum)}
            >
              <div className={`progress__circle ${isActive ? 'progress__circle--active' : ''} ${isDone ? 'progress__circle--done' : ''}`}>
                {isDone ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8 14L16 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              <p className={`progress__label ${isActive ? 'progress__label--active' : ''} ${isDone ? 'progress__label--done' : ''}`}>
                {label}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
