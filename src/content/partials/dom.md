---
title: "DOM (Document Object Model)"
category: "Fundamentals"
---

The **DOM** (Document Object Model) is the browser's live representation of a page. When the browser receives HTML, a **parser** reads the tags and builds a **tree** of objects in memory: elements, attributes, and text nodes. That tree is the DOM.

What you see on screen and what JavaScript can touch are both backed by this tree. The initial HTML from the server is only the starting point. Scripts can add, remove, or change nodes afterward.

#### How HTML becomes a tree

Take a small snippet:

```html
<div id="comments">
  <p>Hello</p>
</div>
```

After parsing, the DOM might look like this in plain terms:

- a `div` element with `id="comments"`
  - a `p` element inside it
    - a text node containing `Hello`

JavaScript can walk that tree with APIs like `document.getElementById("comments")` and read or change what is there. In the previous example, to replace the `Hello` text inside the paragraph:

```js
const paragraph = document.querySelector("#comments p")
paragraph.textContent = "Updated from JavaScript"
```

After that runs, the tree in the browser's memory (and the text you see on the page) looks like this:

```html
<div id="comments">
  <p>Updated from JavaScript</p>
</div>
```

You changed the live DOM that the page is showing right now. If you 
reload the page, the browser parses the original HTML again and the 
paragraph goes back to `Hello`.

#### Parsing happens more than once

Parsing is not a one-time event on first page load. Whenever code assigns an **HTML string** to a property like `innerHTML`, the browser runs the parser **again** on that string and creates new nodes from it.

So if a script builds:

```js
element.innerHTML = '<img src="' + userInput + '">'
```

the browser does not treat `userInput` as plain text. It parses the whole string as HTML. A quote or tag character in the wrong place can change which attributes exist on the resulting element.
