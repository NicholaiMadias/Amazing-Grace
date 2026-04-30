// arcade/scripts/matrix.js
// Matrix of Conscience — animation & visual constants
// Tuned values: slower fade-in, stronger star pulse for dramatic effect.

const fadeInDuration     = 600;   // ms — screen/overlay fade-in duration
const starPulseIntensity = 1.2;  // multiplier — star icon pulse scale on hover

const choiceFeedbackDelay = 300;  // ms — delay before feedback overlay appears
const progressBarEasing   = 'cubic-bezier(0.34,1.56,0.64,1)'; // conscience bar spring
const cardHoverLift       = '-4px'; // translateY applied to game cards on hover
const glowOpacityHover    = 0.85;   // radial-gradient overlay opacity at hover

// Export for module consumers (ES module environments)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fadeInDuration,
        starPulseIntensity,
        choiceFeedbackDelay,
        progressBarEasing,
        cardHoverLift,
        glowOpacityHover,
    };
}
