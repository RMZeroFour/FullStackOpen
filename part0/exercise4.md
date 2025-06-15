```mermaid
sequenceDiagram
    participant browser
    participant server

    Note over browser,server: The user types a note into the form and clicks Save.

    browser->>+server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    server-->>-browser: redirect to /notes (302)

    Note over browser,server: The browser redirects to https://studies/cs/helsinki.fi/exampleapp/notes.

    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    server-->>-browser: the HTML file (200)
    
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    server-->>-browser: the CSS file (200)
    
    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    server-->>-browser: the JS file (200)
    
    Note over browser,server: The browser executes the javascript code and fetches all notes.

    browser->>+server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>-browser: notes in JSON format
    
    Note over browser,server: The browser executes the callback and renders the notes.
```

