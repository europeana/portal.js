export default function({ route, redirect }) {
  // In Contentful we use '/' as a convention for the slug for the home page.
  // The Contentful preview functionality for browse pages then interpolates the slug into the preview url.
  // Leading to 2 forward slashes in the preview URL [domain]//?mode=preview.
  // This handles that case by simply redirecting to [domain]/?mode=preview.
  if (route.path === '//') {
    return redirect(route.fullPath.slice(1));
  }
}
