export default function ({ route, redirect }) {
  // Contentful uses '/' as a slug for the home page, and iterpolates
  // the slug into the preview url. This handles that case.
  if (route.path === '//') {
    return redirect(route.fullPath.slice(1));
  }
}
