import { useState, useEffect } from "react"

// Animation hook, passed duration (milliseconds) that the animation should take
// Returns a tuple of [progress, reset]
// - Progress: number from 0 -> 1 indicating progress through the animation
// - Reset: Function that restarts the animation from the beginning when called

export default function useAnimation(duration) {
	// State: The current progress through the animation from 0 -> 1
	const [progress, setProgress] = useState(0)

	// State: The time the animation was started
	const [startTime, setStartTime] = useState(Date.now())

	// Resets the animation by telling it that it just started now
	const reset = () => setStartTime(Date.now())

	useEffect(() => {
		// Container for next queued frame, lets us clean up after ourselves
		let queuedFrame

		// The main animation loop
		const frame = () => {
			// Milliseconds since animation start
			const now = Date.now() - startTime

			// Queue another frame if the animation has not ended
			if (now < duration) queuedFrame = requestAnimationFrame(frame)

			// Actually update the state
			// We clamp to <= 1 to make sure that progress doesn't leave the 0 -> 1 bounds
			setProgress(Math.min(1, now / duration))
		}

		// Start the animation loop
		frame()

		// Stop the loop if we need to
		return () => cancelAnimationFrame(queuedFrame)
	}, [startTime, duration])

	return [progress, reset]
}
