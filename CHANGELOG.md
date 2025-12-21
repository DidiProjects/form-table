# Changelog

## [2.1.0] - 2025-10-25

### **Added**
- **Customizable highlight colors via props** - New `highlightStyle` prop for inline styling
- **CSS custom properties support** - Use CSS variables for dynamic theming
- **Multiple styling options** - Choose between CSS classes or inline props
- **Enhanced TypeScript support** - Complete typing for style options

### **Improved**
- **Better layout preservation** - Changed from `<span>` to `<mark>` elements for highlighting
- **Enhanced CSS reset** - Added comprehensive inline styles to prevent layout disruption
- **Semantic HTML** - Using `<mark>` element which is semantically correct for highlighting
- **Performance optimization** - Added React.memo with custom comparison function
- **Memoization improvements** - Added useMemo and useCallback for better performance
- **Render optimization** - Component only re-renders when props actually change

### **New Features**
- **highlightStyle prop**: Customize colors directly via component props
  - `backgroundColor`: Set highlight background color
  - `color`: Set highlight text color  
  - `fontWeight`: Set highlight font weight
- **CSS Variables**: Automatic CSS custom properties generation
- **Backward compatible**: Existing CSS class styling still works

### **Documentation**
- **Updated README** with new styling examples
- **Props table updated** with new highlightStyle option
- **Multiple examples** showing different styling approaches

### **Examples**
```tsx
// New: Style via props
<HighlightText 
  search="text"
  highlightStyle={{
    backgroundColor: '#e91e63',
    fontWeight: 'bold',
    color: '#ffffff',
  }}
>
  Content to highlight
</HighlightText>

// Still works: Style via CSS
<HighlightText 
  search="text"
  highlightClassName="my-custom-class"
>
  Content to highlight
</HighlightText>
```

---

## [2.0.0] - 2025-10-25

### **BREAKING CHANGES**
- **Completely redesigned API** - Now works as wrapper with `children` instead of `text` prop
- **Expanded functionality** - Full support for nested HTML structures
- **Greater flexibility** - Works with any type of React content

### **Added**
- **Smart wrapper** - Applies highlighting to all content within the component
- **Recursive processing** - Traverses and processes nested HTML elements
- **Universal support** - Works with texts, elements, tables, lists, etc.
- **Optimized performance** - Improved algorithm for complex structures
- **Structure preservation** - Maintains all original elements and props

### **Changed**
- **Main props**: `text` → `children` (BREAKING)
- **Default container**: `<span>` → `<div>` for better compatibility
- **Processing**: Single string → Recursive children processing
- **Flexibility**: Simple text → Any React content

### **Technical**
- Implemented recursive processing with `cloneElement`
- Added support for `ReactElement`, arrays, and primitive types
- Improved edge case handling
- Optimized search and replace algorithm

### **Documentation**
- **README completely rewritten** with new examples
- **Expanded use cases** - tables, lists, complex HTML
- **Migration guide** from v1.x to v2.x
- **Advanced examples** with regex and nested structures

### **Migration Guide**
```tsx
// v1.x (OLD)
<HighlightText text="My text" search="text" />

// v2.x (NEW)
<HighlightText search="text">
  My text
</HighlightText>
```

---

## [1.0.1] - 2025-10-24

### Fixed
- **Fixed "Invalid hook call" error** - Removed `useMemo` that caused conflicts with multiple React instances
- **Eliminated compatibility issues** - Replaced JSX with `React.createElement` for maximum compatibility
- **Improved stability** - Text processing function is now completely pure
- **Fixed build issues** - Optimized configuration for distribution

### Changed
- **Simplified architecture** - Lighter component without internal React dependencies
- **Better performance** - Optimized text processing
- **Greater stability** - Eliminated side effects and problematic dependencies

### Technical
- Removed `useMemo` hook
- Implemented pure `processText` function
- Replaced JSX with `React.createElement`
- Improved build configuration
- Added robust regex handling

---

## [1.0.0] - 2025-10-24

### Added
- **Initial release** of highlight-text library
- **HighlightText component** for highlighting text in React applications
- **Customizable styles** with configurable CSS classes
- **Optional case-sensitive search**
- **Regex support** for advanced searches
- **TypeScript** with complete typing
- **Complete documentation** with examples