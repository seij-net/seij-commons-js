# Publishing the packages to NPM registry

## Adding new package

- Add package into libs/
- Copy the same structure as other libs (vite builds a mutual between packages, as linting and other things)
- pnpm install (if imported from another repo)
- make sure version is 0.0.1
- pnpm run lint
- pnpm run test
- pnpm run build
- git tag libs/common-services/v0.0.1
- git push origin libs/common-services/v0.0.1
- Action on github will fail because GitHub can only push on already created repo on npm
- pnpm login
- pnpm --filter @seij/common-services publish --access public
- check on npm that package is published in version 0.0.1 and that package.json file resolves all version numbers
- if there are dependencies on other seij-commons, check that dependencies version numbers are correctly resolved
- Change version number on package.json for this package
- Retag with libs/common-services/v0.1.0 or whatever version number should be there (see below)
- Check on GitHub that everything runs, actions should now publish

# Tagging

npm adduser
pnpm --filter @seij/common-types publish --access public

- Go to NPM Registry > package = @seij/common-types > settings
- Add GitHub as a Trusted publisher
  - organization: seij-net
  - repo: seij-commons-js
  - workflow: publish.yml
  - environment: publishing

git tag libs/common-types/v0.1.0
git push origin libs/common-types/v0.1.0

## Retag

```bash
export TAG="libs/common-types/v0.1.0";
git tag -d $TAG;
git push origin --delete $TAG;
git tag $TAG;
git push origin $TAG
```