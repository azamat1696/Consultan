export function generateSlug(text: string): string {
  const turkishChars: { [key: string]: string } = {
    'ğ': 'g', 'Ğ': 'G',
    'ü': 'u', 'Ü': 'U',
    'ş': 's', 'Ş': 'S',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ç': 'c', 'Ç': 'C'
  };

  return text
    .toLowerCase()
    // Replace Turkish characters
    .replace(/[ğüşıöçĞÜŞİÖÇ]/g, letter => turkishChars[letter] || letter)
    // Replace spaces with dashes
    .replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^a-z0-9-]/g, '')
    // Remove duplicate dashes
    .replace(/-+/g, '-')
    // Remove leading and trailing dashes
    .replace(/^-+|-+$/g, '');
} 