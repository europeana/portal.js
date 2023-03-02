# Adding icons to the icon font

All icons are in an icon font. Icomoon can be used to add new icons.

If you need to add new icons to the font:

- Go to https://icomoon.io/app/#/projects

- If there is already a project called “Europeana”, remove it first

- Click “Import project”

- Select the config file from `src/assets/fonts`

- A project with the name “Europeana” will be shown

- Click “Load” and you will see an overview of the icons currently in the font

To add new icons:

- Either search for icons in the library of free icons, most common icons are in this library

- Or use “Import icons” to load own SVGs

- When ready, press the “generate font” button at the bottom, check if everything is there, and then press “download”

- Copy and paste the .woff from the downloaded Zip into the `src/assets/fonts` folder

- Open the style.css from the Zip and copy the rules for the new icons into `src/assets/scss/icons.scss`

- Click the project “Europeana” on the right in the top bar and click “download” to get the new config file

- Copy and paste this config file into `src/assets/fonts/icomoon-config.json`

# License

The Open Sans fonts are licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).

The Ubuntu fonts are licensed under the [Ubuntu font licence, Version 1.0](https://ubuntu.com/legal/font-licence).
