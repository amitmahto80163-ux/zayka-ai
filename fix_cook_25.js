const fs = require('fs');
let client = fs.readFileSync('src/app/cook/_components/Client.tsx', 'utf8');

// 1. Add completedSteps state
client = client.replace(
  'const [currentStep, setCurrentStep] = useState(0);',
  'const [currentStep, setCurrentStep] = useState(0);\n  const [completedSteps, setCompletedSteps] = useState<number[]>([]);'
);

// 2. Modify nextStep to track completion
const nextStepReplacement = `
  const nextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    if (isLastStep) {
      setShowDoneModal(true);
    } else {
      setCurrentStep(s => s + 1);
    }
  };
`;
client = client.replace(
  /const nextStep = \(\) => \{\s*if \(isLastStep\) \{\s*setShowDoneModal\(true\);\s*\} else \{\s*setCurrentStep\(s => s \+ 1\);\s*\}\s*\};/s,
  nextStepReplacement
);

// 3. Render Progress Dots (if exists) or just make it explicit in the steps header
// Where we see `<div style={{ flex: 1, display: 'flex', flexDirection: 'column'` we can prepend progress dots
const progressDots = `
              {/* Progress Tracker */}
              <div style={{ display: 'flex', gap: 4, padding: '0 24px', marginTop: 12, justifyContent: 'center' }}>
                {steps.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 6, borderRadius: 10, background: completedSteps.includes(i) ? '#10B981' : i === currentStep ? '#F97316' : '#E5E7EB', transition: 'all 0.3s' }} />
                ))}
              </div>
`;
client = client.replace(
  /<div style=\{\{ display: 'flex', justifyContent: 'center', marginBottom: 16, marginTop: 12 \}\}>/g,
  progressDots + "\n          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, marginTop: 12 }}>"
);
// Wait, my regex might fail. I'll inject just below `const isLastStep = ...` or in the JSX.
