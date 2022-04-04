Customised BootstrapVue badge component. AKA 'pill', 'chip' or 'tag'

Docs: https://bootstrap-vue.org/docs/components/badge

Variant "secondary": regular, pill<br>
*Used as default*
```jsx
  <b-badge>badge</b-badge>
  <b-badge pill>
    pill
  </b-badge>
  <b-badge pill>
    pill
    <button class="close">x</button>
  </b-badge>
  <b-badge
    pill
    href="https://www.europeana.eu"
  >
    pill link
  </b-badge>
  <b-badge
    pill
    href="https://www.europeana.eu"
    class="img-chip"
  >
    <b-img
      src="https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fcc.museon.nl%2Fimageproxy.aspx%3Fserver%3Dlocalhost%26port%3D17512%26filename%3Dimages%2Fscreen2%2F116201a.jpg&type=IMAGE&size=w200"
      rounded="circle"
      class="mr-2"
    />
    pill image link
  </b-badge>
```

Variant "primary":
```jsx
  <b-badge
    variant="primary"
  >
    badge
  </b-badge>
  <b-badge
    variant="primary"
    pill
  >
    pill
  </b-badge>
  <b-badge 
    pill
    variant="primary"
  >
    pill
    <button class="close">x</button>
  </b-badge>
  <b-badge
    variant="primary"
    pill
    href="https://www.europeana.eu"
  >
    pill link
  </b-badge>
  <b-badge
    variant="primary"
    pill
    href="https://www.europeana.eu"
    class="img-chip"
  >
    <b-img
      src="https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fcc.museon.nl%2Fimageproxy.aspx%3Fserver%3Dlocalhost%26port%3D17512%26filename%3Dimages%2Fscreen2%2F116201a.jpg&type=IMAGE&size=w200"
      rounded="circle"
      class="mr-2"
    />
    pill image link
  </b-badge>
```

Variant "primary-light":
```jsx
  <b-badge
    variant="primary-light"
  >
    badge
  </b-badge>
  <b-badge
    variant="primary-light"
    pill
  >
    pill
  </b-badge>
  <b-badge
    class="remove-button"
    pill
    variant="primary-light"
  >
    pill
    <button class="close">x</button>
  </b-badge>
  <b-badge
    variant="primary-light"
    pill
    href="https://www.europeana.eu"
  >
    pill link
  </b-badge>
  <b-badge
    variant="primary-light"
    pill
    href="https://www.europeana.eu"
    class="img-chip"
  >
    <b-img
      src="https://api.europeana.eu/api/v2/thumbnail-by-url.json?uri=http%3A%2F%2Fcc.museon.nl%2Fimageproxy.aspx%3Fserver%3Dlocalhost%26port%3D17512%26filename%3Dimages%2Fscreen2%2F116201a.jpg&type=IMAGE&size=w200"
      rounded="circle"
      class="mr-2"
    />
    pill image link
  </b-badge>
```

Variant "light":
```jsx
  <div style="background-color: #ededed; margin: -16px; padding: 16px;">
    <b-badge
      variant="light"
    >
      badge
    </b-badge>
    <b-badge
      variant="light"
      pill
    >
      pill
    </b-badge>
    <b-badge 
      pill
      variant="light"
    >
    pill
    <button class="close">x</button>
    </b-badge>
    <b-badge
      variant="light"
      pill
      href="https://www.europeana.eu"
    >
      pill link
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
        pill image link
    </b-badge>
  </div>
```

Variant "outline-light":
```jsx
  <b-badge
    variant="outline-light"
  >
  badge
  </b-badge>
  <b-badge
    variant="outline-light"
    pill
  >
    pill
  </b-badge>
```
