---
title: 'Useful Prompts & Commands'
pubDate: '2025-11-26'
---

git fetch
git merge origin/main

is equivalent to

git pull origin main


git fetch
git rebase origin/main

git pull --rebase origin main

rm - for removing

git reset --hard origin/main

category_name:              # Top-level category (snake_case)
  metric_name:              # Individual metric (snake_case)
    type: event             # Type of metric
    description: >          # What it measures (use > for multi-line)
      Your description here
    bugs:                   # Bugzilla links (required)
      - https://bugzilla.mozilla.org/show_bug.cgi?id=YOUR_BUG
    data_reviews:           # Data review links (required)
      - https://bugzilla.mozilla.org/show_bug.cgi?id=YOUR_BUG
    notification_emails:    # Who to notify (required)
      - your-email@mozilla.com
    expires: never          # When it expires (use "never" for permanent)