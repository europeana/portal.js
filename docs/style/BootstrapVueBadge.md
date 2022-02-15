Customised BootstrapVue badge component. AKA 'pill', 'chip' or 'tag'

Docs: https://bootstrap-vue.org/docs/components/badge

Variant "secondary": regular, pill<br>
*Used as default*
```jsx
  <b-badge>label</b-badge>
  <b-badge variant="pill">
  label
  </b-badge>
```

Variant "primary":
```jsx
  <b-badge
    variant="primary"
  >
  label
  </b-badge>
  <b-badge
    variant="primary"
    pill
  >
  label
  </b-badge>
```

Variant "light":
```jsx
  <b-badge
    variant="light"
  >
  label
  </b-badge>
  <b-badge
    variant="light"
    pill
  >
  label
  </b-badge>
  <b-badge
    variant="light"
    pill
    href="https://www.europeana.eu"
  >
  label
  </b-badge>
  <b-badge
    variant="light"
    pill
    href="https://www.europeana.eu"
    class="img-chip"
  >
    <b-img
      src="https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fcc.museon.nl%2Fimageproxy.aspx%3Fserver%3Dlocalhost%26port%3D17512%26filename%3Dimages%2Fscreen2%2F116201a.jpg&type=IMAGE&size=w200"
      rounded="circle"
      class="mr-2"
    />
    label
  </b-badge>
```

Variant "outline-light":
```jsx
  <b-badge
    variant="outline-light"
  >
  label
  </b-badge>
  <b-badge
    variant="outline-light"
    pill
  >
  label
  </b-badge>
```
