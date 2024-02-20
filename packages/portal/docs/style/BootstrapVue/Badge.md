Customised BootstrapVue badge component. AKA 'pill', 'chip' or 'tag'.

Docs: https://bootstrap-vue.org/docs/components/badge

Used by:
- LinkBadge
- [RelatedCategoryTags](/#/Components/Related?id=relatedcategorytags)

Variant "secondary": regular, pill<br>
*Used as default*
```jsx
  <b-container>
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
        :src="thumbnails[1]"
        rounded="circle"
        class="mr-2"
      />
      pill image link
    </b-badge>
  </b-container>
```

Variant "primary":
```jsx
  <b-container>
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
        :src="thumbnails[2]"
        rounded="circle"
        class="mr-2"
      />
      pill image link
    </b-badge>
  </b-container>
```

Variant "outline-primary":
```jsx
  <b-container>
    <b-badge
      variant="outline-primary"
    >
      badge
    </b-badge>
    <b-badge
      variant="outline-primary"
      pill
    >
      pill
    </b-badge>
    <b-badge
      pill
      variant="outline-primary"
    >
      pill
      <button class="close">x</button>
    </b-badge>
    <b-badge
      variant="outline-primary"
      pill
      href="https://www.europeana.eu"
    >
      pill link
    </b-badge>
    <b-badge
      variant="outline-primary"
      pill
      href="https://www.europeana.eu"
      class="img-chip"
    >
      <b-img
        :src="thumbnails[3]"
        rounded="circle"
        class="mr-2"
      />
      pill image link
    </b-badge>
  </b-container>
```

Variant "primary-light":
```jsx
  <b-container>
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
        :src="thumbnails[4]"
        rounded="circle"
        class="mr-2"
      />
      pill image link
    </b-badge>
  </b-container>
```

Variant "light":
```jsx
  <b-container>
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
          :src="thumbnails[5]"
          rounded="circle"
          class="mr-2"
        />
          pill image link
      </b-badge>
    </div>
  </b-container>
```

Variant "outline-light":
```jsx
  <b-container>
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
  </b-container>
```
