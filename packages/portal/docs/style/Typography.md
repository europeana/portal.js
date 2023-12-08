More info about font styles and examples where they are applied can be found on the [Typography page on Figma](https://www.figma.com/file/TQHeWavFSkWCWGMntlthcJ/Component-Library?type=design&node-id=2330%3A6894&mode=design&t=7ZfmXiyHHKs1NQqO-1) and the [Font styles page in Confluence](https://europeana.atlassian.net/wiki/spaces/EC/pages/2279047169/Font+styles)
```jsx
  <table>
    <thead>
      <tr>
        <th scope="col">Style</th>
        <th scope="col">Font</th>
        <th scope="col">Size</th>
        <th scope="col">Weight</th>
        <th scope="col">Case</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><h1 style="{
          font-size: 2.875rem;
          font-weight: 700;
        }">Title 1</h1></td>
        <td><code>Ubuntu</code></td>
        <td><code>2.875rem (46px)</code></td>
        <td><code>700 (bold)</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><h1>Title 2</h1></td>
        <td><code>Ubuntu</code></td>
        <td><code>2.125rem (34px)</code></td>
        <td><code>500 (semibold)</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><h2 class="font-ubuntu mb-0"
        style="font-size: 1.75rem;">Title 3</h2></td>
        <td><code>Ubuntu</code></td>
        <td><code>1.75rem (28px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><h2 class="font-large font-ubuntu mb-0">Title 4</h2></td>
        <td><code>Ubuntu</code></td>
        <td><code>1.5rem (24px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><h2 class="font-medium font-ubuntu mb-0">Title 5</h2></td>
        <td><code>Ubuntu</code></td>
        <td><code>1.25rem (20px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><h2 class="font-xxl mb-0">Subtitle 1</h2></td>
        <td><code>Open Sans</code></td>
        <td><code>2.375rem (38px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><h2 class="font-xl mb-0">Subtitle 2</h2></td>
        <td><code>Open Sans</code></td>
        <td><code>2.125rem (34px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><h2 class="font-large mb-0">Subtitle 3</h2></td>
        <td><code>Open Sans</code></td>
        <td><code>1.5rem (24px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><h2 class="font-medium mb-0">Subtitle 4</h2></td>
        <td><code>Open Sans</code></td>
        <td><code>1.25rem (20px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr class="text-page">
        <td><p class="lead mb-0">Lead paragraph</p></td>
        <td><code>Open Sans</code></td>
        <td><code>1.5rem (24px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><p class="mb-0" style="font-size: 1.125rem;">Body large</p></td>
        <td><code>Open Sans</code></td>
        <td><code>1.125rem (18px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><p class="font-base mb-0">Body regular</p></td>
        <td><code>Open Sans</code></td>
        <td><code>1rem (16px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><span class="font-small font-weight-semibold text-uppercase"
        style="font-size: 1.75rem;">Navigation / pagination</span></td>
        <td><code>Open Sans</code></td>
        <td><code>0.875rem (14px)</code></td>
        <td><code>600</code></td>
        <td><code>uppercase</code></td>
      </tr>
      <tr>
        <td><span class="context-label font-small">Label 1</span></td>
        <td><code>Open Sans</code></td>
        <td><code>0.875rem (14px)</code></td>
        <td><code>600</code></td>
        <td><code>uppercase</code></td>
      </tr>
      <tr>
        <td><span class="context-label">Label 2</span></td>
        <td><code>Open Sans</code></td>
        <td><code>0.75rem (12px)</code></td>
        <td><code>600</code></td>
        <td><code>uppercase</code></td>
      </tr>
      <tr>
        <td><span class="font-small">Component text 1</span></td>
        <td><code>Open Sans</code></td>
        <td><code>0.875rem (14px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><span class="font-small font-weight-semibold">Component text 1 semibold</span></td>
        <td><code>Open Sans</code></td>
        <td><code>0.875rem (14px)</code></td>
        <td><code>600</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><span class="font-extra-small">Component text 2</span></td>
        <td><code>Open Sans</code></td>
        <td><code>0.75rem (12px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
      <tr>
        <td><span class="font-smallest">Disclaimer</span></td>
        <td><code>Open Sans</code></td>
        <td><code>0.625rem (10px)</code></td>
        <td><code>400</code></td>
        <td><code>normal</code></td>
      </tr>
    </tbody>
  </table>
```
