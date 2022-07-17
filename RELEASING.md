# Releasing

This package is released automatically using
[semantic-release](https://github.com/semantic-release/semantic-release).

### Workflow:

- Commit all changes to the `dev` branch

- When ready to release, merge `dev` into `main` and push:

  ```
  git checkout main
  git merge dev
  git push origin main
  ```

- A new commit will be automatically added to `main` during the release, so pull
  that change into local `main`:

  ```
  git pull origin main
  ```

- Change to `dev`, make sure you are in sync with the remote, merge `main` into
  `dev` to pick up the automatically generated commit, then push:

  ```
  git checkout dev
  git pull origin dev
  git merge main
  git push origin dev
  ```
