import { storiesOf } from '@storybook/vue';
import VueI18n from 'vue-i18n';

storiesOf('Basics', module)
  .add('typography', () => ({
    i18n: new VueI18n({
      locale: 'en'
    }),
    template:  `<b-container class="mt-3">
        <h1>This is a h1 heading</h1>
        <h2>This is a h2 heading</h2>
        <h3>This is a h3 heading</h3>
        <h4>This is a h4 heading</h4>
        <h5>This is a h5 heading</h5>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam iaculis odio sit amet ligula laoreet semper. Nunc nisl massa, bibendum mattis efficitur id, 
          maximus at massa. In mauris justo, aliquam eu hendrerit vel, accumsan vitae metus. Aliquam et enim leo. Morbi ac lacinia erat. Vivamus sagittis, enim eget 
          molestie sodales, massa lacus luctus sapien, nec tristique enim nunc a nulla. Donec laoreet viverra est, at maximus felis lacinia in. Fusce gravida, purus 
          ac ullamcorper dapibus, dolor lorem viverra neque, et scelerisque elit metus eu urna. Fusce a mi malesuada arcu dignissim condimentum nec eget nisl. Nulla 
          blandit mi eu pulvinar facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis justo eu mauris ornare consectetur. Fusce mollis, 
          mauris facilisis fermentum finibus, felis justo sagittis enim, a ultrices velit mauris nec orci. Phasellus fermentum commodo enim tincidunt tincidunt.
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam iaculis odio sit amet ligula laoreet semper. Nunc nisl massa, bibendum mattis efficitur id, 
          maximus at massa. In mauris justo, aliquam eu hendrerit vel, accumsan vitae metus. Aliquam et enim leo. Morbi ac lacinia erat. Vivamus sagittis, enim eget 
          molestie sodales, massa lacus luctus sapien, nec tristique enim nunc a nulla. Donec laoreet viverra est, at maximus felis lacinia in. Fusce gravida, purus 
          ac ullamcorper dapibus, dolor lorem viverra neque, et scelerisque elit metus eu urna. Fusce a mi malesuada arcu dignissim condimentum nec eget nisl. Nulla 
          blandit mi eu pulvinar facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis justo eu mauris ornare consectetur. Fusce mollis, 
          mauris facilisis fermentum finibus, felis justo sagittis enim, a ultrices velit mauris nec orci. Phasellus fermentum commodo enim tincidunt tincidunt.
        </p>

        <p><small>This is small text</small></p>
        <p><small><strong>This is small and bold text</strong></small></p>

        <p><small class="xs">This is extra small text</small></p>
        <p><small class="xs">This is extra small and bold text</small></p>

        <p><small class="xxs">This is super small text</small></p>

        <ul>
          <li>m nunc a nulla. Donec l</li>
          <li>ec eget nisl. Nulla b</li>
        </ul>

        <h2 class="text-lighter">This is a light h2 heading</h2>
        <p class="text-lighter">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam iaculis odio sit amet ligula laoreet semper. Nunc nisl massa, bibendum mattis efficitur id, 
          maximus at massa. In mauris justo, aliquam eu hendrerit vel, accumsan vitae metus. Aliquam et enim leo. Morbi ac lacinia erat. Vivamus sagittis, enim eget 
          molestie sodales, massa lacus luctus sapien, nec tristique enim nunc a nulla. Donec laoreet viverra est, at maximus felis lacinia in. Fusce gravida, purus 
          ac ullamcorper dapibus, dolor lorem viverra neque, et scelerisque elit metus eu urna. Fusce a mi malesuada arcu dignissim condimentum nec eget nisl. Nulla 
          blandit mi eu pulvinar facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis justo eu mauris ornare consectetur. Fusce mollis, 
          mauris facilisis fermentum finibus, felis justo sagittis enim, a ultrices velit mauris nec orci. Phasellus fermentum commodo enim tincidunt tincidunt.
        </p>

        <h2 class="text-coloured">This is a coloured h2 heading</h2>
        <p class="text-coloured">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam iaculis odio sit amet ligula laoreet semper. Nunc nisl massa, bibendum mattis efficitur id, 
          maximus at massa. In mauris justo, aliquam eu hendrerit vel, accumsan vitae metus. Aliquam et enim leo. Morbi ac lacinia erat. Vivamus sagittis, enim eget 
          molestie sodales, massa lacus luctus sapien, nec tristique enim nunc a nulla. Donec laoreet viverra est, at maximus felis lacinia in. Fusce gravida, purus 
          ac ullamcorper dapibus, dolor lorem viverra neque, et scelerisque elit metus eu urna. Fusce a mi malesuada arcu dignissim condimentum nec eget nisl. Nulla 
          blandit mi eu pulvinar facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis justo eu mauris ornare consectetur. Fusce mollis, 
          mauris facilisis fermentum finibus, felis justo sagittis enim, a ultrices velit mauris nec orci. Phasellus fermentum commodo enim tincidunt tincidunt.
        </p>

      </b-container>`
  }));
