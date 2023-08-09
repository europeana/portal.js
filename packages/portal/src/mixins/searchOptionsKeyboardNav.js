export default {
  watch: {
    showSearchOptions(newVal) {
      if (newVal === true) {
        this.$refs.searchdropdown.addEventListener('focusout', this.handleFocusOut);
      } else {
        this.$refs.searchdropdown.removeEventListener('focusout', this.handleFocusOut);
      }
    }
  },

  methods: {
    handleKeyDown(event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.navigateWithArrowKeys(event);
      }
      if (event.key === 'Escape') {
        this.handleHide();
      }
    },

    handleFocusOut(event) {
      const relatedTargetOutsideSearchDropdown = this.checkIfRelatedTargetOutsideSearchDropdown(event);
      if (relatedTargetOutsideSearchDropdown) {
        this.showSearchOptions = false;
      }
    },

    checkIfRelatedTargetOutsideSearchDropdown(event) {
      return event.relatedTarget?.id !== 'show-search-button' && this.$refs.searchdropdown && !this.$refs.searchdropdown.contains(event.relatedTarget);
    },

    navigateWithArrowKeys(event) {
      const searchQueryOptionsComponentOptions = this.$refs.searchoptions?.$refs.options || [];
      const quickSearchComponentOptions = this.$refs.quicksearch?.$children[0].$refs.options || [];
      const searchDropdownOptions = searchQueryOptionsComponentOptions.concat(quickSearchComponentOptions);
      const activeOption = searchDropdownOptions.map(option => option.$el || option).indexOf(event.target);

      if (searchDropdownOptions.length) {
        if (activeOption === -1) {
          this.getElement(searchDropdownOptions[0]).focus();
        }
        if (event.key === 'ArrowDown' && activeOption < searchDropdownOptions.length - 1) {
          this.getElement(searchDropdownOptions[activeOption + 1]).focus();
        }
        if (event.key === 'ArrowUp' && activeOption > 0) {
          this.getElement(searchDropdownOptions[activeOption - 1]).focus();
        }
      }
    },

    handleHide() {
      this.blurInput();
      this.showSearchOptions = false;
      if (this.hidableForm) {
        this.showForm = false;
      }
      this.$emit('hide');
    },

    getElement(element) {
      return element.$el || element;
    },

    blurInput() {
      if (this.$refs.searchinput.$el) {
        this.$refs.searchinput.$el.blur();
      }
    }
  }
};
