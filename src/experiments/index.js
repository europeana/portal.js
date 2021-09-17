// This file exports the experiment configuration for A/B tests.
// An experiment needs a name and variants (an object with title and weight keys) defined here.
// Example:
// { name: 'exampleExperiment', variants: [{ title: 'original',
// weight: 5 },
// { title: 'variant1',
//   weight: 30 },
// { title: 'variant2',
//   weight: 65 }]}
//
// You can add multiple experiments in the array here. Be aware that
// they may impact each other and it is generally not recommended to run too
// many at once unless they are only applied to specific pages.
//
// After a user allows experiments to run via the cookie settings, variants
// are selected randomly according to the set weighting.
export default [];
