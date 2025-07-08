import os
import re

TEMPLATE_DIR = "flaskr/templates"


def find_forms_in_file(filepath):
    with open(filepath, encoding="utf-8") as f:
        content = f.read()
    forms = re.findall(r"<form[\s\S]*?</form>", content, re.IGNORECASE)
    return forms


def has_csrf_token(form_html):
    return 'name="csrf_token"' in form_html or "{{ csrf_token()" in form_html or "{{ form.hidden_tag()" in form_html


def test_all_forms_have_csrf_token():
    for root, _, files in os.walk(TEMPLATE_DIR):
        for file in files:
            if file.endswith(".jinja2"):
                path = os.path.join(root, file)
                forms = find_forms_in_file(path)
                for form in forms:
                    assert has_csrf_token(form), f"Kein CSRF-Token in Formular in {path}"
