const keyStrokeSounds = [
    new Audio ("/sounds/keystroke1.mp3"),
    new Audio ("/sounds/keystroke2.mp3"),
    new Audio ("/sounds/keystroke3.mp3"),
    new Audio ("/sounds/keystroke4.mp3"),
]

function useKeyboardSound() {
    const playRandomSound = () => {
        const randomSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];
        randomSound.currentTime = 0;  //  sets the audio to start from the beginning, preventing issues like partial plays or delays for a smoother experience.
        randomSound.play();  // triggers playback of the selected audio.
    }
    return {playRandomSound}
}

export default useKeyboardSound;