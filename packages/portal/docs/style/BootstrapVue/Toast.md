Customised BootstrapVue toast component.

Docs including more features: https://bootstrap-vue.org/docs/components/toast

Used by:
- EntityUpdateModal
- ItemPinButton
- ItemPinModal
- NewFeatureNotification
- RecommendationButtons
- SearchInterface
- SetDeleteModal
- SetPublicationRequestWidget
- SetPublishButton

```jsx
  <div class="p-3 bg-secondary progress-bar-striped" style="min-height: 170px;">
    <b-button class="mb-2" variant="primary" @click="$bvToast.show('example-toast')">
      Show toast
    </b-button>
    <b-button class="mb-2" variant="primary" @click="$bvToast.show('example-toast-2')">
      Show white toast with buttons
    </b-button>

    <b-toast
      id="example-toast"
      static
      no-close-button
      solid
      auto-hide-delay="5000"
      toast-class="brand-toast"
    >
      This toast message hides after 5s
    </b-toast>
    <b-toast
      id="example-toast-2"
      static
      no-close-button
      solid
      auto-hide-delay="60000"
      toast-class="brand-toast-white"
    >
    <p>This toast message includes text and buttons. It hides after 60s.</p>
    <div class="d-flex justify-content-between align-items-start">
      <b-button
        class="mr-2"
        variant="outline-primary"
        @click="$bvToast.hide('example-toast-2')"
      >
        Dismiss
      </b-button>
      <b-button
        variant="primary"
        href="/#"
      >
        Link
      </b-button>
    </div>
    </b-toast>
  </div>
```
