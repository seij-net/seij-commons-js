import {
  ContributionWithOrigin,
  ExtensionPlatform,
  ExtensionRegistry,
  ServiceConstructorProps,
  ServiceContribution,
  ServiceContributions,
  ServiceRef,
  ServiceRegistry,
} from "../interfaces";
import { createPlatformError, PlatformError } from "./errors";
export type ServiceInstance = {
  extensionId: string;
  instance: any;
};
export class ServiceRegistryImpl implements ServiceRegistry {
  private instances = new Map<string, ServiceInstance>();
  private errors: PlatformError[] = [];
  constructor(extensionRegistry: ExtensionRegistry) {
    const services = extensionRegistry.findContributionsWithOrigin(ServiceContributions);
    const platform: ExtensionPlatform = {
      extensionRegistry: extensionRegistry,
      serviceRegistry: this,
    };
    services.forEach((contrib: ContributionWithOrigin<ServiceContribution<unknown>>) => {
      const props: ServiceConstructorProps = {
        extensionRegistry: extensionRegistry,
        serviceRegistry: this,
        extensionPlatform: platform,
      };
      const extensionId = contrib.extensionId;
      const service = contrib.item;
      const instance = new service.constructor(props);
      const existing = this.instances.get(contrib.item.id);
      if (existing) {
        this.errors.push(
          createPlatformError(
            contrib.extensionId,
            `Service [${contrib.item.id}] already exists and had been declared by extension [${existing.extensionId}]`,
          ),
        );
      } else {
        this.instances.set(contrib.item.id, { extensionId: extensionId, instance: instance });
      }
      if (this.errors.length > 0) {
        if (console) {
          this.errors.forEach((err) => {
            console.error("Error in extension " + err.extensionId + ": " + err.message);
          });
        }
        throw new Error("Could not start ServiceRegistry: " + JSON.stringify(this.errors));
      }
    });
  }
  resolve<T>(ref: ServiceRef<T>): T {
    const existing = this.instances.get(ref.id);
    if (existing) return existing.instance;
    throw new Error(`Could not find service ${ref} in service registry`);
  }
}
