export type PlatformError = {
  extensionId: string;
  message: string;
};

export function createPlatformError(extensionId: string, message: string): PlatformError {
  return { extensionId: extensionId, message: message };
}
