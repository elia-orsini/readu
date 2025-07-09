export function highlightText(text: string, bgColour: string, id: string) {
  return `<span style="background-color: var(--${bgColour});" class="rounded" data-highlight-id="${id}">${text}</span>`;
}
