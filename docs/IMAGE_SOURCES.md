# Equipment image guide

Equipment images are stored in Cloudinary when the upload feature is configured. The Equipment form supports either:

1. selecting a local JPG, PNG or WebP image (maximum 5 MB) and uploading it to Cloudinary; or
2. pasting a public HTTPS image URL into the Image URL field.

## Places to find suitable agricultural photographs

Use photographs you own, have permission to use, or whose license allows the intended use. Download the image or copy the direct image URL provided by the source; a search-results page URL is not a direct image URL.

- [Unsplash — tractors](https://unsplash.com/s/photos/tractor)
- [Unsplash — farm machinery](https://unsplash.com/s/photos/farm-machinery)
- [Pexels — tractor photos](https://www.pexels.com/search/tractor/)
- [Pexels — agriculture machinery](https://www.pexels.com/search/agriculture%20machinery/)
- [Wikimedia Commons — agricultural machinery](https://commons.wikimedia.org/wiki/Category:Agricultural_machinery)

Always check the individual image's license and attribution requirements. Do not hotlink images if the source forbids it. For a stable project demo, upload chosen images to your own Cloudinary account.

## Cloudinary configuration

Create a free Cloudinary account at [cloudinary.com](https://cloudinary.com/). Open the dashboard and copy the Cloud name, API Key and API Secret into the root `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Restart the backend after updating `.env`. The app stores the secure image URL and Cloudinary public ID in the `equipment` document. Do not expose the API secret in React or in a `VITE_` variable.
