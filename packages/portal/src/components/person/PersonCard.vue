
<template>
  <div class="person-card text-center position-relative">
    <ImageOptimised
      v-if="!imageError && image?.url"
      :src="image?.url"
      :width="image?.width"
      :height="image?.height"
      :content-type="image?.contentType"
      :contentful-image-crop-presets="contentfulImageCropPresets"
      :picture-source-media-resolutions="[1, 2]"
      :lazy="lazy"
      class="person-image"
      @error="imageNotFound"
    />
    <span
      v-else
      class="icon-person-placeholder person-fallback-image mx-auto"
    />
    <div
      v-if="email || linkedIn"
      class="buttons-overlay position-absolute w-100 mx-auto"
    >
      <SmartLink
        v-if="email"
        v-b-tooltip.top="emailLabel"
        class="btn btn-light-flat email-btn"
        :destination="`mailto:${email}`"
        :hide-external-icon="true"
        :aria-label="emailLabel"
      >
        <span
          class="icon-email d-inline-flex align-items-center justify-content-center"
        />
      </SmartLink>
      <SmartLink
        v-if="linkedIn"
        v-b-tooltip.top="linkedInLabel"
        class="btn btn-light-flat linkedin-btn"
        :destination="linkedIn"
        :hide-external-icon="true"
        :aria-label="linkedInLabel"
      >
        <span
          class="icon-linkedin-circle d-inline-flex align-items-center justify-content-center"
        />
      </SmartLink>
    </div>
    <p
      v-if="name"
      class="person-name mb-1"
    >
      {{ name }}
    </p>
    <p
      v-if="role"
      class="person-role mb-0"
    >
      {{ role }}
    </p>
  </div>
</template>

<script>
  import SmartLink from '@/components/generic/SmartLink';
  import ImageOptimised from '@/components/image/ImageOptimised';

  export default {
    components: {
      SmartLink,
      ImageOptimised
    },

    props: {
      /**
       * Image object
       * Expected props: url, width, height, contentType
       */
      image: {
        type: Object,
        default: null
      },
      /**
       * Name of the person
       */
      name: {
        type: String,
        default: null
      },
      /**
       * Role of the person
       */
      role: {
        type: String,
        default: null
      },
      /**
       * Email of the person
       */
      email: {
        type: String,
        default: null
      },
      /**
       * LinkedIn profile of the person
       */
      linkedIn: {
        type: String,
        default: null
      },
      /**
       * If `true`, image will be lazy-loaded
       */
      lazy: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        contentfulImageCropPresets: {
          small: { w: 120, h: 120, fit: 'fill', f: 'face', r: 100 }
        },
        imageError: false,
        emailLabel: this.$t('actions.email'),
        linkedInLabel: this.$t('actions.linkedIn')
      };
    },

    methods: {
      imageNotFound() {
        this.imageError = true;
      }
    }
  };
</script>

<style lang="scss" scoped>
@import '@europeana/style/scss/variables';

.person-card {
  --bp-4k-increment: 1.5;

  width: 10.25rem;

  @media (min-width: $bp-medium) {
    width: 14.375rem;
  }

  @media (min-width: $bp-4k) {
    width: calc(var(--bp-4k-increment) * 14.375rem);
  }
}

.person-name {
  font-weight: 600;
  font-size: $font-size-base;

  @media (min-width: $bp-4k) {
    font-size: calc(var(--bp-4k-increment) * $font-size-base);
  }
}

.person-role {
  color: $darkgrey;
  font-size: $font-size-small;
  text-transform: uppercase;

  @media (min-width: $bp-4k) {
    font-size: calc(var(--bp-4k-increment) * $font-size-small);
  }
}

.person-image {
  ::v-deep img {
    width: 7.5rem;
    height: 7.5rem;
    margin-bottom: 0.875rem;

    @media (min-width: $bp-4k) {
      width: calc(var(--bp-4k-increment) * 7.5rem);
      height: calc(var(--bp-4k-increment) * 7.5rem);
      margin-bottom: calc(var(--bp-4k-increment) * 0.875rem);
    }
  }
}

.buttons-overlay {
  top: 6.5rem;

  @media (min-width: $bp-4k) {
    top: calc(var(--bp-4k-increment) * 6.5rem);
  }

  .btn {
    background-color: transparent;
    line-height: 1rem;

    @media (min-width: $bp-4k) {
      line-height: calc(var(--bp-4k-increment) * 1rem);
    }

    span {
      background-color: $white;
      line-height: 1rem;

      @media (min-width: $bp-4k) {
        line-height: calc(var(--bp-4k-increment) * 1rem);
      }
    }

    &.email-btn {
      font-size: 1.125rem;
      padding: 0.125rem;

      @media (min-width: $bp-4k) {
        font-size: calc(var(--bp-4k-increment) * 1.125rem);
        padding: calc(var(--bp-4k-increment) * 0.125rem);
      }

      span {
        border-radius: $border-radius-small;
        width: 1.125rem;
        height: 1rem;

        @media (min-width: $bp-4k) {
          border-radius: calc(var(--bp-4k-increment) * $border-radius-small);
          width: calc(var(--bp-4k-increment) * 1.125rem);
          height: calc(var(--bp-4k-increment) * 1rem);
        }
      }
    }

    &.linkedin-btn {
      font-size: 1.25rem;
      padding: 0.0625rem;

      @media (min-width: $bp-4k) {
        font-size: calc(var(--bp-4k-increment) * 1.25rem);
        padding: calc(var(--bp-4k-increment) * 0.0625rem);
      }

      span {
        border-radius: 50%;
        width: 1.25rem;
        height: 1.25rem;

        @media (min-width: $bp-4k) {
          width: calc(var(--bp-4k-increment) * 1.25rem);
          height: calc(var(--bp-4k-increment) * 1.25rem);
        }
      }
    }
  }
}

.person-fallback-image {
  background: $darkgrey-light;
  color: $middlegrey;
  display: block;
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 50%;
  font-size: 5.5rem;
  align-content: center;
  margin-bottom: 0.875rem;

  @media (min-width: $bp-4k) {
    font-size: calc(var(--bp-4k-increment) * 5.5rem);
  }
}
</style>

<docs lang="md">
```jsx
  <PersonCard
    :image="person[0].image"
    name="Frida Kahlo"
    role="painter"
  />
```

With buttons
```jsx
  <PersonCard
    :image="person[0].image"
    name="Frida Kahlo"
    role="painter"
    email="frida@example.org"
    linked-in="https://www.linkedin.com/frida"
  />
```

With email button
```jsx
  <PersonCard
    :image="person[0].image"
    name="Frida Kahlo"
    role="painter"
    email="frida@example.org"
  />
```

With fallback image
```jsx
  <PersonCard
    name="Frida Kahlo"
    role="painter"

  />
```

With fallback image and buttons
```jsx
  <PersonCard
    name="Frida Kahlo"
    role="painter"
    email="frida@example.org"
    linked-in="https://www.linkedin.com/frida"
  />
```
</docs>
