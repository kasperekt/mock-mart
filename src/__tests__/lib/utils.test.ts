import { cn } from '../../lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      // Test with simple strings
      expect(cn('class1', 'class2')).toBe('class1 class2');
      
      // Test with conditional classes
      expect(cn('class1', { 'class2': true, 'class3': false })).toBe('class1 class2');
      
      // Test with array of classes
      expect(cn('class1', ['class2', 'class3'])).toBe('class1 class2 class3');
      
      // Test with mixed inputs
      expect(cn('class1', { 'class2': true }, ['class3', { 'class4': true }])).toBe('class1 class2 class3 class4');
      
      // Test with Tailwind conflicts that should be merged
      expect(cn('p-4', 'p-6')).toBe('p-6');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });
  });
});