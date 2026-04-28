/**
 * Tests for Projects Data
 * Validates PROJECTS data structure and required fields
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { PROJECTS } from '../src/data/projects.js';

describe('Projects Data', () => {
  it('PROJECTS has at least one entry', () => {
    expect(PROJECTS.length).toBeGreaterThan(0);
  });

  it('every project has required fields: icon, name, description, tags, liveUrl', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: PROJECTS.length - 1 }),
        (index) => {
          const p = PROJECTS[index];
          expect(typeof p.icon).toBe('string');
          expect(typeof p.name).toBe('string');
          expect(p.name.length).toBeGreaterThan(0);
          expect(typeof p.description).toBe('string');
          expect(Array.isArray(p.tags)).toBe(true);
          expect(p.tags.length).toBeGreaterThan(0);
          expect(typeof p.liveUrl).toBe('string');
          expect(p.liveUrl).toMatch(/^https?:\/\//);
        }
      ),
      { numRuns: PROJECTS.length }
    );
  });
});
