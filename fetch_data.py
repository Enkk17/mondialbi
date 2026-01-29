#!/usr/bin/env python3
"""
Fetch data from Airtable API and save to data.json
"""
import os
import json
import requests
import sys


def fetch_airtable_data():
    """Fetch all records from the Collection table in Airtable."""
    # Get the Airtable token from environment variable
    airtable_token = os.environ.get('AIRTABLE_TOKEN')
    if not airtable_token:
        print("Error: AIRTABLE_TOKEN environment variable is not set", file=sys.stderr)
        sys.exit(1)
    
    # Get additional configuration from environment variables with defaults
    # Base ID format: INSERT_YOUR_BASE_ID_HERE (replace with your actual Airtable base ID)
    base_id = os.environ.get('AIRTABLE_BASE_ID')
    if not base_id:
        print("Error: AIRTABLE_BASE_ID environment variable is not set", file=sys.stderr)
        print("Set it to your Airtable base ID (e.g., appXXXXXXXXXXXXXX)", file=sys.stderr)
        sys.exit(1)
    
    table_name = os.environ.get('AIRTABLE_TABLE_NAME', 'Collection')
    
    # Airtable API endpoint
    url = f"https://api.airtable.com/v0/{base_id}/{table_name}"
    
    # Headers for authentication
    headers = {
        "Authorization": f"Bearer {airtable_token}",
        "Content-Type": "application/json"
    }
    
    # Fetch all records (handle pagination)
    all_records = []
    offset = None
    
    print(f"Fetching records from Airtable table: {table_name}")
    
    while True:
        # Add offset parameter if available
        params = {"offset": offset} if offset else {}
        
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            
            data = response.json()
            records = data.get('records', [])
            all_records.extend(records)
            
            print(f"Fetched {len(records)} records (total: {len(all_records)})")
            
            # Check if there are more pages
            offset = data.get('offset')
            if not offset:
                break
                
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from Airtable: {e}", file=sys.stderr)
            sys.exit(1)
    
    print(f"Successfully fetched {len(all_records)} total records")
    return all_records


def save_to_json(data, filename='data.json'):
    """Save data to a JSON file."""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Data saved to {filename}")
    except IOError as e:
        print(f"Error saving data to file: {e}", file=sys.stderr)
        sys.exit(1)


def main():
    """Main function to fetch data and save to JSON."""
    print("Starting Airtable data fetch...")
    
    # Fetch data from Airtable
    records = fetch_airtable_data()
    
    # Save to JSON file
    save_to_json(records)
    
    print("Airtable sync completed successfully!")


if __name__ == "__main__":
    main()
