/**
 * Input sanitization and validation utilities
 */

// Limits for custom inputs
export const INPUT_LIMITS = {
  MAX_CUSTOM_LENGTH: 100, // Max characters per custom input
  MAX_CUSTOM_PER_QUADRANT: 5, // Max custom entries per quadrant
} as const;

/**
 * Sanitize user input by removing potentially dangerous characters
 * and normalizing whitespace
 */
export const sanitizeInput = (input: string): string => {
  return (
    input
      // Normalize unicode to prevent homograph attacks
      .normalize('NFC')
      // Remove control characters except newline/tab (eslint-disable for this specific regex)
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      // Normalize whitespace (collapse multiple spaces, trim)
      .replace(/\s+/g, ' ')
      .trim()
      // Truncate to max length
      .slice(0, INPUT_LIMITS.MAX_CUSTOM_LENGTH)
  );
};

/**
 * Escape special characters that could be used for prompt injection
 * Used when building the AI prompt
 */
export const escapeForPrompt = (input: string): string => {
  // Replace characters that might be interpreted as prompt delimiters or instructions
  return input
    .replace(/[<>]/g, '') // Remove angle brackets (potential XML/HTML injection)
    .replace(/```/g, "'''") // Prevent code block injection
    .replace(/---+/g, '-') // Prevent horizontal rule injection
    .replace(/#{4,}/g, '###'); // Limit heading depth
};

/**
 * Validate data loaded from localStorage
 * Only rejects truly malformed data - lenient to avoid data loss
 */
export const validateStoredReport = (data: unknown): boolean => {
  if (!data || typeof data !== 'object') return false;

  const report = data as Record<string, unknown>;

  // Only require id and some content field to exist
  if (typeof report.id !== 'string' || !report.id) return false;

  // Accept either markdownContent or analysis (backwards compatibility)
  const hasContent =
    typeof report.markdownContent === 'string' || typeof report.analysis === 'string';
  if (!hasContent) return false;

  // Validate content is not suspiciously long (prevent storage attacks)
  const content = (report.markdownContent || report.analysis) as string;
  if (content.length > 500000) return false;

  return true;
};

/**
 * Safely parse JSON from localStorage with validation
 */
export const safeParseJSON = <T>(json: string, validator: (data: unknown) => boolean): T | null => {
  try {
    const parsed = JSON.parse(json);
    if (validator(parsed)) {
      return parsed as T;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Check if a string contains potential prompt injection patterns
 */
export const containsInjectionPatterns = (input: string): boolean => {
  const patterns = [
    /ignore\s+(previous|above|all)\s+(instructions?|prompts?)/i,
    /disregard\s+(previous|above|all)/i,
    /you\s+are\s+now\s+/i,
    /new\s+instructions?:/i,
    /system\s*:\s*/i,
    /assistant\s*:\s*/i,
    /human\s*:\s*/i,
  ];

  return patterns.some(pattern => pattern.test(input));
};
