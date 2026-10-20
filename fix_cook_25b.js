const fs = require('fs');
let client = fs.readFileSync('src/app/cook/_components/Client.tsx', 'utf8');

// Accessibility aria-labels
client = client.replace(
  '<button onClick={toggleCamera}',
  '<button aria-label={isCameraActive ? "Deactivate Camera" : "Activate Camera"} onClick={toggleCamera}'
);
client = client.replace(
  '<button onClick={prevStep}',
  '<button aria-label="Previous Step" onClick={prevStep}'
);
client = client.replace(
  '<button onClick={nextStep}',
  '<button aria-label={isLastStep ? "Finish Cooking" : "Next Step"} onClick={nextStep}'
);

// Progress tracker insertion
const tracker = `
        {/* Progress Tracker (Phase 8) */}
        <div style={{ display: 'flex', gap: 4, padding: '16px 20px 0', background: 'white' }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 10, background: completedSteps.includes(i) ? '#10B981' : i === currentStep ? '#F97316' : '#E5E7EB', transition: 'all 0.3s' }} />
          ))}
        </div>
`;
client = client.replace(
  /{isVoiceActive && \(/g,
  tracker + "\n        {isVoiceActive && ("
);

// Inline step image from pollinations (Phase 8)
const stepImage = `
                      <div style={{ width: '100%', height: 200, position: 'relative', borderRadius: 16, overflow: 'hidden', marginBottom: 16, background: '#F3F4F6' }}>
                        <Image src={'https://image.pollinations.ai/prompt/' + encodeURIComponent('cooking step realistic top down ' + (currentRecipe?.name || '') + ' ' + (step?.description || '')) + '?width=600&height=400&nologo=true&seed=' + currentStep} alt="Step Visualization" fill style={{ objectFit: 'cover' }} />
                      </div>
`;
client = client.replace(
  /<p style=\{\{ fontSize: 15, color: '#3D2B1F', lineHeight: 1\.7, fontWeight: 600 \}\}>\{step\?\.description\}<\/p>/g,
  stepImage + "\n                      <p style={{ fontSize: 15, color: '#3D2B1F', lineHeight: 1.7, fontWeight: 600 }}>{step?.description}</p>"
);

// Need to import Image if not there
if (!client.includes("import Image from 'next/image';")) {
  client = "import Image from 'next/image';\n" + client;
}

fs.writeFileSync('src/app/cook/_components/Client.tsx', client);
console.log('Fixed cook client Phase 8');
