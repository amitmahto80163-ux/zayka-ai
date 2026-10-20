const fs = require('fs');

let store = fs.readFileSync('src/store/index.ts', 'utf8');
if (!store.includes('lastRecipeTab: "overview",')) {
  store = store.replace(
    /\(set, get\) => \(\{/,
    "(set, get) => ({\n        // Recipe UI\n        lastRecipeTab: 'overview',\n        setLastRecipeTab: (lastRecipeTab) => set({ lastRecipeTab }),\n"
  );
  fs.writeFileSync('src/store/index.ts', store);
}

let cook = fs.readFileSync('src/app/cook/_components/Client.tsx', 'utf8');
if (!cook.includes('const [completedSteps, setCompletedSteps]')) {
  cook = cook.replace(
    'const [currentStep, setCurrentStep] = useState(0);',
    'const [currentStep, setCurrentStep] = useState(0);\n  const [completedSteps, setCompletedSteps] = useState<number[]>([]);'
  );
  fs.writeFileSync('src/app/cook/_components/Client.tsx', cook);
}

console.log('Fixed TS issues');
