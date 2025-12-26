import { throwError } from "@seij/common-types";
import {
  ContributionPoint,
  Extension,
  ExtensionContext,
  ServiceConstructorProps,
  serviceRef,
} from "@seij/extension-platform";
import { errorOnDuplicates } from "@seij/extension-tooling";
import { Id, IdDto, ListPaginatedDto, SingleItemDto } from "./dto";
import {
  createInvalidationQueryKey,
  createQueryKeyItem,
  createQueryKeySearch,
  createQueryKeySearchSummary,
  QueryKey,
} from "./internal/querykeys";

export * from "./dto";

/**
 * Extension to manage entity storage
 */
export class EntityStorageExtension implements Extension {
  name = "seij.entity-storage";
  activate(context: ExtensionContext) {
    context.registerService(EntityStorageServiceRef, EntityStorageService);
    context.registerContributionPoint(EntityStorageContributions);
    context.registerContributionPoint(EntityStorageInvalidationContributions);
  }
}

/**
 * Extensions can contribute by providing function to fetch data from
 * remote or local storage
 */
export const EntityStorageContributions: ContributionPoint<EntityStorageContribution<any, any, any, any, any>> = {
  code: "seij.entity-storage.EntityStorageContributions",
};
/**
 * Used to hook on invalidations and provide additional query cache invalidations
 * when entities are mutated
 */
export const EntityStorageInvalidationContributions: ContributionPoint<EntityStorageInvalidationContribution> = {
  code: "seij.entity-storage.EntityStorageInvalidationContributions",
};

/**
 * Base interface to mark SearchQueryParams
 */
export interface EntityStorageSearchQueryParams {}

/**
 * Base interface for all entity instances
 *
 * To be able to work correctly, all entities need to have an id.
 */

export interface EntityInstance {
  /** Unique identifier of this */
  id: string;
}

/**
 * Search for summaries (label + description) of entities. The goal is
 * to provide reduced displays of entities and not fetch the whole planet
 * only to use a label and a description.
 */
export interface SearchSummaryResultItem {
  id: string;
  label: string;
  description: string | null;
}

/**
 * Used as base interface for initializers (the stuff you pass to create entitie instances)
 */
export interface InitializerDtoBase extends Record<string, any> {}

/**
 *  Used to update the property of an entity instance.
 */
export interface UpdateItemPropertyDto {
  /** Id of entity */
  id: Id;
  /** Property name */
  propertyName: string;
  /** Property value, should match then entity definition */
  propertyValue: any;
}

/**
 * Contribution that allow extensions to resolve entities
 */
export interface EntityStorageContribution<
  RESOURCE_DTO extends EntityInstance = EntityInstance, // Base object,
  INITIALIZER_DTO extends InitializerDtoBase = {}, // Object type use for creation
  FETCH_RESULT_DTO = RESOURCE_DTO, // When using fetch, the type of object returned, defaults to RESOURCE_DTO. Does not extends from EntityInstance because it can be an aggregate.
  SEARCH_QUERY_PARAMS extends EntityStorageSearchQueryParams = {}, // Search query parameters
  SEARCH_RESULT_DTO extends EntityInstance = RESOURCE_DTO, // Search result
> {
  /**
   * Name of entity managed by this storage
   */
  entity: string;
  /**
   * Gets an entity instance using item unique identifier.
   *
   * Resource fetched may contain be an aggregate of multiple things and not
   * directly the RESOURCE_DTO, mostly because screen may have to display more
   * than just the fields of the entity instance, for example related concepts or
   * enrichments.
   */
  fetchItem: (req: IdDto) => Promise<SingleItemDto<FETCH_RESULT_DTO>>;
  /**
   * Searchs for a list of summaries of this entity.
   *
   * This is a separated type of query than search, so that you can implement
   * API endpoints that work faster that what a full search could retreive.
   *
   * Usage is meant for lists (when fetching relationships) or forms/view,
   * wherever you need a very short version of the entities, just to display
   * their name.
   */
  searchSummary: (queryParams: SEARCH_QUERY_PARAMS) => Promise<ListPaginatedDto<SearchSummaryResultItem>>;
  /**
   * Searchs for a list of entity instances
   *
   * This is meant for lists or tables that need details on each entity instance.
   *
   * You can return something else than the base RESOURCE_DTO if (and only if)
   * you implement mapFetchResultDtoToResourceDto()
   */
  search: (queryParams: SEARCH_QUERY_PARAMS) => Promise<ListPaginatedDto<SEARCH_RESULT_DTO>>;
  /**
   * Sends initialization data to item creation.
   *
   * This is meant for lists or tables that need details on each entity instance.
   *
   * You can return something else than the base RESOURCE_DTO if (and only if)
   * you implement mapFetchResultDtoToResourceDto()
   */
  createItem: (req: INITIALIZER_DTO) => Promise<SingleItemDto<RESOURCE_DTO>>;
  /**
   * Deletes item using its id
   */
  deleteItem: (req: IdDto) => Promise<unknown>;
  /**
   * Updates one entity instance property
   */
  updateItemProperty: (req: UpdateItemPropertyDto) => Promise<unknown>;
  mapFetchResultDtoToResourceDto?: (item: FETCH_RESULT_DTO) => RESOURCE_DTO;
  mapSearchResultDtoToSummaryDto?: (item: SEARCH_RESULT_DTO) => SearchSummaryResultItem;
}

