# Publishing the packages to NPM registry

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