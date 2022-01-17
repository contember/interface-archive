# Contember Admin

## Contributing
If you wish to send a pull request, be sure to first consult the maintainers by creating an issue. We typically react
very quickly and are happy to provide any guidance.

## Local setup
1. Copy `docker-compose.override.dist.yml` to `docker-compose.override.yml`
2. Run `docker-compose up -d`
3. Run `docker-compose run contember-cli migrations:execute admin-sandbox`

## Local setup on Mac
1. Install [Mutagen Compose](https://github.com/mutagen-io/mutagen-compose) `brew install mutagen-io/mutagen/mutagen-compose-beta`
2. Copy `docker-compose.override.mutagen.yml` to `docker-compose.override.yml`
3. Run `mutage-compose up -d`
4. Run `mutagen-compose run contember-cli migrations:execute admin-sandbox`

## UI development
Run `pnpm run storybook`. Add/edit stories in `packages/ui/stories`.
