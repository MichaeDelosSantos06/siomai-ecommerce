# Avoid Error 404 when reloading epecific page after deployment

- make vercel.json file on root folder then add: 


{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}