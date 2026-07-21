import type { UniversityGradingRule } from '@chuo-gpa/types';

import { udsmRule } from './rules/udsm.js';
import { udomRule } from './rules/udom.js';
import { iaaRule } from './rules/iaa.js';

/**
 * Default university ID used when none is specified.
 * Uses the TCU standard (same as UDSM).
 */
export const DEFAULT_UNIVERSITY_ID = 'tcu-standard';

/**
 * Internal registry of all university grading rules.
 */
const registry = new Map<string, UniversityGradingRule>();

/**
 * The TCU Standard grading rule — used as the default.
 * Identical to UDSM's grading scale, since UDSM follows TCU exactly.
 */
const tcuStandardRule: UniversityGradingRule = {
  universityId: DEFAULT_UNIVERSITY_ID,
  universityName: 'Tanzania Commission for Universities (TCU Standard)',
  maxGPA: 5.0,
  gradeScale: udsmRule.gradeScale,
  classificationScale: udsmRule.classificationScale,
};

// Register built-in rules
function initializeRegistry(): void {
  registry.set(tcuStandardRule.universityId, tcuStandardRule);
  registry.set(udsmRule.universityId, udsmRule);
  registry.set(udomRule.universityId, udomRule);
  registry.set(iaaRule.universityId, iaaRule);
}

initializeRegistry();

/**
 * Get the grading rule for a specific university.
 *
 * @param universityId - The university identifier
 * @returns The university's grading rule
 * @throws {Error} If the university is not found in the registry
 *
 * @example
 * ```typescript
 * const rule = getUniversityRule('udsm');
 * console.log(rule.universityName); // "University of Dar es Salaam"
 * ```
 */
export function getUniversityRule(universityId: string): UniversityGradingRule {
  const normalizedId = universityId.toLowerCase().trim();
  const rule = registry.get(normalizedId);

  if (!rule) {
    const available = Array.from(registry.keys()).join(', ');
    throw new Error(`University "${universityId}" not found. Available universities: ${available}`);
  }

  return rule;
}

/**
 * Get the default grading rule (TCU Standard).
 *
 * @returns The default (TCU Standard) grading rule
 */
export function getDefaultRule(): UniversityGradingRule {
  return tcuStandardRule;
}

/**
 * List all registered universities.
 *
 * @returns Array of all registered university grading rules
 */
export function listUniversities(): UniversityGradingRule[] {
  return Array.from(registry.values());
}

/**
 * Check if a university is registered.
 *
 * @param universityId - The university identifier
 * @returns `true` if the university is registered
 */
export function hasUniversity(universityId: string): boolean {
  return registry.has(universityId.toLowerCase().trim());
}

/**
 * Register a new university grading rule at runtime.
 *
 * This allows developers to add custom university rules without modifying the package.
 *
 * @param rule - The university grading rule to register
 * @throws {Error} If a university with the same ID is already registered
 *
 * @example
 * ```typescript
 * registerUniversity({
 *   universityId: 'sua',
 *   universityName: 'Sokoine University of Agriculture',
 *   maxGPA: 5.0,
 *   gradeScale: [...],
 *   classificationScale: [...],
 * });
 * ```
 */
export function registerUniversity(rule: UniversityGradingRule): void {
  const normalizedId = rule.universityId.toLowerCase().trim();

  if (registry.has(normalizedId)) {
    throw new Error(
      `University "${rule.universityId}" is already registered. Use a different universityId.`,
    );
  }

  registry.set(normalizedId, {
    ...rule,
    universityId: normalizedId,
  });
}
