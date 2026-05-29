// Copyright (c) 2012-2022 John Nesky and contributing authors, distributed under the MIT license.

/**
 * Utility functions for microtonal music calculations
 */
export class MicrotonalUtils {
	/**
	 * Convert a note value to its frequency in Hz given an EDO system
	 * @param noteNumber - MIDI note number (0-127)
	 * @param edo - Equal divisions of the octave
	 * @param referenceFreq - Reference frequency (default A4 = 440 Hz)
	 * @param referenceNote - MIDI note number for reference frequency (default 69 = A4)
	 * @param detuneCents - Detune offset in cents
	 * @returns Frequency in Hz
	 */
	public static noteToFrequency(
		noteNumber: number,
		edo: number,
		detuneCents: number = 0,
		referenceFreq: number = 440,
		referenceNote: number = 69
	): number {
		const centsPerStep = 1200 / edo; // Cents per EDO step
		const stepDifference = noteNumber - referenceNote;
		const totalCents = (stepDifference * centsPerStep) + detuneCents;
		const frequencyRatio = Math.pow(2, totalCents / 1200);
		return referenceFreq * frequencyRatio;
	}

	/**
	 * Convert frequency in Hz to note value in an EDO system
	 * @param frequency - Frequency in Hz
	 * @param edo - Equal divisions of the octave
	 * @param referenceFreq - Reference frequency (default A4 = 440 Hz)
	 * @param referenceNote - MIDI note number for reference frequency (default 69 = A4)
	 * @returns Approximate MIDI note number
	 */
	public static frequencyToNote(
		frequency: number,
		edo: number,
		referenceFreq: number = 440,
		referenceNote: number = 69
	): number {
		const centsPerStep = 1200 / edo;
		const totalCents = 1200 * Math.log2(frequency / referenceFreq);
		const stepDifference = totalCents / centsPerStep;
		return referenceNote + stepDifference;
	}

	/**
	 * Calculate cents difference between two frequencies
	 * @param freq1 - First frequency in Hz
	 * @param freq2 - Second frequency in Hz
	 * @returns Difference in cents
	 */
	public static frequencyToCents(freq1: number, freq2: number): number {
		return 1200 * Math.log2(freq2 / freq1);
	}

	/**
	 * Get EDO step sizes for common tuning systems
	 * @param edo - Equal divisions of the octave
	 * @returns Array of step sizes in cents
	 */
	public static getEDOStepSizes(edo: number): number[] {
		const steps: number[] = [];
		const centPerStep = 1200 / edo;
		for (let i = 0; i < edo; i++) {
			steps.push(i * centPerStep);
		}
		return steps;
	}

	/**
	 * Find the closest note in an EDO system to a given frequency
	 * @param frequency - Frequency in Hz
	 * @param edo - Equal divisions of the octave
	 * @param referenceFreq - Reference frequency
	 * @param referenceNote - MIDI note number for reference
	 * @returns Closest MIDI note number
	 */
	public static quantizeToEDO(
		frequency: number,
		edo: number,
		referenceFreq: number = 440,
		referenceNote: number = 69
	): number {
		const exactNote = this.frequencyToNote(frequency, edo, referenceFreq, referenceNote);
		return Math.round(exactNote);
	}

	/**
	 * Generate a scale in an EDO system
	 * @param edo - Equal divisions of the octave
	 * @param intervals - Array of scale degrees (0 = root, 1 = second, etc.)
	 * @param octaves - Number of octaves to generate
	 * @returns Array of MIDI note numbers for the scale
	 */
	public static generateScale(edo: number, intervals: number[], octaves: number = 1): number[] {
		const scale: number[] = [];
		const root = 60; // Middle C
		for (let oct = 0; oct < octaves; oct++) {
			for (const interval of intervals) {
				const note = root + (interval * (1200 / edo) / 100) + (oct * 12);
				scale.push(Math.round(note));
			}
		}
		return scale;
	}

	/**
	 * Common preset EDO systems
	 */
	public static readonly PRESET_EDOS = {
		EQUAL_12: 12,
		QUARTER_TONE: 24,
		SIXTH_TONE: 36,
		TWELFTH_TONE: 72,
		BOHLEN_PIERCE: 13,
		PYTHAGOREAN: 53,
		NEUTRAL_THIRDS: 19,
		WERKMEISTER_III: 55,
	};
}
