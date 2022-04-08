### Button

Customised BootstrapVue Button component.

Docs: https://bootstrap-vue.org/docs/components/button

Variant "secondary"<br>
*Used as default*
```jsx
  <b-button>label</b-button>
  <b-button class="d-inline-flex align-items-center">
    <span class="icon-twitter d-inline-flex pr-1" />
    label
  </b-button>
  <b-button class="d-inline-flex align-items-center">
    label
    <span class="icon-twitter d-inline-flex pl-1" />
  </b-button>
  <b-button 
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-twitter" />
  </b-button>
  <b-button disabled>label</b-button>
```

Variant "outline-primary":
```jsx
  <b-button
    variant="outline-primary"
  >
    Label
  </b-button>
  <b-button
    variant="outline-primary"
    class="d-inline-flex align-items-center"
  >
    <span class="icon-twitter d-inline-flex pr-1" />
    label
  </b-button>
  <b-button
    variant="outline-primary"
    class="d-inline-flex align-items-center"
  >
    label
    <span class="icon-twitter d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="outline-primary"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-twitter" />
  </b-button>
  <b-button
    variant="outline-primary"
    disabled
  >
    Label
  </b-button>
```

Variant "primary":
```jsx
  <b-button variant="primary">
    label
  </b-button>
  <b-button
    variant="primary"
    class="d-inline-flex align-items-center"
  >
    <span class="icon-twitter d-inline-flex pr-1" />
    label
  </b-button>
  <b-button
    variant="primary"
    class="d-inline-flex align-items-center"
  >
    label
    <span class="icon-twitter d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="primary"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-twitter" />
  </b-button>
  <b-button
    variant="primary"
    disabled
  >
    label
  </b-button>
```

Variant "success":
```jsx
  <b-button
    variant="success"
  >
    label
  </b-button>
  <b-button
    variant="success"
    class="d-inline-flex align-items-center"
  >
    <span class="icon-twitter d-inline-flex pr-1" />
    label
  </b-button>
  <b-button
    variant="success"
    class="d-inline-flex align-items-center"
  >
    label
    <span class="icon-twitter d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="success"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-twitter" />
  </b-button>
  <b-button
    variant="success"
    disabled
  >
    label
  </b-button>
```

Variant "danger":
```jsx
  <b-button
    variant="danger"
  >
    label
  </b-button>
    <b-button
    variant="danger"
    class="d-inline-flex align-items-center"
  >
    <span class="icon-twitter d-inline-flex pr-1" />
    label
  </b-button>
  <b-button
    variant="danger"
    class="d-inline-flex align-items-center"
  >
    label
    <span class="icon-twitter d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="danger"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-twitter" />
  </b-button>
  <b-button
    variant="danger"
    disabled
  >
    label
  </b-button>
```

Variant "link":
```jsx
  <b-button
    variant="link"
  >
    label
  </b-button>
    <b-button
    variant="link"
    class="d-inline-flex align-items-center"
  >
    <span class="icon-twitter d-inline-flex pr-1" />
    label
  </b-button>
  <b-button
    variant="link"
    class="d-inline-flex align-items-center"
  >
    label
    <span class="icon-twitter d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="link"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-twitter" />
  </b-button>
  <b-button
    variant="link"
    disabled
  >
    label
  </b-button>
```

Variant "light":
```jsx
  <b-button
    variant="light"
  >
    label
  </b-button>
    <b-button
    variant="light"
    class="d-inline-flex align-items-center"
  >
    <span class="icon-twitter d-inline-flex pr-1" />
    label
  </b-button>
  <b-button
    variant="light"
    class="d-inline-flex align-items-center"
  >
    label
    <span class="icon-twitter d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="light"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-twitter" />
  </b-button>
  <b-button
    variant="light"
    disabled
  >
    label
  </b-button>
```

Variant "outline-light"<br>
*Used for the non-list card user buttons*
```jsx
  <b-button
    variant="outline-light"
  >
    label
  </b-button>
    <b-button
    variant="outline-light"
    class="d-inline-flex align-items-center"
  >
    <span class="icon-twitter d-inline-flex pr-1" />
    label
  </b-button>
  <b-button
    variant="outline-light"
    class="d-inline-flex align-items-center"
  >
    label
    <span class="icon-twitter d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="outline-light"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-twitter" />
  </b-button>
  <b-button
    variant="outline-light"
    disabled
  >
    label
  </b-button>
  <b-button
    class="like-button text-uppercase d-inline-flex align-items-center button-icon-only"
    variant="outline-light"
    aria-label="like item"
  >
    <span class="icon-heart" />
  </b-button>
```

Variant "light-flat"<br>
*Used for the icon buttons in the header and list card user buttons*
```jsx
  <b-button
    variant="light-flat"
  >
    label
  </b-button>
      <b-button
    variant="light-flat"
    class="d-inline-flex align-items-center"
  >
    <span class="icon-twitter d-inline-flex pr-1" />
    label
  </b-button>
  <b-button
    variant="light-flat"
    class="d-inline-flex align-items-center"
  >
    label
    <span class="icon-twitter d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="light-flat"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-twitter" />
  </b-button>
  <b-button
    variant="light-flat"
    disabled
  >
    label
  </b-button>
    <b-button
    variant="light-flat"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-search" />
  </b-button>
  <b-button
    class="like-button text-uppercase d-inline-flex align-items-center "
    variant="light-flat"
  >
    <span class="icon-heart" />
    like
  </b-button>
```

Variant "overlay"<br>
*Used in the 'add item to gallery' modal*
```jsx
  <b-button
    variant="overlay"
  >
    <span>Label</span>
  </b-button>
  <b-button
    variant="overlay"
    style='background-image: url("https://api.europeana.eu/thumbnail/v2/url.json?size=w400&type=IMAGE&uri=https%3A%2F%2Fwww.rijksmuseum.nl%2Fassetimage2.jsp%3Fid%3DSK-C-214");'
    class="w-100 text-left"
  >
    <span>Label: add to gallery</span>
  </b-button>
```
