/**
 * Property-Based Tests for Skills Section
 * Feature: portfolio-sync-update
 * 
 * Tests validate that all skill items have proper SVG icons
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load the HTML file
let document;
let skillItems;

beforeAll(() => {
  const html = readFileSync(join(process.cwd(), 'index.html'), 'utf-8');
  const dom = new JSDOM(html);
  document = dom.window.document;
  skillItems = document.querySelectorAll('.skill-item');
});

describe('Skills Section', () => {
  /**
   * Property 1: All Skill Items Have SVG Icons
   * *For any* skill item displayed in the Skills Section, there SHALL be 
   * an associated <img> element with a src attribute pointing to an SVG file.
   * 
   * **Validates: Requirements 3.5**
   */
  it('Property 1: All Skill Items Have SVG Icons', () => {
    // Get all skill items from the DOM
    const skillItemsArray = Array.from(skillItems);
    
    expect(skillItemsArray.length).toBeGreaterThan(0);
    
    // Property test: for any skill item index, the skill item should have an SVG icon
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: skillItemsArray.length - 1 }),
        (index) => {
          const skillItem = skillItemsArray[index];
          const img = skillItem.querySelector('img');
          
          // Must have an img element
          expect(img).not.toBeNull();
          
          // Must have a src attribute
          const src = img?.getAttribute('src');
          expect(src).toBeTruthy();
          
          // src must point to an SVG file
          expect(src).toMatch(/\.svg$/);
          
          // src must be in the skills folder
          expect(src).toContain('/img/skills/');
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Additional verification: All SVG files referenced actually exist
   */
  it('All referenced SVG files exist on disk', () => {
    const skillItemsArray = Array.from(skillItems);
    
    skillItemsArray.forEach((skillItem) => {
      const img = skillItem.querySelector('img');
      const src = img?.getAttribute('src');
      
      if (src) {
        // Convert URL path to file system path
        const filePath = join(process.cwd(), src.replace(/^\//, ''));
        expect(existsSync(filePath), `SVG file should exist: ${filePath}`).toBe(true);
      }
    });
  });
});
