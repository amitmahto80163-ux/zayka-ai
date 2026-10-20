const fs = require('fs');
let rc = fs.readFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', 'utf8');

// We need a direction state or we can just derive it. But since we need previous tab, we can use a ref or state.
// Simplest way is to just do a slide from right if not specified. The prompt says "directional tab transitions (swipe left/right)".
// Let's add a quick state to track direction.
if (!rc.includes('tabDirection')) {
  rc = rc.replace(
    "const [servings, setServings] = useState(2);",
    "const [servings, setServings] = useState(2);\n    const [tabDirection, setTabDirection] = useState(1);\n    const tabOrder = ['ingredients', 'steps', 'cost', 'chef'];\n    const handleTabChange = (tId: string) => {\n      const currentIndex = tabOrder.indexOf(activeTab);\n      const nextIndex = tabOrder.indexOf(tId);\n      setTabDirection(nextIndex > currentIndex ? 1 : -1);\n      setActiveTab(tId);\n    };"
  );
  
  // Replace the setActiveTab calls
  rc = rc.replace(/onClick=\{\(\) => setActiveTab\(/g, "onClick={() => handleTabChange(");
  
  // Update the motion.div variants
  const variants = `
    const variants = {
      enter: (direction: number) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (direction: number) => ({ x: direction < 0 ? 30 : -30, opacity: 0 })
    };
  `;
  rc = rc.replace('return (', variants + '\n  return (');
  
  // Apply variants
  rc = rc.replace(
    '<motion.div key={activeTab + recipeVersion} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>',
    '<motion.div custom={tabDirection} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, type: "spring", bounce: 0 }} key={activeTab + recipeVersion}>'
  );
  
  fs.writeFileSync('src/app/recipe/[id]/_components/RecipeClient.tsx', rc);
  console.log('Added directional tab transitions');
}
