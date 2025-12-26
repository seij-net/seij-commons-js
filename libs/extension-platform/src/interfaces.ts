/**
 * A modular system for Javascript ecosystem to implement the Extension / ExtensionPoint pattern.
 *
 * Serves as a core for modular monoliths.
 */

/**
 * Extension platform exposes the core internal services.
 *
 * Use createExtensionPlatform(extensions) to create the platform
 */
export interface ExtensionPlatform {
  /**
   * Gets initialized and running extension registry
   */
  extensionRegistry: ExtensionRegistry;
  /**
   * Gets initialized and running service registry
   */
  serviceRegistry: ServiceRegistry;
}

/**
 * Extension registry references all declared extensions.
 *
 * Once build, stores all contributions from all extensions in all contribution
 * points.
 *
 * User can query the registry to get all contributions for a particular
 * contribution point.
 */
export interface ExtensionRegistry {
  /**
   * Find all contributions to a contribution point.
   *
   * Returned list is flat (meaning that your can't known the origin extension of the contribution).
   *
   * Meant to be used in cases where speed is required because it returns the pre-built list of contributions
   * which doesn't change since the extension platform contruction (and also will always be === compatible.)
   *
   */
  findContributionsFlat<CONTRIB>(contributionPoint: ContributionPoint<CONTRIB>): CONTRIB[];
  /**
   * Find all contributions to a contribution point with origin.
   *
   * Meant to be used by services where you need to know where the
   * contributions come from (for example when you need to display errors in declarations)
   *
   * This shall not be used in React components because the returned list is not
   * guaranteed to always have strict equality (===) and therefore could provoke
   * unnecessary refreshes.
   */
  findContributionsWithOrigin<EXT>(extensionPoint: ContributionPoint<EXT>): ContributionWithOrigin<EXT>[];
}

/**
 * When registering an extension this is the context given to the extension
 * so that it can register its stuff and declare itself.
 */
export interface ExtensionContext {
  /**
   * Allow registering a contribution to a contribution point.
   * The contribution point declares an expected interface that the contribution must respect
   */
  register: <EXT>(contributionPoint: ContributionPoint<EXT>, contribution: EXT) => void;
  /**
   * Creates a contribution point
   */
  registerContributionPoint: <EXT>(contributionPoint: ContributionPoint<EXT>) => void;
  /**
   * Registers a service
   * @param service
   * @returns
   */
  registerService: <S>(ref: ServiceRef<S>, service: ServiceConstructor<S>) => void;
}

/**
 * An extension.
 *
 * Extension developpers shall implement this interface.
 */
export interface Extension {
  /**
   * Name of the extension
   *
   * Should be all lowercase with no spaces. The name must be unique to the Marketplace.
   */
  name: string;
  /**
   * Called when the whole system is built at startup. It's time for extension
   * to register its contributions to the contribution points.
   * @param context context given with methods useful for the extension to declare itself (register contributions for example)
   */
  activate: (context: ExtensionContext) => void;
  /**
   * Called when the whole system shuts down or when an extension shall be reloaded.
   * If any resources are kept by the extension, it's time to close or release them.
   */
  deactivate?: () => void;
}
/**
 * A contribution point is defined by a unique code (two contributions points can
 * not have the same code). It also defines what interface contributions should
 * implement.
 */
// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export type ContributionPoint<CONTRIB> = { code: string };

export type ContributionWithOrigin<T = unknown> = {
  extensionId: string;
  item: T;
};

/**
 * Service constructor.
 *
 * Those are passed down to services when they are created so they can
 * lookup for contributions or other services
 */
export type ServiceConstructorProps = {
  extensionRegistry: ExtensionRegistry;
  serviceRegistry: ServiceRegistry;
  extensionPlatform: ExtensionPlatform;
};

/**
 * Defines the constructor of services. Used to be able to type services
 */
export type ServiceContribution<T = any> = {
  id: string;
  constructor: ServiceConstructor<T>;
};

export type ServiceConstructor<T> = new (props: ServiceConstructorProps) => T;

/**
 * Service registry that exposes running services
 */
export interface ServiceRegistry {
  /**
   * Finds an instance of a service
   * @param token service name (pass the Class)
   * @returns instance of the service class
   */
  resolve: <T>(token: ServiceRef<T>) => T;
}

/**
 * Contribution point to store all service declarations
 */
export const ServiceContributions: ContributionPoint<ServiceContribution<unknown>> = {
  code: "seij.extension-platform.Services",
};

/**
 * Service reference with a strong typing
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ServiceRef<T> = { id: string };

export function serviceRef<T>(id: string): ServiceRef<T> {
  return { id: id };
}
