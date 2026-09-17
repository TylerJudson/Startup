# notes

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
