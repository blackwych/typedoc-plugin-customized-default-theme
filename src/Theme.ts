import {
  DefaultTheme,
  DefaultThemeRenderContext,
  JSX,
  PageEvent,
  Renderer,
  RendererEvent,
  RendererHooks,
} from 'typedoc';

type HookListener = { [K in keyof RendererHooks]: (...args: RendererHooks[K]) => JSX.Element };
type RendererEventListener = (event: RendererEvent) => void;
type PageEventListener = (event: PageEvent) => void;

type RenderContextCtor = typeof DefaultThemeRenderContext;
type ContextDecorator = (ctor: RenderContextCtor) => RenderContextCtor;

class Theme extends DefaultTheme {
  static themeName = 'customized-default';

  protected decorators: ContextDecorator[];

  protected context?: DefaultThemeRenderContext;

  constructor(renderer: Renderer) {
    super(renderer);

    const modules = this.getModulesFromOption('themeCustomizers');

    this.findFunctionsFromModules<HookListener['head.begin']>(modules, 'onHeadBegin')
      .forEach((listener) => renderer.hooks.on('head.begin', listener));

    this.findFunctionsFromModules<HookListener['head.end']>(modules, 'onHeadEnd')
      .forEach((listener) => renderer.hooks.on('head.end', listener));

    this.findFunctionsFromModules<HookListener['body.begin']>(modules, 'onBodyBegin')
      .forEach((listener) => renderer.hooks.on('body.begin', listener));

    this.findFunctionsFromModules<HookListener['body.end']>(modules, 'onBodyEnd')
      .forEach((listener) => renderer.hooks.on('body.end', listener));

    this.findFunctionsFromModules<RendererEventListener>(modules, 'onRendererBegin')
      .forEach((listener) => this.listenTo(renderer, Renderer.EVENT_BEGIN, listener));

    this.findFunctionsFromModules<RendererEventListener>(modules, 'onRendererEnd')
      .forEach((listener) => this.listenTo(renderer, Renderer.EVENT_END, listener));

    this.findFunctionsFromModules<PageEventListener>(modules, 'onRendererPageBegin')
      .forEach((listener) => this.listenTo(renderer, Renderer.EVENT_BEGIN_PAGE, listener));

    this.findFunctionsFromModules<PageEventListener>(modules, 'onRendererPageEnd')
      .forEach((listener) => this.listenTo(renderer, Renderer.EVENT_END_PAGE, listener));

    this.decorators = this.findFunctionsFromModules<ContextDecorator>(modules, 'decorateContext');
  }

  override getRenderContext(): DefaultThemeRenderContext {
    const RenderContext = this.getRenderContextCtor();
    this.context ||= new RenderContext(this, this.application.options);
    return this.context;
  }

  protected getModulesFromOption(optionName: string): Record<string, object> {
    const moduleSpecs = this.application.options.getValue(optionName) as any[];
    return Object.fromEntries(moduleSpecs.map((moduleSpec) => (
      // Assume every specified module exports object
      (typeof moduleSpec === 'string')
        ? [moduleSpec, require(moduleSpec) as object]
        : ['(object)', moduleSpec as object]
    )));
  }

  // eslint-disable-next-line class-methods-use-this
  protected findFunctionsFromModules<F extends Function>(
    modules: Record<string, object>,
    funcName: string,
  ): F[] {
    return Object.entries(modules).reduce<F[]>((funcs, [moduleName, module]) => {
      const func = (module as any)[funcName];

      if (typeof func === 'function') {
        this.application.logger.verbose(`[${Theme.themeName}] Found ${funcName} in ${moduleName}`);
        funcs.push(func as F);
      }

      return funcs;
    }, []);
  }

  protected getRenderContextCtor(): RenderContextCtor {
    return this.decorators.reduce((ctor, decorator) => decorator(ctor), DefaultThemeRenderContext);
  }
}

export default Theme;
