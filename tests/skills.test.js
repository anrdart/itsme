/**
 * Tests for Skills Data
 * Validates SKILLS_DATA integrity and icon file existence
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { existsSync } from 'fs';
import { join } from 'path';
import { SKILLS_DATA } from '../src/data/skills.js';

describe('Skills Data', () => {
  it('SKILLS_DATA has at least one entry', () => {
    expect(SKILLS_DATA.length).toBeGreaterThan(0);
  });

  it('every skill has required fields: name, icon, category', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: SKILLS_DATA.length - 1 }),
        (index) => {
          const skill = SKILLS_DATA[index];
          expect(typeof skill.name).toBe('string');
          expect(skill.name.length).toBeGreaterThan(0);
          expect(typeof skill.icon).toBe('string');
          expect(skill.icon).toMatch(/^\/img\/skills\/.+\.svg$/);
          expect(typeof skill.category).toBe('string');
        }
      ),
      { numRuns: SKILLS_DATA.length }
    );
  });

  it('every skill icon file exists in public/img/skills/', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: SKILLS_DATA.length - 1 }),
        (index) => {
          const skill = SKILLS_DATA[index];
          const filePath = join(process.cwd(), 'public', skill.icon);
          expect(existsSync(filePath)).toBe(true);
        }
      ),
      { numRuns: SKILLS_DATA.length }
    );
  });
});
