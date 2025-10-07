from urllib.parse import urlparse, urljoin

from flask import redirect, request
import markdown
import bleach
from bs4 import BeautifulSoup


def is_safe_url(target):
  ref_url = urlparse(request.host_url)
  test_url = urlparse(urljoin(request.host_url, target))
  return test_url.scheme in ('http', 'https') and ref_url.netloc == test_url.netloc


def safe_redirect(target):
  if target and is_safe_url(target):
    return redirect(target)
  from flask import abort
  abort(400, description="Invalid redirect target.")


def markdown_to_html(text):
  if not text:
    return ''

  md = markdown.Markdown(extensions=[
    'markdown.extensions.fenced_code',
    'markdown.extensions.codehilite',
    'markdown.extensions.tables',
    'markdown.extensions.nl2br',
    'markdown.extensions.sane_lists',
  ])

  html = md.convert(text)

  clean_html = bleach.clean(
    html,
    tags=list(bleach.ALLOWED_TAGS) + [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'pre', 'code',
      'hr',
      'img',
    ],
    attributes={
      **bleach.ALLOWED_ATTRIBUTES,
      'code': ['class'],
      'pre': ['class'],
      'img': ['src', 'alt', 'title'],
    },
    strip=True
  )

  return clean_html


def get_preview(html_content, max_length=200):
  """Get clean text preview with smart image handling"""
  if not html_content:
    return ''

  soup = BeautifulSoup(html_content, 'html.parser')

  for img in soup.find_all('img'):
    alt_text = img.get('alt', 'Image')
    img_placeholder = soup.new_tag('span')
    img_placeholder.string = f'[{alt_text}]'
    img.replace_with(img_placeholder)

  for tag in soup.find_all(['video', 'iframe', 'object', 'embed']):
    tag.decompose()

  text_content = soup.get_text()
  text_content = ' '.join(text_content.split())

  if len(text_content) <= max_length:
    return text_content

  truncated = text_content[:max_length]
  last_space = truncated.rfind(' ')

  if last_space > max_length * 0.8:
    return truncated[:last_space] + '...'
  else:
    return truncated + '...'
