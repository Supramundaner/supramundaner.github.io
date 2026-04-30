# Yuzhuo Ao Homepage

Personal academic homepage served by GitHub Pages:

https://supramundaner.github.io/

## Project Structure

- `index.html`: main page content
- `styles.css`: page styling and responsive layout
- `scripts.js`: interactive behavior
- `publications.json`: publication metadata
- `assets/`: images, CV, paper figures, and favicon files

## Local Deployment

This is a static website, so it can be served locally with Python's built-in HTTP server.

From PowerShell or another command-line shell:

```powershell
cd C:\Users\17876\Desktop\homepage\supramundaner.github.io
python -m http.server 8001 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8001/
```

If `python` is not available but the Python launcher is installed on Windows, use:

```powershell
py -m http.server 8001 --bind 127.0.0.1
```

Press `Ctrl+C` in the terminal to stop the local server.
