/* 
Formats text by: 
  - Removing a starting hash if present
  - Dividing words that are in camelCase with an empty space
  - Replacing all underscores with an empty space
*/
export function formatText(text) {
  return text.replace(/^#/, '').replace(/([a-z](?=[A-Z]))/g, '$1 ').replace('_', ' ');
}