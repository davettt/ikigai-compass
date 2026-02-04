# Changelog

## [1.2.0] - 2026-02-04

### Added
- **Report renaming**: Rename saved analyses from the History screen with inline editing
- **History screen improvements**: Full feature parity with Report screen
  - Copy markdown button
  - PDF download button
  - Styled markdown rendering with proper headings, lists, and blockquotes
- **Exit button**: Home icon on assessment screens to exit without losing progress
- **Detailed quadrant instructions**: Each assessment step now includes guidance on how to approach selections

### Changed
- **Consolidated categories**: Reduced from ~340 to ~192 focused options to minimize overlap
  - Merged "Customer & Support" into "Interpersonal Skills"
  - Merged "Training & Enablement" into "Communication & Teaching"
  - Split "Food & Culture" into separate "Food & Culinary" and "Travel & Culture" groups
  - Reorganized Nature & Animals (removed photography, added beaches/coastlines, mountains/wilderness)
  - Distinguished reading from audiobooks/podcasts consumption

### Fixed
- **PDF export**: Japanese/CJK characters now stripped (Helvetica font limitation) instead of causing rendering errors
- **PDF spacing**: Increased heading margins to prevent content overlap

## [1.1.0] - 2026-02-03

### Added
- **File-based report storage**: Reports now saved to `local_data/reports/` instead of localStorage for better persistence and reliability
- **Dramatically expanded categories**: ~340 options across 37 groups (up from ~95 options across 22 groups)
  - New "What You Love" groups: Sports & Physical Activities, Food & Culinary, Travel & Culture, Technology & Digital, Personal Growth & Wellness
  - New "What You're Good At" groups: Training & Enablement, Organizational Skills, Customer & Support, Physical & Manual
  - New "What the World Needs" groups: Knowledge & Skills Gaps, Global & Political, Health & Wellness
  - New "What You Can Be Paid For" groups: Trades & Skilled Labor, Science & Research, Agriculture & Food
- **Input validation and limits**: Max 100 characters per custom entry, max 5 custom entries per quadrant
- **Security hardening**: Input sanitization, prompt injection prevention, safe localStorage parsing
- **Development tooling**: Added Prettier, typecheck, and audit scripts
  - `npm run format` / `npm run format:check` - Code formatting
  - `npm run typecheck` - TypeScript checking
  - `npm run audit` - Security vulnerability scanning
  - `npm run check` - Run all checks at once
  - `npm run check:fix` - Run all checks with auto-fix

### Changed
- Resume progress button only appears when there are actual selections (not just if localStorage key exists)
- Reports API now served from backend with proper REST endpoints
- Improved error handling for storage operations with loading states

### Fixed
- PWA icons now properly generated and referenced in manifest
- Storage validation no longer accidentally deletes valid reports
- ESLint configuration updated for Prettier compatibility

## [1.0.0] - 2026-02-02

### Added
- Initial MVP release
- Interactive 4-quadrant ikigai assessment
- Claude AI integration for personalized analysis
- Life context selection (exploring, transitioning, established, reinventing, retiring)
- Priority weighting sliders for each quadrant
- Model selection (Haiku 3.5, Sonnet 4, Opus 4)
- Markdown and PDF report generation
- History tracking
- PWA support with manifest
- Dark/light mode support

### Features
- Predefined options across multiple categories
- Custom input support for personalized selections
- Analysis with Japanese cultural nuances
- Copy to clipboard and download functionality
- Responsive design for mobile and desktop
