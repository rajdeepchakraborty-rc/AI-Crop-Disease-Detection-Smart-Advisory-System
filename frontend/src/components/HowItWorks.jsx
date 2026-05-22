import '../timeline.css'

export default function HowItWorks() {
  const steps = [
    {
      title: "1. User Uploads Image (Interaction)",
      desc: "Idle State: The upload area uses a subtle 'breathing' gradient to show it is active. As the user drags a file near the upload box, the entire component gently pulsates and expands slightly, becoming 'magnetized' to the cursor. On release, the box 'inhales' the file with a quick scale-down-and-up 'bloop' effect, reassuring the user the file was caught.",
      purpose: "Communicates active state and successful registration of input."
    },
    {
      title: "2. Image -> CNN Model (Diagnostic)",
      desc: "The uploaded image transforms into a grid of tiny glowing nodes, which then 'flow' down a line like data packets into a spinning or humming stylized 'brain' or 'neural network' icon (the CNN). As the image data enters the network, nodes light up sequentially, representing the model analyzing different layers.",
      purpose: "Visually explains the processing phase and reduces perceived wait time."
    },
    {
      title: "3. Disease + Confidence (Feedback)",
      desc: "As the CNN finishes, a percentage counter for CONFIDENCE LEVEL rapidly increments (spins up like a slot machine) from 0% to the actual value, stopping with a satisfying click. Simultaneously, the DISEASE NAME text fades in with a slight 'shimmer' effect, color-coded. A small Severity Meter 'grows' like a plant stem.",
      purpose: "Confirms the success of the analysis and highlights critical data."
    },
    {
      title: "4. Weather API Integration (Context)",
      desc: "The location icon glows, and a small, stylized map tile slides up, with climate data icons (temperature, humidity) fading in one by one. A sun icon slowly rotates, or a cloud icon has drifting, transparent layers.",
      purpose: "Seamlessly integrates external data without interrupting the flow."
    },
    {
      title: "5. LLM Generates Advice (Action)",
      desc: "The AI robot head icon has 'thinking' dots above it. The advice doesn't appear instantly—a 'typewriter' effect generates the summary text line by line. Key action words (e.g., 'Prune,' 'Fertilize') use a slight pulse animation to draw attention.",
      purpose: "Guides attention and makes complex text more digestible."
    },
    {
      title: "6. Output -> UI + Voice + Report (Delight)",
      desc: "The advice panel expands. Voice: A speaker icon pulses with expanding sound wave animations while the audio advice is playing. Report: When the 'Download Report' button is clicked, it transforms into a progress circle and then a green checkmark.",
      purpose: "Enhances visual hierarchy, reinforces branding, and provides a delightful finale to the workflow."
    }
  ]

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', position: 'relative', zIndex: 10 }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }} className="fade-in-up">
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>How It Works</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Understanding the flow and the 6-step AI pipeline behind the Crop Disease Detection System.
        </p>
      </div>

      <div className="timeline-container">
        {steps.map((step, idx) => (
          <div className="timeline-item" key={idx}>
            <div className="timeline-dot"></div>
            <div className="timeline-content card fade-in-up" style={{ animationDelay: `${idx * 0.15}s` }}>
              <h3 style={{ color: 'var(--green-400)', marginBottom: '12px', fontSize: '1.3rem' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.7 }}>{step.desc}</p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
