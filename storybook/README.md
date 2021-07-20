# STORYBOOK

This directory contains Storybook stories for the project's Vues.

**WARNING:** maintenance of the Storybook stories has been neglected, Storybook
itself was at an out-dated version, and has now been removed from the package
as it is a sizeable dependency. If re-added, stories may not work, and use of
Storybook at all may be abandoned in future.

For reference, package versions previously installed as `devDependencies`:
```json
{
  "@storybook/addon-actions": "^5.3.18",
  "@storybook/addon-links": "^5.3.18",
  "@storybook/vue": "^5.3.18",
  "storybook-vue-router": "^1.0.7"
}
```

And scripts:
```json
{
  "build-storybook": "build-storybook -s ./.storybook/assets",
  "storybook": "start-storybook -p 6006 -s ./.storybook/assets"
}
```

The GitHub Actions workflow to build Storybook and deploy to Cloud Foundry has
been moved from .github/workflows to this directory, disabling it.
