/**
 * Property-Based Tests for Projects Section
 * Feature: portfolio-sync-update
 * 
 * Tests validate that all Live buttons have correct text and accessibility
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load the HTML file
let document;
let projectCards;
let liveButtons;

beforeAll(() => {
  const html = readFileSync(join(process.cwd(), 'index.html'), 'utf-8');
  const dom = new JSDOM(html);
  document = dom.window.document;
  projectCards = document.querySelectorAll('.project-card');
  // Get all primary buttons in project cards (Live buttons)
  liveButtons = document.querySelectorAll('.project-card .btn-primary');
});

describe('Projects Section', () => {
  /**
   * Property 2: All Live Buttons Have Correct Text and Accessibility
   * *For any* project card with a Live button, the button text SHALL be "Live" 
   * (not "Live Demo") AND the aria-label SHALL contain "live" instead of "Live Demo".
   * 
   * **Validates: Requirements 6.1, 6.2**
   */
  it('Property 2: All Live Buttons Have Correct Text and Accessibility', () => {
    const liveButtonsArray = Array.from(liveButtons);
    
    expect(liveButtonsArray.length).toBeGreaterThan(0);
    
    // Property test: for any Live button index, the button should have correct text and aria-label
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: liveButtonsArray.length - 1 }),
        (index) => {
          const button = liveButtonsArray[index];
          
          // Button text must be "Live" (not "Live Demo")
          const buttonText = button.textContent?.trim();
          expect(buttonText).toBe('Live');
          expect(buttonText).not.toBe('Live Demo');
          
          // aria-label must contain "live" and not "Live Demo"
          const ariaLabel = button.getAttribute('aria-label');
          expect(ariaLabel).toBeTruthy();
          expect(ariaLabel?.toLowerCase()).toContain('live');
          expect(ariaLabel).not.toContain('Live Demo');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional verification: Removed projects should not exist
   */
  it('Removed projects should not be displayed', () => {
    const projectCardsArray = Array.from(projectCards);
    const projectTitles = projectCardsArray.map(card => 
      card.querySelector('h3')?.textContent?.trim()
    );
    
    // These projects should NOT exist
    expect(projectTitles).not.toContain('Professional Portfolio Website');
    expect(projectTitles).not.toContain('WhatsApp Broadcast Tool');
    expect(projectTitles).not.toContain('Express Delivery Service');
  });

  /**
   * Additional verification: Ekalliptus Digital Agency should exist
   */
  it('Ekalliptus Digital Agency project should exist with correct details', () => {
    const projectCardsArray = Array.from(projectCards);
    const ekalliptusCard = projectCardsArray.find(card => 
      card.querySelector('h3')?.textContent?.trim() === 'Ekalliptus Digital Agency'
    );
    
    expect(ekalliptusCard).toBeTruthy();
    
    // Check icon
    const icon = ekalliptusCard?.querySelector('.project-icon');
    expect(icon?.textContent?.trim()).toBe('🏢');
    
    // Check link
    const liveLink = ekalliptusCard?.querySelector('.btn-primary');
    expect(liveLink?.getAttribute('href')).toBe('https://ekalliptus.com');
    
    // Check tags
    const tags = ekalliptusCard?.querySelectorAll('.tag');
    const tagTexts = Array.from(tags || []).map(t => t.textContent?.trim());
    expect(tagTexts).toContain('Next.js');
    expect(tagTexts).toContain('TailwindCSS');
    expect(tagTexts).toContain('TypeScript');
  });
});
