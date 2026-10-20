#!/usr/bin/env python3
"""
Firebase Cloud Messaging (FCM) Push Notification Dispatcher
============================================================
Broadcasts push notifications to mobile devices when a new article
is published or a new PDF document is added to the library.

Triggered automatically during GitHub Actions deployment.
Requires the `FIREBASE_SERVICE_ACCOUNT` GitHub Secret.
"""

import os
import sys
import json
import subprocess
import argparse
from pathlib import Path

def get_changed_files():
    """Detects modified and added files in the latest git push."""
    try:
        # Check files modified in the latest commit
        res = subprocess.run(
            ["git", "diff", "--name-status", "HEAD~1", "HEAD"],
            capture_output=True,
            text=True,
            check=False,
        )
        if res.returncode == 0 and res.stdout.strip():
            changes = []
            for line in res.stdout.strip().splitlines():
                parts = line.strip().split(maxsplit=1)
                if len(parts) == 2:
                    status, path = parts[0], parts[1]
                    changes.append((status, path))
            return changes
    except Exception as e:
        print(f"⚠️ [FCM] Could not inspect git diff: {e}")
    return []

def send_fcm_notification(service_account_info, title, body, data=None, topic="all_users"):
    """Initializes Firebase Admin and sends a message to an FCM topic."""
    try:
        import firebase_admin
        from firebase_admin import credentials, messaging

        if not firebase_admin._apps:
            if isinstance(service_account_info, dict):
                cred = credentials.Certificate(service_account_info)
            else:
                cred = credentials.Certificate(json.loads(service_account_info))
            firebase_admin.initialize_app(cred)

        payload_data = {
            "click_action": "FLUTTER_NOTIFICATION_CLICK",
        }
        if data:
            for k, v in data.items():
                payload_data[str(k)] = str(v)

        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=payload_data,
            topic=topic,
            android=messaging.AndroidConfig(
                priority="high",
                notification=messaging.AndroidNotification(
                    icon="@mipmap/ic_launcher",
                    color="#F43F5E",
                    sound="default",
                ),
            ),
            apns=messaging.APNSConfig(
                payload=messaging.APNSPayload(
                    aps=messaging.Aps(
                        sound="default",
                        badge=1,
                    )
                )
            ),
        )

        response = messaging.send(message)
        print(f"✅ [FCM] Successfully broadcast notification to topic '{topic}': {response}")
        return True
    except Exception as e:
        print(f"❌ [FCM] Failed to send push notification: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Send Firebase push notifications for blog-cms updates")
    parser.add_argument("--title", help="Notification title")
    parser.add_argument("--body", help="Notification body")
    parser.add_argument("--post-id", help="Article ID for deep linking")
    parser.add_argument("--topic", default="all_users", help="FCM topic name")
    parser.add_argument("--auto", action="store_true", help="Auto-detect changes from git diff and manifests")
    args = parser.parse_args()

    service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT")
    if not service_account or not service_account.strip():
        print("ℹ️ [FCM] FIREBASE_SERVICE_ACCOUNT secret not configured. Skipping push notification.")
        sys.exit(0)

    # 1. Manual push from CLI arguments
    if args.title and args.body:
        data = {}
        if args.post_id:
            data["postId"] = args.post_id
        send_fcm_notification(service_account, args.title, args.body, data=data, topic=args.topic)
        return

    # 2. Automatic detection from git diff & manifests
    root_dir = Path(__file__).resolve().parent.parent
    posts_json_path = root_dir / "posts.json"
    library_json_path = root_dir / "library.json"

    changed_files = get_changed_files()
    print(f"🔍 [FCM] Changed files in push: {changed_files}")

    notified = False

    # Check for new or updated articles
    has_post_changes = any(
        path.startswith("posts/") and path.endswith(".md")
        for status, path in changed_files
    ) or not changed_files

    if has_post_changes and posts_json_path.exists():
        try:
            with open(posts_json_path, "r", encoding="utf-8") as f:
                posts = json.load(f)
                if posts and isinstance(posts, list):
                    latest_post = posts[0]
                    title = f"New Article: {latest_post.get('title', 'Untitled')}"
                    body = latest_post.get("summary") or "A new article is now available to read on SLLK."
                    data = {
                        "postId": latest_post.get("id", ""),
                        "type": "article",
                    }
                    print(f"📢 [FCM] Broadcasting new article notification for '{latest_post.get('title')}'...")
                    send_fcm_notification(service_account, title, body, data=data, topic="new_articles")
                    notified = True
        except Exception as e:
            print(f"⚠️ [FCM] Failed to parse posts.json: {e}")

    # Check for new or updated PDF library documents
    has_library_changes = any(
        path.startswith("library/")
        for status, path in changed_files
    )

    if has_library_changes and library_json_path.exists():
        try:
            with open(library_json_path, "r", encoding="utf-8") as f:
                docs = json.load(f)
                if docs and isinstance(docs, list):
                    latest_doc = docs[0]
                    title = "New Document in Puya Library"
                    body = f"Added: {latest_doc.get('title', 'New PDF')}"
                    data = {
                        "type": "library",
                        "docId": latest_doc.get("id", ""),
                    }
                    print(f"📢 [FCM] Broadcasting library notification for '{latest_doc.get('title')}'...")
                    send_fcm_notification(service_account, title, body, data=data, topic="library_updates")
                    notified = True
        except Exception as e:
            print(f"⚠️ [FCM] Failed to parse library.json: {e}")

    if not notified:
        print("ℹ️ [FCM] No new article or library changes detected to notify.")

if __name__ == "__main__":
    main()
