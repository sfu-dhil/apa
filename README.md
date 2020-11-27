Video Slap Chop
===============

Requirements
------------

 * jq (`brew install jq` should do)
 * csv2json (`npm install -g csv2json`)
 * sponge (`brew install moreutils`)
 * PHP
 * Yarn and friends

1. Start with a CSV file like `foo.csv`

```
Video,Section,Title,Start,End,URL,Description,Image
"Imprint II, Camera A",,Colour Bars,00:00:00,00:00:29,https://example.com/foo.mp4,,
,,The Audience,00:00:30,00:02:24,,,
,,Forgotten Memories,00:02:24,00:09:00,,,
,,The Stranger,00:09:01,00:11:56,,,
```

2. Convert it to JSON

`csvtojson $csv | jq '.' | sponge $json`

3. Download the video 

`curl https://example.com/foo.mp4 -o foo.mp4`

4. Extract clip preview images

`./screens foo.json foo.mp4`

5. Reprocess the JSON file to include the clip images.

`php ./preprocess.php foo.json public/screenshot | js '.' | sponge foo.json`
