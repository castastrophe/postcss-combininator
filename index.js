/** @type import('postcss').PluginCreator */
module.exports = () => {
  return {
    postcssPlugin: 'postcss-combininator',
    prepare() {
      const rules = [];
      const declarations = {};
      return {
        Declaration(decl) {
          if (!decl.prop.startsWith('--')) return;
          declarations[decl.prop] = decl;
          decl.remove();
        },
        Rules(rule) {
          rules.push(rule);
          if (!rule.last) rule.remove();
          else {
            for (let decl of Object.values(declarations)) {
              rule.append(decl);
            }
          }
        },
      };
    },
  };
};

module.exports.postcss = true;
