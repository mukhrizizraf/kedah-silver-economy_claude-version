"""Generate one illustration for this site with the Gemini or OpenAI image API.

Usage:
  python tools/gen_image.py <prompt.txt> <out.png> [--aspect 3:2] [--model gemini-3-pro-image | gpt-image-1]

Keys are read from .env in this folder (GEMINI_API_KEY=..., OPENAI_API_KEY=...).
.env is git-ignored; this script never prints a key. Both APIs need billing on
the account for image models.
"""
import argparse, base64, json, os, re, sys, urllib.error, urllib.request

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def key(name):
    try:
        m = re.search(r'^%s=(\S+)' % name, open(os.path.join(HERE, '.env'), encoding='utf-8').read(), re.M)
    except FileNotFoundError:
        m = None
    if not m:
        sys.exit('%s is not set in .env' % name)
    return m.group(1)


def post(url, body, headers):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=dict(headers, **{'Content-Type': 'application/json'}))
    try:
        return json.load(urllib.request.urlopen(req, timeout=300))
    except urllib.error.HTTPError as e:
        err = json.load(e).get('error', {})
        sys.exit('API error: %s %s' % (err.get('status') or err.get('code'), (err.get('message') or '')[:300]))


def gemini(prompt, aspect, model):
    d = post('https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent' % model,
             {'contents': [{'parts': [{'text': prompt}]}],
              'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': aspect}}},
             {'x-goog-api-key': key('GEMINI_API_KEY')})
    for c in d.get('candidates', []):
        for p in c.get('content', {}).get('parts', []):
            if 'inlineData' in p:
                return base64.b64decode(p['inlineData']['data'])
    sys.exit('No image in the response')


def openai(prompt, aspect, model):
    size = {'3:2': '1536x1024', '2:3': '1024x1536'}.get(aspect, '1024x1024')
    d = post('https://api.openai.com/v1/images/generations',
             {'model': model, 'prompt': prompt, 'size': size, 'quality': 'high'},
             {'Authorization': 'Bearer ' + key('OPENAI_API_KEY')})
    return base64.b64decode(d['data'][0]['b64_json'])


if __name__ == '__main__':
    a = argparse.ArgumentParser()
    a.add_argument('prompt_file')
    a.add_argument('out')
    a.add_argument('--aspect', default='1:1')
    a.add_argument('--model', default='gemini-3-pro-image')
    args = a.parse_args()
    prompt = open(args.prompt_file, encoding='utf-8').read()
    make = openai if args.model.startswith('gpt') else gemini
    open(args.out, 'wb').write(make(prompt, args.aspect, args.model))
    print('saved', args.out)
