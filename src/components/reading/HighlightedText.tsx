export function highlightText(text: string, bgColour: string, id: string) {
  return `<span style="background-color: ${bgColour};" class="rounded" data-highlight-id="${id}">${text}</span>`;
}
