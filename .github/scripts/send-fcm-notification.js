const fs = require('fs');
const { execSync } = require('child_process');
const admin = require('firebase-admin');

// 1. Initialize Firebase Admin SDK
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('ERROR: FIREBASE_SERVICE_ACCOUNT secret is missing.');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (err) {
  console.error('ERROR: Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:', err.message);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

function getPreviousJson(filePath) {
  try {
    const raw = execSync(`git show HEAD~1:${filePath}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    return JSON.parse(raw);
  } catch (_) {
    return [];
  }
}

function getCurrentJson(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return [];
}

async function run() {
  let notificationsSent = 0;

  // ----------------------------------------------------
  // Check for New Articles in posts.json
  // ----------------------------------------------------
  const currentPosts = getCurrentJson('posts.json');
  const previousPosts = getPreviousJson('posts.json');
  const previousPostIds = new Set(previousPosts.map((p) => String(p.id)));

  // If manual trigger and no diff, or newly added items
  let newPosts = currentPosts.filter((p) => !previousPostIds.has(String(p.id)));
  if (newPosts.length === 0 && process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' && currentPosts.length > 0) {
    newPosts = [currentPosts[0]]; // test with latest post
  }

  for (const post of newPosts) {
    console.log(`Sending notification for new article: "${post.title}" (ID: ${post.id})`);
    try {
      await messaging.send({
        topic: 'new_articles',
        notification: {
          title: `New Article: ${post.title || 'New Read Available'}`,
          body: post.summary || 'Tap to open and read the article.',
        },
        data: {
          type: 'post',
          postId: String(post.id),
          title: String(post.title || ''),
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'default_channel',
            sound: 'default',
          },
        },
      });
      console.log(`Successfully sent notification for post: ${post.title}`);
      notificationsSent++;
    } catch (err) {
      console.error(`Failed to send notification for post ${post.id}:`, err);
    }
  }

  // ----------------------------------------------------
  // Check for New PDFs in library.json
  // ----------------------------------------------------
  const currentLibrary = getCurrentJson('library.json');
  const previousLibrary = getPreviousJson('library.json');
  const previousDocIds = new Set(previousLibrary.map((d) => String(d.id)));

  let newPdfs = currentLibrary.filter((d) => !previousDocIds.has(String(d.id)));
  if (newPdfs.length === 0 && process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' && currentLibrary.length > 0) {
    newPdfs = [currentLibrary[0]]; // test with latest pdf
  }

  for (const doc of newPdfs) {
    console.log(`Sending notification for new PDF: "${doc.title}" (ID: ${doc.id})`);
    try {
      await messaging.send({
        topic: 'library_updates',
        notification: {
          title: `New PDF: ${doc.title || 'New Document Added'}`,
          body: doc.description || 'A new document has been added to the library.',
        },
        data: {
          type: 'pdf',
          pdfId: String(doc.id),
          title: String(doc.title || ''),
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'default_channel',
            sound: 'default',
          },
        },
      });
      console.log(`Successfully sent notification for document: ${doc.title}`);
      notificationsSent++;
    } catch (err) {
      console.error(`Failed to send notification for doc ${doc.id}:`, err);
    }
  }

  if (notificationsSent === 0) {
    console.log('No new articles or PDFs detected in this commit.');
  } else {
    console.log(`Total notifications sent: ${notificationsSent}`);
  }
}

run();
