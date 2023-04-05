/** @type import('postcss').PluginCreator */
module.exports = ({
  preserve = 'auto',
}) => {
  return {
    postcssPlugin: 'postcss-combininator',
    prepare() {
      const pos = preserve === 'first' ? 'first' : 'last';
      const declarations = new Map();
      return {
        Declaration(decl) {
          // Only looking at custom properties
          if (!decl.prop.startsWith('--')) return;

          if (declarations.has(decl.prop) && pos === 'first') {
            // If we have already captured a value and are preserving the first definition
            decl.remove();
            return;
          }

          // If we're preserving the last definition...
          if (declarations.has(decl.prop) && pos !== 'first') {
            // fetch previous captured declaration
            const d = declarations.get(decl.prop);
            d.remove();

            /** @note this does not return b/c we want to update the map with the new value  */
          }

          // Otherwise we're adding or overwriting the value
          declarations.set(decl.prop, decl);
          decl.remove();
        },
        OnceExit(root) {
          root.walkRules((rule) => {
            // True if we're preserving the first definition and this is the first rule
            // or if this is the last rule
            if (root[pos] === rule) {
              // If the definition doesn't already exist on this rule, add it
              declarations.forEach((decl) => rule.prepend(decl));
            }

            // Clean up empty rules when we're done
            if (rule.nodes.length > 0) return;
            rule.remove();
          });
        },
      };
    },
  };
};

module.exports.postcss = true;
