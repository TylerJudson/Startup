# notes

## I love web programming

## html deliverable

- bad img src fails SILENTLY. no error no console nothing, just the broken icon.
  i had image/ instead of images/. only way to catch it is actually loading the page
- forgot the /> on an img and it ate the span under it. browser keeps reading
  attrs til it hits a >. "4/4 votes" just vanished off the page
- void els = img input hr link br meta. never a closing tag
- safari wont show a favicon over file://. thought mine was broken, it was fine. need
  real http (live server) or just wait and check after deploy
- placeholder is NOT a label. it disappears the second you type + screen reader doesnt
  read it as the field name. label for=x + input id=x name=x, the for has to
  match the id
- menu + li for the nav, not a div full of links. thead/tbody so the header row is
  actually marked as one
- no apostrophes or spaces in filenames. had cubby's.avif -> kills src='...', quote
  closes early
- png for photos = 1mb. same photo as jpg = 150kb, looks the same. png only worth it for
  the logo (flat colors + transparency)
- relative paths. images/logo.png NOT /images/logo.png. deploy copies the whole
  folder so absolute can break
- deployFiles.sh = getopts -k key -h host -s service, then over ssh it rm -rf's
  services/SERVICE/public, mkdirs it again, scp -r's everything in the current dir into
  it. it WIPES, doesnt merge. run from the project dir. commit before you deploy or
  live wont match the repo
- commits are graded on this one. rubric says dozens across multiple days + can reject
  the submission. commit each change instead of batching. stage the image in the SAME
  commit as the page that uses it

- bootstrap table-responsive wrapper = table scrolls inside its own box instead of making the whole page wide

- vite layout: index.html at root w/ just div id=root + script index.jsx. images go in public/ (served as is so /images/logo.png). code + css in src/

## react p2
- useState = value + setter, setting it re-renders. controlled input = value={x} onChange={e => setX(e.target.value)}
- useEffect(fn, []) runs once on load. return a function to clean up (clearInterval) or the timer keeps going after you leave the page
- useEffect(fn, [a, b]) reruns when a or b change. used it to jump to results when everyone is done
- setInterval inside useEffect = fake websocket for now
- setX(old => ...) when the new value depends on the old one, inside a timer the normal value is stale
- localStorage only holds strings so JSON.stringify / JSON.parse for arrays
- useNavigate() to change pages from code instead of a link
- {cond && <x/>} and {cond ? <a/> : <b/>} for showing stuff conditionally. list.map needs a key
