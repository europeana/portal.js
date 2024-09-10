Customised BootstrapVue Button component.

Docs: https://bootstrap-vue.org/docs/components/button

Variant "secondary"<br>
_Used as default_

```jsx
<b-container>
  <b-button>label</b-button>
  <b-button class="d-inline-flex align-items-center">
    <span class="icon-pinterest d-inline-flex pr-1" />
    label
  </b-button>
  <b-button class="d-inline-flex align-items-center">
    label
    <span class="icon-pinterest d-inline-flex pl-1" />
  </b-button>
  <b-button
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-pinterest" />
  </b-button>
  <b-button disabled>label</b-button>
</b-container>
```

Variant "outline-primary":

```jsx
<b-container>
  <b-button variant="outline-primary">Label</b-button>
  <b-button variant="outline-primary" class="d-inline-flex align-items-center">
    <span class="icon-pinterest d-inline-flex pr-1" />
    label
  </b-button>
  <b-button variant="outline-primary" class="d-inline-flex align-items-center">
    label
    <span class="icon-pinterest d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="outline-primary"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-pinterest" />
  </b-button>
  <b-button variant="outline-primary" disabled>
    Label
  </b-button>
</b-container>
```

Variant "outline-secondary"<br>
_Used in the themes swiper_

```jsx
<b-button variant="outline-secondary">
  <span>Label</span>
</b-button>
```

Variant "primary":

```jsx
<b-container>
  <b-button variant="primary">label</b-button>
  <b-button variant="primary" class="d-inline-flex align-items-center">
    <span class="icon-pinterest d-inline-flex pr-1" />
    label
  </b-button>
  <b-button variant="primary" class="d-inline-flex align-items-center">
    label
    <span class="icon-pinterest d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="primary"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-pinterest" />
  </b-button>
  <b-button variant="primary" disabled>
    label
  </b-button>
</b-container>
```

Variant "success":

```jsx
<b-container>
  <b-button variant="success">label</b-button>
  <b-button variant="success" class="d-inline-flex align-items-center">
    <span class="icon-pinterest d-inline-flex pr-1" />
    label
  </b-button>
  <b-button variant="success" class="d-inline-flex align-items-center">
    label
    <span class="icon-pinterest d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="success"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-pinterest" />
  </b-button>
  <b-button variant="success" disabled>
    label
  </b-button>
</b-container>
```

Variant "danger":

```jsx
<b-container>
  <b-button variant="danger">label</b-button>
  <b-button variant="danger" class="d-inline-flex align-items-center">
    <span class="icon-pinterest d-inline-flex pr-1" />
    label
  </b-button>
  <b-button variant="danger" class="d-inline-flex align-items-center">
    label
    <span class="icon-pinterest d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="danger"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-pinterest" />
  </b-button>
  <b-button variant="danger" disabled>
    label
  </b-button>
</b-container>
```

Variant "link":

```jsx
<b-container>
  <b-button variant="link">label</b-button>
  <b-button variant="link" class="d-inline-flex align-items-center">
    <span class="icon-pinterest d-inline-flex pr-1" />
    label
  </b-button>
  <b-button variant="link" class="d-inline-flex align-items-center">
    label
    <span class="icon-pinterest d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="link"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-pinterest" />
  </b-button>
  <b-button variant="link" disabled>
    label
  </b-button>
</b-container>
```

Variant "light":

```jsx
<b-container>
  <div style="background-color: #ededed; margin: -16px; padding: 16px;">
    <b-button variant="light">label</b-button>
    <b-button variant="light" class="d-inline-flex align-items-center">
      <span class="icon-pinterest d-inline-flex pr-1" />
      label
    </b-button>
    <b-button variant="light" class="d-inline-flex align-items-center">
      label
      <span class="icon-pinterest d-inline-flex pl-1" />
    </b-button>
    <b-button
      variant="light"
      class="d-inline-flex align-items-center"
      aria-label="label for textless button"
    >
      <span class="icon-pinterest" />
    </b-button>
    <b-button variant="light" disabled>
      label
    </b-button>
  </div>
</b-container>
```

Variant "outline-light"<br>
_Used for the non-list card user buttons_

```jsx
<b-container>
  <b-button variant="outline-light">label</b-button>
  <b-button variant="outline-light" class="d-inline-flex align-items-center">
    <span class="icon-pinterest d-inline-flex pr-1" />
    label
  </b-button>
  <b-button variant="outline-light" class="d-inline-flex align-items-center">
    label
    <span class="icon-pinterest d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="outline-light"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-pinterest" />
  </b-button>
  <b-button variant="outline-light" disabled>
    label
  </b-button>
  <b-button
    class="like-button text-uppercase d-inline-flex align-items-center button-icon-only"
    variant="outline-light"
    aria-label="like item"
  >
    <span class="icon-heart-outlined" />
  </b-button>
</b-container>
```

Variant "light-flat"<br>
_Used for the icon buttons in the header and list card user buttons_

```jsx
<b-container>
  <b-button variant="light-flat">label</b-button>
  <b-button variant="light-flat" class="d-inline-flex align-items-center">
    <span class="icon-pinterest d-inline-flex pr-1" />
    label
  </b-button>
  <b-button variant="light-flat" class="d-inline-flex align-items-center">
    label
    <span class="icon-pinterest d-inline-flex pl-1" />
  </b-button>
  <b-button
    variant="light-flat"
    class="d-inline-flex align-items-center"
    aria-label="label for textless button"
  >
    <span class="icon-pinterest" />
  </b-button>
  <b-button variant="light-flat" disabled>
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
    <span class="icon-heart-outlined" />
    like
  </b-button>
</b-container>
```

Variant "overlay"<br>
_Used in the 'add item to gallery' modal_

```jsx
  <b-container>
    <b-button
      variant="overlay"
      class="p-3 mb-3 mr-3"
    >
      <span>Label overlay button without image</span>
    </b-button>
    <b-button
      variant="overlay"
      :style="`background-image: url(${thumbnails[10]});`"
      class="p-3 mb-3 text-left"
    >
      <span>Label overlay button with image</span>
    </b-button>
  </b-container>
```
