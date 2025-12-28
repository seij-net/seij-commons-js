# Publishing the packages to NPM registry

## Overview

A package is published on the NPM registry when the project is tagged with a version number.

Tags are following this format: `libs/<package-name>/v<version-number>`.

When tagging the project with such tag, the GitHub action [publish.yml](../.github/workflows/publish.yml) will be triggered.

This action will build the matching module, then publish the package on the NPM registry.

## Adding new package

- Make sure that before adding in `seij-commons` the package dependencies already exists when importing from other repos.
- Add package into `libs/`
- Add licence to `package.json`
- Add Git repo to `package.json`
- Copy the same structure as other libs (vite builds a mutual between packages, as linting and other things)
- `pnpm install` (if imported from another repo)
- make sure version for this packages is `0.0.1` for the moment (we will change later)
- `pnpm run format`
- `pnpm run lint`
- `pnpm run test`
- `pnpm run build`
- Commit and push if needed
- `git tag libs/common-services/v0.0.1`
- `git push origin libs/common-services/v0.0.1`
- Action on github will fail because GitHub can only push on already created repo on npm
- `pnpm login`
- `pnpm --filter @seij/common-services publish --access public`
- check on npm that package is published in version 0.0.1 and that package.json file resolves all version numbers
- if there are dependencies on other seij-commons, check that dependencies version numbers are correctly resolved
- On NPM, go the the package settings
- Add GitHub Action as Trusted Publisher
  - Organization or user = `seij-net`
  - Repository: `seij-commons-js`
  - Workflow file name: `publish.yml`
  - Environment: `publishing`
  - Click `setup connection`
- Change version number on package.json for this package (commit + push)
- Retag with `libs/common-services/v0.1.0` or whatever version number should be there (see below)
- Check on GitHub that everything runs, actions should now publish directly on Npm
- Go to Npm UI, check that package is deployed with new version number
- Check that versions numbers in `package.json` are correctly resolved
- In another project, import the lib in the project's `package.json`

## Publishing a new version

- make sure that all dependent modules are published on npm with the correct version.
- check that your module's package.json has the correct **next** version number.
- make sure everything is committed and pushed.
- run `./tools/publish-tag.sh <module-name>`: this will publish the module by tagging, then wait that GitHub actions are successful by checking the module is published on NPM.

## Retag

Use this command to retag the project (remove old tag and create a new one). This will trigger the publish process:

```bash
export TAG="libs/common-types/v0.1.0"; git tag -d $TAG; git push origin --delete $TAG; git tag $TAG; git push origin $TAG
```
