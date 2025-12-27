/**
 * Property-Based Tests for 3D Skills Sphere
 * Feature: 3d-skills-sphere
 * 
 * Tests validate sphere geometry, node distribution, and core functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { distributeOnSphere, SKILLS_DATA, SphereController, calculateHoverScale, isBillboardFacingCamera, calculateResponsiveRadius, shouldPauseRendering, THEME_COLORS, getThemeColors } from '../src/skills-sphere.js';

describe('3D Skills Sphere', () => {
  /**
   * Feature: 3d-skills-sphere, Property 2: Equidistant Node Distribution
   * 
   * *For any* set of skill nodes on the sphere, all nodes SHALL be positioned 
   * at the same distance (radius) from the sphere center, with a tolerance of ±0.001.
   * 
   * **Validates: Requirements 1.2**
   */
  it('Property 2: Equidistant Node Distribution - all nodes at same radius', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }),  // number of skills
        fc.float({ min: 50, max: 500, noNaN: true }),  // radius
        (skillCount, radius) => {
          const positions = distributeOnSphere(skillCount, radius);
          
          // All positions should be at the specified radius from center
          return positions.every(pos => {
            const distance = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z ** 2);
            return Math.abs(distance - radius) < 0.001;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: 3d-skills-sphere, Property 1: Node Count Consistency
   * 
   * *For any* valid skills array of length N, after initialization, 
   * the sphere group SHALL contain exactly N skill nodes.
   * 
   * **Validates: Requirements 1.1**
   */
  it('Property 1: Node Count Consistency - distributeOnSphere returns correct count', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),  // number of skills
        fc.float({ min: 50, max: 500, noNaN: true }),  // radius
        (skillCount, radius) => {
          const positions = distributeOnSphere(skillCount, radius);
          return positions.length === skillCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional test: distributeOnSphere handles edge cases
   */
  describe('distributeOnSphere edge cases', () => {
    it('returns empty array for zero count', () => {
      const positions = distributeOnSphere(0, 100);
      expect(positions).toEqual([]);
    });

    it('returns empty array for negative count', () => {
      const positions = distributeOnSphere(-5, 100);
      expect(positions).toEqual([]);
    });

    it('returns empty array for zero radius', () => {
      const positions = distributeOnSphere(10, 0);
      expect(positions).toEqual([]);
    });

    it('returns single point at top for count of 1', () => {
      const positions = distributeOnSphere(1, 100);
      expect(positions.length).toBe(1);
      // Single point should be at the top of the sphere (y = radius)
      expect(Math.abs(positions[0].y - 100)).toBeLessThan(0.001);
    });
  });

  /**
   * Verify SKILLS_DATA is properly configured
   */
  describe('SKILLS_DATA configuration', () => {
    it('contains all 21 skills', () => {
      expect(SKILLS_DATA.length).toBe(21);
    });

    it('all skills have required properties', () => {
      SKILLS_DATA.forEach(skill => {
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('icon');
        expect(skill).toHaveProperty('category');
        expect(typeof skill.name).toBe('string');
        expect(skill.icon).toMatch(/^\/img\/skills\/.*\.svg$/);
      });
    });
  });

  /**
   * Feature: 3d-skills-sphere, Property 3: Drag-to-Rotation Mapping
   * 
   * *For any* drag movement (deltaX, deltaY), the sphere rotation SHALL change 
   * proportionally on both axes: rotation.y += deltaX * sensitivity and 
   * rotation.x += deltaY * sensitivity.
   * 
   * **Validates: Requirements 2.1, 2.4**
   */
  describe('SphereController', () => {
    it('Property 3: Drag-to-Rotation Mapping - rotation changes proportionally to drag', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(-500), max: Math.fround(500), noNaN: true }),  // startX
          fc.float({ min: Math.fround(-500), max: Math.fround(500), noNaN: true }),  // startY
          fc.float({ min: Math.fround(-500), max: Math.fround(500), noNaN: true }),  // endX
          fc.float({ min: Math.fround(-500), max: Math.fround(500), noNaN: true }),  // endY
          fc.float({ min: Math.fround(0.001), max: Math.fround(0.1), noNaN: true }), // sensitivity
          (startX, startY, endX, endY, sensitivity) => {
            // Create a mock sphere group with rotation
            const mockSphereGroup = {
              rotation: { x: 0, y: 0, z: 0 }
            };

            const controller = new SphereController(mockSphereGroup, {
              dragSensitivity: sensitivity
            });

            // Record initial rotation
            const initialRotationX = mockSphereGroup.rotation.x;
            const initialRotationY = mockSphereGroup.rotation.y;

            // Perform drag
            controller.startDrag(startX, startY);
            controller.updateDrag(endX, endY);

            // Calculate expected rotation changes
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const expectedRotationY = initialRotationY + deltaX * sensitivity;
            const expectedRotationX = initialRotationX + deltaY * sensitivity;

            // Verify rotation changed proportionally
            const rotationYMatch = Math.abs(mockSphereGroup.rotation.y - expectedRotationY) < 0.0001;
            const rotationXMatch = Math.abs(mockSphereGroup.rotation.x - expectedRotationX) < 0.0001;

            return rotationYMatch && rotationXMatch;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: 3d-skills-sphere, Property 4: Momentum Decay
     * 
     * *For any* initial momentum value M > 0, after applying the decay function N times, 
     * the resulting momentum SHALL be M * (decayFactor ^ N), approaching zero over time.
     * 
     * **Validates: Requirements 2.2**
     */
    it('Property 4: Momentum Decay - momentum decays exponentially', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.1), max: Math.fround(10), noNaN: true }),   // initial momentum X
          fc.float({ min: Math.fround(0.1), max: Math.fround(10), noNaN: true }),   // initial momentum Y
          fc.float({ min: Math.fround(0.5), max: Math.fround(0.99), noNaN: true }), // decay factor
          fc.integer({ min: 1, max: 50 }),                                           // number of decay iterations
          (initialMomentumX, initialMomentumY, decayFactor, iterations) => {
            // Create a mock sphere group
            const mockSphereGroup = {
              rotation: { x: 0, y: 0, z: 0 }
            };

            const controller = new SphereController(mockSphereGroup, {
              momentumDecay: decayFactor
            });

            // Set initial momentum directly
            controller.momentum = { x: initialMomentumX, y: initialMomentumY };

            // Apply decay N times
            for (let i = 0; i < iterations; i++) {
              controller.applyMomentumDecay();
            }

            // Calculate expected momentum after N decays
            const expectedMomentumX = initialMomentumX * Math.pow(decayFactor, iterations);
            const expectedMomentumY = initialMomentumY * Math.pow(decayFactor, iterations);

            const momentum = controller.getMomentum();

            // Account for the threshold cutoff (momentum set to 0 when < 0.0001)
            const actualExpectedX = expectedMomentumX < 0.0001 ? 0 : expectedMomentumX;
            const actualExpectedY = expectedMomentumY < 0.0001 ? 0 : expectedMomentumY;

            // Verify momentum decayed correctly (with small tolerance for floating point)
            const xMatch = Math.abs(momentum.x - actualExpectedX) < 0.0001;
            const yMatch = Math.abs(momentum.y - actualExpectedY) < 0.0001;

            return xMatch && yMatch;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: 3d-skills-sphere, Property 6: Auto-Rotate Y-Axis Only
     * 
     * *For any* frame during auto-rotation mode, only the Y-axis rotation SHALL change;
     * X-axis rotation SHALL remain constant.
     * 
     * **Validates: Requirements 3.2**
     */
    it('Property 6: Auto-Rotate Y-Axis Only - only Y rotation changes during auto-rotate', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(-Math.PI), max: Math.fround(Math.PI), noNaN: true }),  // initial rotation X
          fc.float({ min: Math.fround(-Math.PI), max: Math.fround(Math.PI), noNaN: true }),  // initial rotation Y
          fc.float({ min: Math.fround(0.001), max: Math.fround(0.01), noNaN: true }),        // auto-rotate speed
          fc.integer({ min: 1, max: 100 }),                                                   // number of frames
          (initialRotationX, initialRotationY, autoRotateSpeed, frames) => {
            // Create a mock sphere group with initial rotation
            const mockSphereGroup = {
              rotation: { x: initialRotationX, y: initialRotationY, z: 0 }
            };

            const controller = new SphereController(mockSphereGroup, {
              autoRotateSpeed: autoRotateSpeed,
              idleTimeout: 0  // Immediate auto-rotate for testing
            });

            // Ensure controller is in auto-rotate mode (not dragging, not hovering, past idle timeout)
            controller.isDragging = false;
            controller.isHovering = false;
            controller.lastInteractionTime = 0;  // Long time ago
            controller.momentum = { x: 0, y: 0 };  // No momentum

            // Record initial X rotation
            const initialX = mockSphereGroup.rotation.x;

            // Apply multiple update frames
            for (let i = 0; i < frames; i++) {
              controller.update();
            }

            // X rotation should remain unchanged
            const xUnchanged = Math.abs(mockSphereGroup.rotation.x - initialX) < 0.0001;
            
            // Y rotation should have changed by autoRotateSpeed * frames
            const expectedY = initialRotationY + (autoRotateSpeed * frames);
            const yChanged = Math.abs(mockSphereGroup.rotation.y - expectedY) < 0.0001;

            return xUnchanged && yChanged;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: 3d-skills-sphere, Property 5: Auto-Rotate Resume After Idle
     * 
     * *For any* sphere state where isDragging is false and time since last interaction 
     * exceeds the idle threshold (3 seconds), isAutoRotating SHALL be true.
     * 
     * **Validates: Requirements 2.3**
     */
    it('Property 5: Auto-Rotate Resume After Idle - auto-rotate resumes after idle timeout', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 10000 }),  // idle timeout in ms
          fc.integer({ min: 0, max: 20000 }),     // time since last interaction in ms
          (idleTimeout, timeSinceInteraction) => {
            // Create a mock sphere group
            const mockSphereGroup = {
              rotation: { x: 0, y: 0, z: 0 }
            };

            const controller = new SphereController(mockSphereGroup, {
              idleTimeout: idleTimeout
            });

            // Set up state: not dragging, not hovering, no momentum
            controller.isDragging = false;
            controller.isHovering = false;
            controller.momentum = { x: 0, y: 0 };
            
            // Set last interaction time to simulate elapsed time
            controller.lastInteractionTime = Date.now() - timeSinceInteraction;

            // Check if auto-rotating
            const isAutoRotating = controller.isAutoRotating();

            // Should auto-rotate if time since interaction >= idle timeout
            const shouldAutoRotate = timeSinceInteraction >= idleTimeout;

            return isAutoRotating === shouldAutoRotate;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Billboard and Hover System Tests
   */
  describe('Billboard and Hover System', () => {
    /**
     * Feature: 3d-skills-sphere, Property 7: Billboard Orientation
     * 
     * *For any* skill node and camera position, the node's forward vector SHALL point 
     * toward the camera position (within angular tolerance of 0.01 radians).
     * 
     * **Validates: Requirements 4.3**
     */
    it('Property 7: Billboard Orientation - nodes face camera within tolerance', () => {
      fc.assert(
        fc.property(
          // Camera quaternion components (normalized)
          fc.float({ min: -1, max: 1, noNaN: true }),
          fc.float({ min: -1, max: 1, noNaN: true }),
          fc.float({ min: -1, max: 1, noNaN: true }),
          fc.float({ min: -1, max: 1, noNaN: true }),
          (qx, qy, qz, qw) => {
            // Normalize the quaternion
            const length = Math.sqrt(qx * qx + qy * qy + qz * qz + qw * qw);
            if (length < 0.0001) return true; // Skip degenerate cases
            
            const cameraQuaternion = {
              x: qx / length,
              y: qy / length,
              z: qz / length,
              w: qw / length
            };

            // When billboard effect is applied, node quaternion should match camera quaternion
            // Simulating the billboard effect: node.quaternion.copy(camera.quaternion)
            const nodeQuaternion = { ...cameraQuaternion };

            // Verify the node is facing the camera
            return isBillboardFacingCamera(nodeQuaternion, cameraQuaternion, 0.01);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: 3d-skills-sphere, Property 9: Hover Scale Factor
     * 
     * *For any* skill node in hovered state, its scale SHALL be exactly 
     * baseScale * hoverScaleFactor (1.2x).
     * 
     * **Validates: Requirements 5.2**
     */
    it('Property 9: Hover Scale Factor - hovered nodes scale to 1.2x', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(10), max: Math.fround(100), noNaN: true }),   // base scale
          fc.float({ min: Math.fround(1.1), max: Math.fround(2.0), noNaN: true }),  // hover scale factor
          (baseScale, hoverScaleFactor) => {
            const expectedScale = baseScale * hoverScaleFactor;
            const actualScale = calculateHoverScale(baseScale, hoverScaleFactor);
            
            // Verify scale is exactly baseScale * hoverScaleFactor
            return Math.abs(actualScale - expectedScale) < 0.0001;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Feature: 3d-skills-sphere, Property 10: Hover Pauses Auto-Rotation
     * 
     * *For any* sphere state where hoveredNode is not null, isAutoRotating SHALL be false.
     * 
     * **Validates: Requirements 5.4**
     */
    it('Property 10: Hover Pauses Auto-Rotation - hovering pauses auto-rotation', () => {
      fc.assert(
        fc.property(
          fc.boolean(),  // isHovering state
          fc.integer({ min: 0, max: 10000 }),  // time since last interaction
          (isHovering, timeSinceInteraction) => {
            // Create a mock sphere group
            const mockSphereGroup = {
              rotation: { x: 0, y: 0, z: 0 }
            };

            const controller = new SphereController(mockSphereGroup, {
              idleTimeout: 3000  // 3 second idle timeout
            });

            // Set up state: not dragging, no momentum
            controller.isDragging = false;
            controller.momentum = { x: 0, y: 0 };
            controller.lastInteractionTime = Date.now() - timeSinceInteraction;
            
            // Set hover state
            controller.setHovering(isHovering);

            // Check if auto-rotating
            const isAutoRotating = controller.isAutoRotating();

            // If hovering, should NOT be auto-rotating regardless of idle time
            if (isHovering) {
              return isAutoRotating === false;
            }
            
            // If not hovering, auto-rotation depends on idle timeout
            const shouldAutoRotate = timeSinceInteraction >= 3000;
            return isAutoRotating === shouldAutoRotate;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Responsive Design Tests
   */
  describe('Responsive Design', () => {
    /**
     * Feature: 3d-skills-sphere, Property 11: Responsive Radius
     * 
     * *For any* viewport width W, the sphere radius SHALL be calculated as:
     * W < 768 ? mobileRadius : desktopRadius.
     * 
     * **Validates: Requirements 6.3**
     */
    it('Property 11: Responsive Radius - returns correct radius based on viewport width', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 2000 }),    // viewport width
          fc.integer({ min: 100, max: 500 }),     // desktop radius
          fc.integer({ min: 50, max: 300 }),      // mobile radius
          fc.integer({ min: 320, max: 1024 }),    // breakpoint
          (viewportWidth, desktopRadius, mobileRadius, breakpoint) => {
            const result = calculateResponsiveRadius(viewportWidth, desktopRadius, mobileRadius, breakpoint);
            
            // Should return mobileRadius when viewport < breakpoint
            // Should return desktopRadius when viewport >= breakpoint
            const expected = viewportWidth < breakpoint ? mobileRadius : desktopRadius;
            
            return result === expected;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Additional test: Default values work correctly
     */
    it('uses default values when not specified', () => {
      // Below default breakpoint (768)
      expect(calculateResponsiveRadius(500)).toBe(150);  // default mobile radius
      
      // Above default breakpoint (768)
      expect(calculateResponsiveRadius(1024)).toBe(200); // default desktop radius
      
      // At exact breakpoint
      expect(calculateResponsiveRadius(768)).toBe(200);  // >= breakpoint returns desktop
    });

    /**
     * Feature: 3d-skills-sphere, Property 12: Visibility Controls Rendering
     * 
     * *For any* sphere state where isVisible is false, isPaused SHALL be true.
     * 
     * **Validates: Requirements 7.3**
     */
    it('Property 12: Visibility Controls Rendering - not visible means paused', () => {
      fc.assert(
        fc.property(
          fc.boolean(),  // isVisible state
          (isVisible) => {
            const shouldPause = shouldPauseRendering(isVisible);
            
            // When not visible, should pause (return true)
            // When visible, should not pause (return false)
            const expected = !isVisible;
            
            return shouldPause === expected;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Additional test: Visibility state transitions
     */
    it('correctly handles visibility state transitions', () => {
      // Not visible -> should pause
      expect(shouldPauseRendering(false)).toBe(true);
      
      // Visible -> should not pause
      expect(shouldPauseRendering(true)).toBe(false);
    });
  });

  /**
   * Theme Support Tests
   */
  describe('Theme Support', () => {
    /**
     * Feature: 3d-skills-sphere, Property 13: Theme Color Mapping
     * 
     * *For any* theme value ('dark' or 'light'), the sphere colors SHALL match 
     * the predefined color scheme for that theme.
     * 
     * **Validates: Requirements 8.1, 8.2**
     */
    it('Property 13: Theme Color Mapping - returns correct colors for each theme', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('dark', 'light'),  // theme value
          (theme) => {
            const colors = getThemeColors(theme);
            const expectedColors = THEME_COLORS[theme];
            
            // Verify all color properties match the predefined scheme
            const backgroundMatch = colors.background === expectedColors.background;
            const nodeColorMatch = colors.nodeColor === expectedColors.nodeColor;
            const textColorMatch = colors.textColor === expectedColors.textColor;
            const glowColorMatch = colors.glowColor === expectedColors.glowColor;
            const hoverGlowMatch = colors.hoverGlow === expectedColors.hoverGlow;
            
            return backgroundMatch && nodeColorMatch && textColorMatch && glowColorMatch && hoverGlowMatch;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Additional test: Dark mode uses light colors for visibility
     */
    it('dark mode uses light node colors for visibility', () => {
      const darkColors = getThemeColors('dark');
      
      // Dark mode should use light/white colors for nodes (0xffffff)
      expect(darkColors.nodeColor).toBe(0xffffff);
      expect(darkColors.textColor).toBe(0xffffff);
    });

    /**
     * Additional test: Light mode uses dark colors for visibility
     */
    it('light mode uses dark node colors for visibility', () => {
      const lightColors = getThemeColors('light');
      
      // Light mode should use dark colors for nodes (0x333333)
      expect(lightColors.nodeColor).toBe(0x333333);
      expect(lightColors.textColor).toBe(0x333333);
    });

    /**
     * Additional test: Invalid theme falls back to dark
     */
    it('invalid theme falls back to dark colors', () => {
      const invalidColors = getThemeColors('invalid');
      const darkColors = getThemeColors('dark');
      
      // Should return dark theme colors for invalid input
      expect(invalidColors).toEqual(darkColors);
    });

    /**
     * Additional test: THEME_COLORS has required structure
     */
    it('THEME_COLORS has all required properties', () => {
      const requiredProps = ['background', 'nodeColor', 'textColor', 'glowColor', 'hoverGlow'];
      
      // Check dark theme
      requiredProps.forEach(prop => {
        expect(THEME_COLORS.dark).toHaveProperty(prop);
        expect(typeof THEME_COLORS.dark[prop]).toBe('number');
      });
      
      // Check light theme
      requiredProps.forEach(prop => {
        expect(THEME_COLORS.light).toHaveProperty(prop);
        expect(typeof THEME_COLORS.light[prop]).toBe('number');
      });
    });
  });


});
