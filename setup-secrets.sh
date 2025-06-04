#!/bin/bash

# Set your Google Cloud project ID
PROJECT_ID="your-project-id"

echo "Setting up Google Cloud secrets for Spotify Shop Central..."

# Create secrets in Google Secret Manager
echo "Creating SPOTIFY_CLIENT_ID secret..."
echo -n "your-spotify-client-id" | gcloud secrets create spotify-client-id --data-file=- --project=$PROJECT_ID

echo "Creating SPOTIFY_CLIENT_SECRET secret..."
echo -n "your-spotify-client-secret" | gcloud secrets create spotify-client-secret --data-file=- --project=$PROJECT_ID

echo "Creating OPENROUTER_KEY secret..."
echo -n "your-openrouter-key" | gcloud secrets create openrouter-key --data-file=- --project=$PROJECT_ID

echo "Creating SPOTIFY_REDIRECT_URI secret..."
echo -n "your-spotify-redirect-uri" | gcloud secrets create spotify-redirect-uri --data-file=- --project=$PROJECT_ID

echo "Secrets created successfully!"

echo "Don't forget to grant Cloud Build access to these secrets:"
echo "gcloud projects add-iam-policy-binding $PROJECT_ID \\"
echo "    --member=serviceAccount:$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')@cloudbuild.gserviceaccount.com \\"
echo "    --role=roles/secretmanager.secretAccessor" 