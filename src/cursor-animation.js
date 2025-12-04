export function initCursorAnimation() {
  const cursor = document.createElement('div')
  cursor.className = 'custom-cursor'
  document.body.appendChild(cursor)

  const cursorFollower = document.createElement('div')
  cursorFollower.className = 'cursor-follower'
  document.body.appendChild(cursorFollower)

  let mouseX = 0
  let mouseY = 0
  let followerX = 0
  let followerY = 0

  // Update mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    // Update cursor style based on hovered element
    const hovered = document.elementFromPoint(mouseX, mouseY)
    if (hovered) {
      if (hovered.tagName === 'A' || hovered.classList.contains('btn')) {
          cursor.classList.add('hover-link')
          cursorFollower.classList.add('hover-link')
        } else if (hovered.classList.contains('project-card')) {
          cursor.classList.add('hover-project')
          cursorFollower.classList.add('hover-project')
        } else {
          cursor.classList.remove('hover-link', 'hover-project')
          cursorFollower.classList.remove('hover-link', 'hover-project')
        }
    }
  })

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0'
    cursorFollower.style.opacity = '0'
  })

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1'
    cursorFollower.style.opacity = '1'
  })

  // Smooth animation loop
  function animateCursor() {
    // Lerp follower position
    followerX += (mouseX - followerX) * 0.1
    followerY += (mouseY - followerY) * 0.1

    cursor.style.left = mouseX + 'px'
    cursor.style.top = mouseY + 'px'

    cursorFollower.style.left = followerX + 'px'
    cursorFollower.style.top = followerY + 'px'

    requestAnimationFrame(animateCursor)
  }

  animateCursor()

  // Add click effect
  document.addEventListener('mousedown', () => {
    cursor.classList.add('click')
    cursorFollower.classList.add('click')
  })

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('click')
    cursorFollower.classList.remove('click')
  })

  // Hide default cursor
  document.body.style.cursor = 'none'
}