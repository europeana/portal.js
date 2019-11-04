<template>
  <b-dropdown
    text="More filters"
    variant="light"
    no-caret
    class="more-facets position-static"
  >
    <strong
      class="mb-4 d-inline-block"
    >
      Image type
    </strong>
    <ul class="list-unstyled mb-4">
      <li>
        <input
          id="building"
          type="checkbox"
        >
        <label
          for="building"
          class="d-inline-flex align-items-center"
        >
          Building
          <span
            class="reset"
            aria-label="Close"
          >
            x
          </span>
        </label>
      </li>
      <li>
        <input
          id="inscription"
          type="checkbox"
        >
        <label
          for="inscription"
          class="d-inline-flex align-items-center"
        >
          Inscription
          <span
            class="reset"
            aria-label="Close"
          >
            x
          </span>
        </label>
      </li>
      <li>
        <input
          id="sculpture"
          type="checkbox"
        >
        <label
          for="sculpture"
          class="d-inline-flex align-items-center"
        >
          Sculpture
          <span
            class="reset"
            aria-label="Close"
          >
            x
          </span>
        </label>
      </li>
      <li>
        <input
          id="cartoon"
          type="checkbox"
        >
        <label
          for="cartoon"
          class="d-inline-flex align-items-center"
        >
          Cartoon
          <span
            class="reset"
            aria-label="Close"
          >
            x
          </span>
        </label>
      </li>
      <li>
        <input
          id="metalwork"
          type="checkbox"
        >
        <label
          for="metalwork"
          class="d-inline-flex align-items-center"
        >
          Metalwork
          <span
            class="reset"
            aria-label="Close"
          >
            x
          </span>
        </label>
      </li>
    </ul>
    <hr>
    <div
      class="float-right"
      role="group"
    >
      <button
        type="button"
        class="btn btn-link"
      >
        Reset filters
      </button>
      <button
        type="button"
        class="btn btn-link"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-primary"
      >
        Apply
      </button>
    </div>
  </b-dropdown>
</template>
