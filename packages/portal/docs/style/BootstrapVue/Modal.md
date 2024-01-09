Customised BootstrapVue modal component.

Docs including more features and variants: https://bootstrap-vue.org/docs/components/modal

Used by:
- ContentWarningModal
- DebugApiRequests
- [DownloadFailedModal](/#/Components/Search?id=downloadfailedmodal)
- DownloadSuccessModal
- [EntityInformationModal](/#/Components/Entity?id=entityheader)
- [EntityUpdateModal](/#/Components/Entity?id=entityheader)
- ErrorModal
- ItemLikeButton (limit reached)
- ItemPinButton (limit reached)
- ItemPinModal
- [ItemTranscribeButton](/#/Components/Item?id=itemtranscribebutton)
- SetAddItemModal
- SetDeleteModal
- SetFormModal
- [SetPublicationRequestWidget](/#/Components/Set?id=setpublishbutton)
- ShareSocialModal

```jsx
<div>
  <b-button v-b-modal.modal-1 class="mb-3 mr-3">Show default modal</b-button>
  <b-button v-b-modal.modal-2 class="mb-3">Show modal without close button and custom footer</b-button>

  <b-modal id="modal-1" title="Modal title">
    <p>This is a paragraph text, but you can put any other element in a modal: buttons, a form etc.</p>
  </b-modal>
    <b-modal
    id="modal-2"
    title="Modal title"
    hide-header-close
    hide-footer
  >
    <p>This is a paragraph text, but you can put any other element in a modal: buttons, a form etc.</p>
    <div class="modal-footer pt-2">
      <b-button
        variant="outline-primary"
        data-qa="close button"
        @click="$bvModal.hide('modal-2')"
      >
        close
      </b-button>
    </div>
  </b-modal>
</div>
```
