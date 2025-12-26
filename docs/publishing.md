# Publishing the packages to NPM registry

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
export TAG="libs/common-types/v0.1.0"; git tag -d $TAG; git push origin --delete $TAG; git tag $TAG; git push origin $TAG
```
