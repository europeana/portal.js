Customised BootstrapVue form component including all used form inputs:
checkbox, input, radio, select, tags, textarea.

Docs including more features: https://bootstrap-vue.org/docs/components/form

Other available input fields:
[datepicker](https://bootstrap-vue.org/docs/components/form-datepicker), [file](https://bootstrap-vue.org/docs/components/form-file), [rating](https://bootstrap-vue.org/docs/components/form-rating), [spinbutton](https://bootstrap-vue.org/docs/components/form-spinbutton), [timepicker](https://bootstrap-vue.org/docs/components/form-timepicker)

Used by:

- DownloadSuccessModal
- [EntityUpdateModal](/#/Components/Entity?id=entityheader)
- FeedbackWidget
- ItemEmbedCode
- SearchDateFilter
- [SearchFacetDropdown](/#/Components/Search?id=searchfacetdropdown)
- [SearchForm](/#/Components/Search?id=searchform)
- [SearchQueryBuilder](/#/Components/Search?id=searchquerybuilder)
- SetFormModal
- StoriesTagsDropdown

```jsx
<template>
  <b-form @submit="onSubmit" @reset="onReset" v-if="show">
    <b-form-group
      id="input-group-1"
      label="Email address:"
      label-for="input-1"
    >
      <b-form-input
        id="input-1"
        v-model="form.email"
        type="email"
        placeholder="Placeholder text"
        :state="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)"
        required
      ></b-form-input>
      <b-form-invalid-feedback>
        An invalid feedback message to help fill in the form correctly. It will disappear once a valid value is put in. Can also be configured to only show once attempting to submit the form.
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group id="input-group-2" label="Your Name:" label-for="input-2" description="Description about name field">
      <b-form-input
        id="input-2"
        v-model="form.name"
        placeholder="Enter name"
      ></b-form-input>
    </b-form-group>

    <b-form-group id="input-group-3" label="Food:" label-for="input-3">
      <b-form-select
        id="input-3"
        v-model="form.food"
        :options="foods"
      ></b-form-select>
    </b-form-group>

    <b-form-group id="input-group-4" label="Select one or more checkboxes" v-slot="{ ariaDescribedby }">
      <b-form-checkbox-group
        v-model="form.checked"
        id="checkboxes-4"
        :aria-describedby="ariaDescribedby"
      >
        <b-form-checkbox value="newsletter">Sign up for our newsletter</b-form-checkbox>
        <b-form-checkbox value="agree">Agree to our conditions</b-form-checkbox>
      </b-form-checkbox-group>
    </b-form-group>

    <b-form-group id="input-group-5" label="Select one radio option" v-slot="{ ariaDescribedby }">
      <b-form-radio-group
        v-model="form.selected"
        id="radios-5"
        :aria-describedby="ariaDescribedby"
        :options="radios"
      />
    </b-form-group>

    <b-form-group id="input-group-6" label="Type a new tag and press enter" label-for="input-6">
      <b-form-tags input-id="input-6" v-model="form.tags"></b-form-tags>
    </b-form-group>

    <b-form-group id="input-group-7" label="Textarea for any other comments" label-for="input-7">
      <b-form-textarea
        input-id="input-7"
        :value="form.textarea"
      />
    </b-form-group>

    <b-button type="submit" variant="primary">Submit</b-button>
    <b-button type="reset" variant="danger">Reset</b-button>
  </b-form>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          email: '',
          name: '',
          food: null,
          checked: [],
          selected: null,
          tags: ['Archaeology', 'Art'],
          textarea: null
        },
        foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
        radios: [{ text: 'Select option A', valiue: 'A' }, { text: 'Select option B', valiue: 'B' }, { text: 'Select option C', valiue: 'C' }],
        show: true
      }
    },
    methods: {
      onSubmit(event) {
        event.preventDefault()
        alert(JSON.stringify(this.form))
      },
      onReset(event) {
        event.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.food = null
        this.form.checked = []
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>
```
