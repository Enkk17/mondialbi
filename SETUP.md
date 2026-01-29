# MondialBi - Airtable Integration Setup

This guide explains how to set up automated data synchronization between Airtable and your GitHub Pages site.

## Prerequisites

- An Airtable account with a base containing a 'Collection' table
- A GitHub repository with GitHub Pages enabled
- GitHub repository secrets configured

## Setup Instructions

### 1. Airtable Configuration

1. Create an Airtable base for your book collection
2. Create a table named `Collection` with the following fields:
   - `Title` (Single line text) - Book title
   - `Author` (Single line text) - Author name
   - `Translator` (Single line text, optional) - Translator name
   - `Illustrator` (Single line text, optional) - Illustrator name
   - `Publisher` (Single line text) - Publisher name
   - `Year` (Number) - Publication year
   - `Rating` (Number) - Rating (0-5)
   - `CoverImage` (URL) - Cover image URL
   - `Tags` (Multiple select) - Book tags/categories
   - `Description` (Long text) - Short description
   - `Full Description` (Long text) - Full description
   - `AmazonLink` (URL) - Amazon purchase link
   - `FeltrinelliLink` (URL) - Feltrinelli purchase link
   - `MondadoriLink` (URL) - Mondadori purchase link

3. Get your Airtable API token:
   - Go to https://airtable.com/create/tokens
   - Create a new personal access token
   - Give it access to your base with `data.records:read` scope
   - Copy the token

4. Get your Base ID:
   - Go to https://airtable.com/api
   - Select your base
   - The Base ID is shown in the URL and documentation (format: `appXXXXXXXXXXXXXX`)

### 2. GitHub Repository Secrets

Add the following secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Add the following repository secrets:
   - `AIRTABLE_TOKEN`: Your Airtable personal access token
   - `AIRTABLE_BASE_ID`: Your Airtable base ID (e.g., `appXXXXXXXXXXXXXX`)

Optional: Add a repository variable:
   - `AIRTABLE_TABLE_NAME`: Set to `Collection` (or your custom table name)

### 3. How It Works

#### Automated Sync
The GitHub Actions workflow (`.github/workflows/sync.yml`) automatically:
- Runs daily at midnight (UTC)
- Runs on every push to the `main` branch
- Fetches all records from your Airtable 'Collection' table
- Saves them to `data.json`
- Commits and pushes the updated file back to the repository

#### Frontend Integration
The website (`index.html`) loads data from `data.json`:
- On page load, it fetches the local `data.json` file
- If the file is unavailable, it falls back to cached data or defaults
- Data is cached in localStorage for offline access

#### Manual Trigger
You can manually trigger the sync workflow:
1. Go to **Actions** tab in your repository
2. Select the **Sync Airtable Data** workflow
3. Click **Run workflow**

### 4. Testing Locally

To test the Python script locally:

```bash
# Install dependencies
pip install requests

# Set environment variables
export AIRTABLE_TOKEN="your_token_here"
export AIRTABLE_BASE_ID="appXXXXXXXXXXXXXX"
export AIRTABLE_TABLE_NAME="Collection"  # Optional, defaults to Collection

# Run the script
python fetch_data.py
```

This will create a `data.json` file with your Airtable records.

### 5. Viewing Your Site

Once the workflow runs successfully:
1. The `data.json` file will be updated in your repository
2. GitHub Pages will automatically rebuild your site
3. Visit your GitHub Pages URL to see the updated collection

## File Structure

```
mondialbi/
├── .github/
│   └── workflows/
│       └── sync.yml          # GitHub Actions workflow
├── fetch_data.py             # Python script to fetch Airtable data
├── data.json                 # Generated data file (auto-updated)
├── index.html                # Main website
├── script.js                 # Frontend JavaScript
├── styles.css                # Main styles
├── admin.html                # Admin panel
├── admin.js                  # Admin JavaScript
└── admin.css                 # Admin styles
```

## Security Notes

- ✅ API tokens are stored as GitHub secrets (never in code)
- ✅ The workflow only has write access to the repository content
- ✅ Tokens are never exposed in logs or commits
- ✅ The frontend never makes direct API calls to Airtable

## Troubleshooting

### Workflow fails with "AIRTABLE_TOKEN not set"
- Check that you've added the `AIRTABLE_TOKEN` secret in GitHub repository settings
- Ensure the secret name is exactly `AIRTABLE_TOKEN` (case-sensitive)

### Workflow fails with "AIRTABLE_BASE_ID not set"
- Check that you've added the `AIRTABLE_BASE_ID` secret in GitHub repository settings
- Ensure your base ID is correct (format: `appXXXXXXXXXXXXXX`)

### No data appears on the website
- Check that the workflow has run successfully (see Actions tab)
- Verify that `data.json` exists and contains records
- Check browser console for any JavaScript errors
- Clear browser cache and localStorage

### Data.json not updating
- Check the workflow logs in the Actions tab
- Ensure your Airtable token has the correct permissions
- Verify the table name is correct ('Collection' by default)

## Customization

### Change Table Name
To use a different table name, set the `AIRTABLE_TABLE_NAME` repository variable in GitHub.

### Change Sync Schedule
Edit `.github/workflows/sync.yml` and modify the cron expression:
```yaml
schedule:
  - cron: '0 0 * * *'  # Daily at midnight UTC
```

### Add More Fields
Update the `transformAirtableData` function in `script.js` to map additional Airtable fields.

## License

© 2026 MondialBi - All rights reserved
