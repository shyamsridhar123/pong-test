/**
 * Audio Manager for Pong Game
 * Uses Web Audio API for low-latency sound generation
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.isMuted = false;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            // Create AudioContext (will be suspended until user interaction)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    /**
     * Resume audio context (needed for browsers that require user interaction)
     */
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    /**
     * Generate a simple beep sound using oscillator
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {string} type - Oscillator type ('sine', 'square', 'sawtooth', 'triangle')
     * @param {number} volume - Volume (0 to 1)
     */
    playBeep(frequency, duration, type = 'sine', volume = 0.3) {
        if (this.isMuted || !this.audioContext) return;

        this.resumeAudioContext();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        // Envelope for smooth sound
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    /**
     * Play paddle hit sound - short, high-pitched beep
     */
    playPaddleHit() {
        this.playBeep(440, 0.1, 'square', 0.2);
    }

    /**
     * Play wall bounce sound - medium pitch beep
     */
    playWallBounce() {
        this.playBeep(220, 0.1, 'sine', 0.15);
    }

    /**
     * Play scoring sound - ascending tone
     */
    playScore() {
        if (this.isMuted || !this.audioContext) return;

        this.resumeAudioContext();

        const now = this.audioContext.currentTime;
        
        // Play a sequence of three ascending notes
        const notes = [
            { freq: 262, time: 0 },      // C
            { freq: 330, time: 0.1 },    // E
            { freq: 392, time: 0.2 }     // G
        ];

        notes.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = note.freq;
            oscillator.type = 'sine';

            const startTime = now + note.time;
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.15);
        });
    }

    /**
     * Play game over sound - descending tone (sad)
     */
    playGameOver() {
        if (this.isMuted || !this.audioContext) return;

        this.resumeAudioContext();

        const now = this.audioContext.currentTime;
        
        // Play a sequence of descending notes (sad sound)
        const notes = [
            { freq: 392, time: 0 },      // G
            { freq: 330, time: 0.15 },   // E
            { freq: 262, time: 0.3 }     // C
        ];

        notes.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = note.freq;
            oscillator.type = 'triangle';

            const startTime = now + note.time;
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.2);
        });
    }

    /**
     * Play win sound - triumphant ascending melody
     */
    playWin() {
        if (this.isMuted || !this.audioContext) return;

        this.resumeAudioContext();

        const now = this.audioContext.currentTime;
        
        // Play a triumphant ascending melody
        const notes = [
            { freq: 262, time: 0 },      // C
            { freq: 330, time: 0.1 },    // E
            { freq: 392, time: 0.2 },    // G
            { freq: 523, time: 0.3 }     // High C
        ];

        notes.forEach(note => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = note.freq;
            oscillator.type = 'sine';

            const startTime = now + note.time;
            const duration = note.time === 0.3 ? 0.3 : 0.12; // Last note is longer
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }

    /**
     * Toggle mute state
     * @returns {boolean} New mute state
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    /**
     * Get current mute state
     * @returns {boolean}
     */
    getMuteState() {
        return this.isMuted;
    }

    /**
     * Set mute state
     * @param {boolean} muted
     */
    setMute(muted) {
        this.isMuted = muted;
    }
}

export default AudioManager;
