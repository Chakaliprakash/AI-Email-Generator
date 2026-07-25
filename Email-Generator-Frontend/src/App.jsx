import React from 'react';
import './App.css'; // Ensure this matches your CSS file name

const App = () => {
  return (
    <div className="app-wrapper">
      
      {/* MAIN WORKSPACE - Locked to exactly one screen (100vh) */}
      <section className="workspace-section">
        
        {/* HEADER: Personal Branding */}
        <header className="app-header">
          <div className="brand-logo">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">AI Reply Engine</span>
          </div>
          <div className="user-profile">
            <span className="user-greeting">Prakash | AI Workspace</span>
            <div className="user-avatar">P</div>
          </div>
        </header>

        {/* TWO-COLUMN LAYOUT: No Scrolling Required */}
        <main className="split-layout">
          
          {/* LEFT COLUMN: Input & Controls */}
          <div className="glass-panel left-panel">
            <h2 className="panel-title">ORIGINAL MESSAGE // INPUT</h2>
            <textarea 
              className="glass-textarea" 
              placeholder="Paste the email you received here..."
            ></textarea>
            
            <div className="controls-wrapper">
              <h3 className="panel-title">REPLY TONE // SELECT MODE</h3>
              <div className="tone-buttons">
                <button className="tone-btn">Auto</button>
                <button className="tone-btn">Professional</button>
                <button className="tone-btn">Friendly</button>
                <button className="tone-btn">Casual</button>
                <button className="tone-btn active">Formal</button>
              </div>
              <button className="generate-btn">Generate reply</button>
            </div>
          </div>

          {/* RIGHT COLUMN: Output */}
          <div className="glass-panel right-panel">
            <div className="panel-header">
              <h2 className="panel-title">GENERATED REPLY // OUTPUT</h2>
              <button className="copy-btn">COPY</button>
            </div>
            <textarea 
              className="glass-textarea output-textarea" 
              readOnly 
              defaultValue="Dear [Name],&#10;&#10;Wishing you continued success, great achievements, and fulfillment in all your future endeavors.&#10;&#10;Warm regards,&#10;&#10;Prakash Chakali"
            ></textarea>
          </div>
        </main>

        {/* SCROLL INDICATOR */}
        <div className="scroll-indicator">
          <span>Scroll down for About</span>
          <div className="arrow-down">↓</div>
        </div>
      </section>

      {/* ABOUT SECTION - Revealed only when scrolled */}
      <section className="about-section">
        <div className="glass-panel about-content">
          <h2 className="about-header">About the Engine</h2>
          <p>
            This AI Reply Engine was engineered to draft intelligent, context-aware responses at full throttle. By eliminating UI clutter and optimizing the layout, it provides a seamless workflow for professional communication.
          </p>
          <div className="about-details">
            <p><strong>Developer:</strong> Prakash Chakali</p>
            <p><strong>Framework:</strong> React + AI Integration</p>
            <p><strong>Design:</strong> Glassmorphism / Split-Screen Dashboard</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default App;