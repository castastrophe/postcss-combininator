/** @type import('postcss').PluginCreator */
module.exports = () => {
  return {
    postcssPlugin: 'postcss-combininator',
    prepare() {
      const declarations = {};
      return {
        Declaration(decl) {
          if (!decl.prop.startsWith('--')) return;
          declarations[decl.prop] = decl;
        },
        Rule(rule) {
          if (!rule.last) {
            if (rule.nodes.length === 0) rule.remove();
          } else {
            for (const [prop, decl] of Object.entries(declarations)) {
              // if (rule.nodes.some((node) => node.prop === prop)) continue;
              rule.append(decl);
            }
          }
        },
      };
    },
  };
};

module.exports.postcss = true;
