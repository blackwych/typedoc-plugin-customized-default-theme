import { Application, ParameterType } from 'typedoc';

import Theme from './Theme';

const load = (app: Application) => {
  app.options.addDeclaration({
    name: 'themeCustomizers',
    help: 'Modules providing listeners and a decorator',
    type: ParameterType.ModuleArray,
    defaultValue: [],
  });

  app.renderer.defineTheme(Theme.themeName, Theme);
};

export { load }; // eslint-disable-line import/prefer-default-export
