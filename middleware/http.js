export default async(context) => {
  await context.store.dispatch('http/init', context);
};
