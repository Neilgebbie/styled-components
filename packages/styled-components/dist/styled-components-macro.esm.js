import { addDefault, addNamed } from '@babel/helper-module-imports';
import traverse from '@babel/traverse';
import { createMacro } from 'babel-plugin-macros';
import babelPlugin from 'babel-plugin-styled-components';

function _extends() {
  _extends = Object.assign || function (target) {
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];

      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function styledComponentsMacro(_ref) {
  const {references} = _ref;
      const {state} = _ref;
      const t = _ref.babel.types;
      const _ref$config = _ref.config;
      const config = _ref$config === void 0 ? {} : _ref$config;
  const program = state.file.path; // FIRST STEP : replace `styled-components/macro` by `styled-components
  // references looks like this
  // { default: [path, path], css: [path], ... }

  let customImportName;
  Object.keys(references).forEach(function (refName) {
    // generate new identifier
    let id;

    if (refName === 'default') {
      id = addDefault(program, 'styled-components', {
        nameHint: 'styled'
      });
      customImportName = id;
    } else {
      id = addNamed(program, refName, 'styled-components', {
        nameHint: refName
      });
    } // update references with the new identifiers


    references[refName].forEach(function (referencePath) {
      // eslint-disable-next-line no-param-reassign
      referencePath.node.name = id.name;
    });
  }); // SECOND STEP : apply babel-plugin-styled-components to the file

  const stateWithOpts = _extends({}, state, {
    opts: config,
    customImportName
  });

  traverse(program.parent, babelPlugin({
    types: t
  }).visitor, undefined, stateWithOpts);
}

const index = createMacro(styledComponentsMacro, {
  configName: 'styledComponents'
});

export default index;
// # sourceMappingURL=styled-components-macro.esm.js.map
