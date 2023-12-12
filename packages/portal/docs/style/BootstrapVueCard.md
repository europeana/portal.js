Customised BootstrapVue card component. It is not directly used as in the examples, but forms the base of other card components.

Docs: https://bootstrap-vue.org/docs/components/breadcrumb

Also see:
- [InfoCard](/#/Components/Generic?id=infocard)
- [ItemPreviewCard](/#/Components/Item?id=itempreviewcard)

With top image, header, footer, title, subtitle, text and links
```jsx
import { thumbnails } from '../../../styleguide/images';
  <b-card-group
    class="card-deck-3-cols align-items-start"
    deck
  >
    <b-card
    :img-src="thumbnails[6]"
    title="Card title default to h4"
    style="flex: 0 0 18rem;"
    class="mb-4"
    no-body
    >
      <template #header>
        <h4 class="mb-0">This is a header</h4>
      </template>
      <b-card-body>
        <b-card-text>
          Card text. Besides text it is possible to insert any kind of element: buttons, links, lists etc.
        </b-card-text>
        <a href="#" class="card-link">Card link</a>
        <a href="#" class="card-link">Another link</a>
      </b-card-body>
      <b-card-footer>This is a footer</b-card-footer>
    </b-card>
    <b-card
      :img-src="thumbnails[6]"
      title="Card title default to h4"
      sub-title="Card subtitle default to h6"
      style="flex: 0 0 18rem;"
      class="mb-4"
    >
      <b-card-text>
        Card text. Besides text it is possible to insert any kind of element to the body: buttons, links, lists etc.
      </b-card-text>
    </b-card>
    <b-card
      title="Card without image"
      sub-title="Card subtitle default to h6"
      style="flex: 0 0 18rem;"
      class="mb-4"
    >
      <b-card-text>
        Card text. Besides text it is possible to insert any kind of element to the body: buttons, links, lists etc.
      </b-card-text>
    </b-card>
    <b-card
      :img-src="thumbnails[6]"
      img-bottom
      title="Card with bottom image"
      sub-title="Card subtitle default to h6"
      style="flex: 0 0 18rem;"
      class="mb-4"
    >
      <b-card-text>
        Card text. Besides text it is possible to insert any kind of element to the body: buttons, links, lists etc.
      </b-card-text>
    </b-card>
    <b-card
      :img-src="thumbnails[6]"
      img-left
      title="Card with left image"
      sub-title="Card subtitle default to h6"
      style="flex: 0 0 90%;"
      class="mb-4"
    >
      <b-card-text>
        Card text. Besides text it is possible to insert any kind of element to the body: buttons, links, lists etc.
      </b-card-text>
    </b-card>
    <b-card
      :img-src="thumbnails[6]"
      img-right
      title="Card with right image"
      sub-title="Card subtitle default to h6"
      style="flex: 0 0 90%;"
      class="mb-4"
    >
      <b-card-text>
        Card text. Besides text it is possible to insert any kind of element to the body: buttons, links, lists etc.
      </b-card-text>
    </b-card>
  </b-card-group>
```
