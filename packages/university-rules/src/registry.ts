import type { ClassificationEntry, GradeScaleEntry, UniversityGradingRule } from '@chuo-gpa/types';

import { udsmRule } from './rules/udsm.js';
import { udomRule } from './rules/udom.js';
import { iaaRule } from './rules/iaa.js';

/**
 * Default university ID used when none is specified.
 * Uses the TCU standard (same as UDSM).
 */
export const DEFAULT_UNIVERSITY_ID = 'tcu-standard';

const registry = new Map<string, UniversityGradingRule>();

function cloneGradeScale(scale: GradeScaleEntry[]): GradeScaleEntry[] {
  return scale.map((entry) => ({ ...entry }));
}

function cloneClassificationScale(scale: ClassificationEntry[]): ClassificationEntry[] {
  return scale.map((entry) => ({ ...entry }));
}

function cloneRule(rule: UniversityGradingRule): UniversityGradingRule {
  return {
    universityId: rule.universityId,
    universityName: rule.universityName,
    maxGPA: rule.maxGPA,
    gradeScale: cloneGradeScale(rule.gradeScale),
    classificationScale: cloneClassificationScale(rule.classificationScale),
  };
}

function freezeRule(rule: UniversityGradingRule): UniversityGradingRule {
  for (const entry of rule.gradeScale) {
    Object.freeze(entry);
  }
  Object.freeze(rule.gradeScale);
  for (const entry of rule.classificationScale) {
    Object.freeze(entry);
  }
  Object.freeze(rule.classificationScale);
  return Object.freeze(rule);
}

function assertValidRule(rule: UniversityGradingRule): void {
  if (!rule || typeof rule !== 'object') {
    throw new Error('University rule must be an object');
  }
  if (typeof rule.universityId !== 'string' || rule.universityId.trim().length === 0) {
    throw new Error('universityId must be a non-empty string');
  }
  if (typeof rule.universityName !== 'string' || rule.universityName.trim().length === 0) {
    throw new Error('universityName must be a non-empty string');
  }
  if (typeof rule.maxGPA !== 'number' || !Number.isFinite(rule.maxGPA) || rule.maxGPA <= 0) {
    throw new Error('maxGPA must be a finite number greater than 0');
  }
  if (!Array.isArray(rule.gradeScale) || rule.gradeScale.length === 0) {
    throw new Error('gradeScale must be a non-empty array');
  }
  if (!Array.isArray(rule.classificationScale) || rule.classificationScale.length === 0) {
    throw new Error('classificationScale must be a non-empty array');
  }

  for (const entry of rule.gradeScale) {
    if (typeof entry.grade !== 'string' || entry.grade.trim().length === 0) {
      throw new Error('Each gradeScale entry needs a non-empty grade');
    }
    if (typeof entry.gradePoint !== 'number' || !Number.isFinite(entry.gradePoint)) {
      throw new Error(`gradePoint for "${entry.grade}" must be a finite number`);
    }
  }

  for (const entry of rule.classificationScale) {
    if (typeof entry.minGPA !== 'number' || !Number.isFinite(entry.minGPA)) {
      throw new Error('classification minGPA must be a finite number');
    }
    if (typeof entry.maxGPA !== 'number' || !Number.isFinite(entry.maxGPA)) {
      throw new Error('classification maxGPA must be a finite number');
    }
    if (entry.minGPA > entry.maxGPA) {
      throw new Error('classification minGPA cannot be greater than maxGPA');
    }
  }
}

const tcuStandardRule = freezeRule({
  universityId: DEFAULT_UNIVERSITY_ID,
  universityName: 'Tanzania Commission for Universities (TCU Standard)',
  maxGPA: 5.0,
  gradeScale: cloneGradeScale(udsmRule.gradeScale),
  classificationScale: cloneClassificationScale(udsmRule.classificationScale),
});

function initializeRegistry(): void {
  registry.set(tcuStandardRule.universityId, tcuStandardRule);
  registry.set(udsmRule.universityId, freezeRule(cloneRule(udsmRule)));
  registry.set(udomRule.universityId, freezeRule(cloneRule(udomRule)));
  registry.set(iaaRule.universityId, freezeRule(cloneRule(iaaRule)));
}

initializeRegistry();

function normalizeUniversityId(universityId: string): string {
  if (typeof universityId !== 'string') {
    throw new Error('University id must be a string');
  }
  const normalizedId = universityId.trim().toLowerCase();
  if (normalizedId.length === 0) {
    throw new Error('University id must be a non-empty string');
  }
  if (normalizedId.length > 64) {
    throw new Error('University id is too long');
  }
  return normalizedId;
}

/**
 * Get the grading rule for a specific university.
 * Returns a deep clone so callers cannot mutate the shared registry.
 */
export function getUniversityRule(universityId: string): UniversityGradingRule {
  const normalizedId = normalizeUniversityId(universityId);
  const rule = registry.get(normalizedId);

  if (!rule) {
    throw new Error(`University "${universityId}" not found`);
  }

  return cloneRule(rule);
}

/**
 * Get the default grading rule (TCU Standard).
 * Returns a deep clone so callers cannot mutate the shared registry.
 */
export function getDefaultRule(): UniversityGradingRule {
  return cloneRule(tcuStandardRule);
}

/**
 * List all registered universities (deep-cloned).
 */
export function listUniversities(): UniversityGradingRule[] {
  return Array.from(registry.values()).map(cloneRule);
}

/**
 * Check if a university is registered.
 */
export function hasUniversity(universityId: string): boolean {
  try {
    return registry.has(normalizeUniversityId(universityId));
  } catch {
    return false;
  }
}

/**
 * Register a new university grading rule at runtime.
 * The stored rule is cloned and frozen so later mutations cannot poison GPA.
 */
export function registerUniversity(rule: UniversityGradingRule): void {
  assertValidRule(rule);
  const normalizedId = normalizeUniversityId(rule.universityId);

  if (registry.has(normalizedId)) {
    throw new Error(
      `University "${rule.universityId}" is already registered. Use a different universityId.`,
    );
  }

  registry.set(
    normalizedId,
    freezeRule(
      cloneRule({
        ...rule,
        universityId: normalizedId,
        universityName: rule.universityName.trim(),
      }),
    ),
  );
}
