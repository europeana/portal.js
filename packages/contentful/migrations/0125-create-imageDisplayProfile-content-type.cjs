module.exports = function (migration) {
  const imageDisplayProfile = migration
    .createContentType('imageDisplayProfile')
    .name('Image display profile')
    .description(
      'Settings to alter how an image will be displayed. To be used sparingly, only with design approval that this element is an exception to the standard presentation.'
    )
    .displayField('name');

  imageDisplayProfile
    .createField('name')
    .name('Name')
    .type('Symbol')
    .localized(false)
    .required(true)
    .validations([
      {
        unique: true,
      },
    ])
    .disabled(false)
    .omitted(false);

  imageDisplayProfile
    .createField('fit')
    .name('Fit')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['pad', 'fill', 'scale', 'crop', 'thumb'],
      },
    ])
    .disabled(false)
    .omitted(false);

  imageDisplayProfile
    .createField('sizes')
    .name('Sizes')
    .type('Array')
    .localized(false)
    .required(false)
    .validations([])
    .defaultValue({
      'en-GB': ['small', 'medium', 'large', 'xl', 'xxl', 'xxxl', '4k', 'wqhd'],
    })
    .disabled(false)
    .omitted(false)
    .items({
      type: 'Symbol',

      validations: [
        {
          in: ['small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'wqhd', '4k'],
        },
      ],
    });

  imageDisplayProfile
    .createField('focus')
    .name('Focus')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: [
          'center',
          'top',
          'right',
          'left',
          'bottom',
          'top_right',
          'top_left',
          'bottom_right',
          'bottom_left',
        ],
      },
    ])
    .defaultValue({
      'en-GB': 'center',
    })
    .disabled(false)
    .omitted(false);

  imageDisplayProfile
    .createField('quality')
    .name('Quality')
    .type('Integer')
    .localized(false)
    .required(false)
    .validations([
      {
        range: {
          min: 40,
          max: 100,
        },
      },
    ])
    .disabled(false)
    .omitted(false);

  imageDisplayProfile
    .createField('overlay')
    .name('Overlay')
    .type('Boolean')
    .localized(false)
    .required(true)
    .validations([])
    .defaultValue({
      'en-GB': true,
    })
    .disabled(false)
    .omitted(false);

  imageDisplayProfile
    .createField('crop')
    .name('Crop')
    .type('Boolean')
    .localized(false)
    .required(true)
    .validations([])
    .defaultValue({
      'en-GB': true,
    })
    .disabled(false)
    .omitted(false);

  imageDisplayProfile
    .createField('background')
    .name('Background')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([
      {
        in: ['default', 'alternate', 'highlight'],
      },
    ])
    .defaultValue({
      'en-GB': 'default',
    })
    .disabled(false)
    .omitted(false);

  imageDisplayProfile.changeFieldControl('name', 'builtin', 'singleLine', {});

  imageDisplayProfile.changeFieldControl('fit', 'builtin', 'dropdown', {
    helpText:
      'How to resize the image to fit the dimensions requested for the current breakpoint.',
  });

  imageDisplayProfile.changeFieldControl('sizes', 'builtin', 'checkbox', {
    helpText: 'Breakpoints for which the image will be shown.',
  });

  imageDisplayProfile.changeFieldControl('focus', 'builtin', 'dropdown', {
    helpText: 'When the image is cropped, where to set the focus.',
  });

  imageDisplayProfile.changeFieldControl('quality', 'builtin', 'numberEditor', {
    helpText: 'Quality at which to render the image. Defaults: WebP 40; JPEG 80.',
  });

  imageDisplayProfile.changeFieldControl('overlay', 'builtin', 'boolean', {
    helpText: 'Permit the presentation to overlay the image.',
    trueLabel: 'Yes',
    falseLabel: 'No',
  });

  imageDisplayProfile.changeFieldControl('crop', 'builtin', 'boolean', {
    helpText: 'Permit the presentation to crop the image.',
    trueLabel: 'Yes',
    falseLabel: 'No',
  });

  imageDisplayProfile.changeFieldControl('background', 'builtin', 'dropdown', {
    helpText:
      'Select a background colour variant if contrast with the default is needed.',
  });
};
