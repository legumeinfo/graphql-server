---
name: Release Checklist
about: A checklist of tasks required to make a release
title: Release MAJOR.MINOR.PATCH
labels: release
assignees: ''

---

- [ ] Create a branch for the release
- [ ] Update the dependencies. The dependabot PR backlog is not comprehensive and doesn't include transitive dependencies, and merging them one at a time tends to break things, so the best way to do this is manually with npm.
- [ ] Bump the `intermineVersion` in `data-sources/intermine/api/index.ts` if appropriate.
- [ ] Update the base image version in the `Dockerfile` if necessary (this should be the most recent node LTS version) and do a test build and run of the Docker image on you local machine so you know if something is going to go off the rails before the automated build action on GitHub.
- [ ] Update the GHCR image tag in `compose.prod.yml` to the imminent release version
- [ ] Bump the `"version"` number in `package.json`.
- [ ] Open a PR that merges the release branch into main.
- [ ] Merge the release PR after it passes testing and review.
- [ ] Tag a corresponding release on GitHub. This will trigger an automated Docker image build on GitHub. If the build succeeds it will be automatically published to GHCR.