/**
 * Provides a way to invoke additional query cache invalidations when entities
 * are mutated.
 *
 * Imaging you have standalone queries that use entity MyEntity. Those queries
 * are unknown to the extension that defines MyEntity. You wish that
 * if you delete or update entity MyEntity, all other queries gets invalidated,
 * so that user dont see those items in other lists.
 */
export interface EntityStorageInvalidationContribution {
  /**
   * Name of the entity mutated
   */
  entityName: string;
  /**
   * Keys to invalidate on entity instances mutation (do not add basic CRUD
   * which are already managed, just yours)
   */
  queryKeys: QueryKey[];
}
export const EntityStorageServiceRef = serviceRef<EntityStorageService>("EntityStorageToken");
export class EntityStorageService {
  storageByEntityName: Record<string, EntityStorageContribution>;
  invalidationQueryKeysContribs: EntityStorageInvalidationContribution[];
  constructor(props: ServiceConstructorProps) {
    const entityResolvers = props.extensionRegistry.findContributionsFlat(EntityStorageContributions);
    errorOnDuplicates(entityResolvers, (it) => it.entity);
    this.storageByEntityName = Object.fromEntries(entityResolvers.map((it) => [it.entity, it]));
    this.invalidationQueryKeysContribs = props.extensionRegistry.findContributionsFlat(
      EntityStorageInvalidationContributions,
    );
  }
  private findStore(entityName: string): EntityStorageContribution {
    const store: EntityStorageContribution =
      this.storageByEntityName[entityName] ?? throwError("No entity resolver for " + entityName);
    return store;
  }
  /**
   * Searchs for a paginated list of entities using this query parameters
   * @param entityName name of entity to search for
   * @param searchQueryParams query parameters as a record of string/values
   * @returns list of paginated entities
   */
  searchSummary(
    entityName: string,
    searchQueryParams: EntityStorageSearchQueryParams,
  ): Promise<ListPaginatedDto<SearchSummaryResultItem>> {
    const store = this.findStore(entityName);
    return store.searchSummary(searchQueryParams);
  }
  /**
   * Creates a cache key for this request
   * @param entity name of entity to search for
   * @param searchQueryParams query parameters as a record of string/values
   * @returns list of strings to compose a query key that acts as a cache key
   */
  searchSummaryQueryKey(entity: string, searchQueryParams: EntityStorageSearchQueryParams): string[] {
    return createQueryKeySearchSummary(entity, searchQueryParams);
  }

  search<T>(entityName: string, searchQueryParams: EntityStorageSearchQueryParams): Promise<ListPaginatedDto<T>> {
    const store = this.findStore(entityName);
    const promiseResult = store.search(searchQueryParams);
    return promiseResult as Promise<ListPaginatedDto<T>>;
  }
  searchQueryKey(entity: string, searchQueryParams: EntityStorageSearchQueryParams): QueryKey {
    return createQueryKeySearch(entity, searchQueryParams);
  }

  fetchItem<T extends EntityInstance>(entityName: string, id: Id): Promise<SingleItemDto<T>> {
    const store = this.findStore(entityName);
    const promiseResult = store.fetchItem({ id: id });
    return promiseResult as Promise<SingleItemDto<T>>;
  }
  fetchItemQueryKey(entityName: string, id: Id): QueryKey {
    return createQueryKeyItem(entityName, id);
  }

  createItem<E extends EntityInstance, I extends InitializerDtoBase>(
    entityName: string,
    initializer: I,
  ): Promise<SingleItemDto<E>> {
    const store = this.findStore(entityName);
    const promiseResult = store.createItem(initializer);
    return promiseResult as Promise<SingleItemDto<E>>;
  }
  deleteItem<E extends EntityInstance>(entityName: string, id: Id) {
    const store = this.findStore(entityName);
    const promiseResult = store.deleteItem({ id: id });
    return promiseResult as Promise<SingleItemDto<E>>;
  }
  updateItemProperty(entityName: string, value: UpdateItemPropertyDto) {
    const store = this.findStore(entityName);
    const promiseResult = store.updateItemProperty(value);
    return promiseResult;
  }
  invalidationQueryKeys(entityName: string): QueryKey[] {
    const base = createInvalidationQueryKey(entityName);
    const additionals = this.invalidationQueryKeysContribs
      .filter((it) => it.entityName === entityName)
      .map((it) => it.queryKeys)
      .flat();
    return [base, ...additionals];
  }
  mapFetchResultDtoToResourceDto<X extends EntityInstance, Y extends EntityInstance>(entityName: string, x: X): Y {
    const store = this.findStore(entityName);
    return (store.mapFetchResultDtoToResourceDto?.(x) as Y) ?? x;
  }
  mapSearchResultDtoToSummaryDto<X extends EntityInstance>(entityName: string, x: X): SearchSummaryResultItem {
    const store = this.findStore(entityName);
    return store.mapSearchResultDtoToSummaryDto?.(x) ?? (x as unknown as SearchSummaryResultItem);
  }
}

/**
 * Helper function to transform a traditional result into search summary when
 * you don't have or want a separate API
 */
export function mapToSearchSummary<X, Y>(
  resp: Promise<ListPaginatedDto<X>>,
  mapper: (it: X) => Y,
): Promise<ListPaginatedDto<Y>> {
  return resp.then((list) => {
    return { ...list, items: list.items.map(mapper) };
  });
}
