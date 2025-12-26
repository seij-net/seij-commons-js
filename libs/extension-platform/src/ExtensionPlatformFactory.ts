import { coreExtension } from "./extension";
import { Extension, ExtensionPlatform, ServiceContributions } from "./interfaces";
import { ExtensionRegistryImpl } from "./internal/ExtensionRegistryImpl";
import { ServiceRegistryImpl } from "./internal/ServiceRegistryImpl";

/**
 * Creates an instance of the platform
 *
 * @param extensions  list of extensions to inclue
 * @returns initialized platform
 */
export function createExtensionPlatform(extensions: Extension[]): ExtensionPlatform {
  // Extension registry
  const extensionRegistry = new ExtensionRegistryImpl(extensions);
  extensionRegistry.registerCoreContributionPoint(coreExtension, ServiceContributions);
  extensionRegistry.init();

  // Services
  const serviceRegistry = new ServiceRegistryImpl(extensionRegistry);
  const platform: ExtensionPlatform = {
    extensionRegistry: extensionRegistry,
    serviceRegistry: serviceRegistry,
  };
  return platform;
}
