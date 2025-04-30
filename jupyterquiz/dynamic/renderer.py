"""
Module for rendering HTML, CSS, and JavaScript components of the quiz display.
"""
import importlib.resources
from string import Template

def render_div(div_id, shuffle_questions, shuffle_answers,
               preserve_responses, num, max_width,
               border_radius, question_alignment):
    """
    Build the HTML container div with data attributes and inline style.
    """
    preserve_json = 'true' if preserve_responses else 'false'
    return (
        f'<div id="{div_id}" '
        f'data-shufflequestions="{shuffle_questions}" '
        f'data-shuffleanswers="{shuffle_answers}" '
        f'data-preserveresponses="{preserve_json}" '
        f'data-numquestions="{num}" '
        f'data-maxwidth="{max_width}" '
        f'style="border-radius: {border_radius}px; text-align: {question_alignment}">'
    )

def build_styles(div_id, color_dict):
    """
    Build the <style> tag content with CSS variables and external styles.
    """
    resource_package = __name__
    package = resource_package.split('.')[0]
    styles = '<style>\n'
    styles += f'#{div_id} ' + '{\n'
    for var, color in color_dict.items():
        styles += f'   {var}: {color};\n'
    styles += '}\n\n'
    # Append shared CSS
    css_path = importlib.resources.files(package).joinpath('styles.css')
    css = css_path.read_bytes().decode('utf-8')
    styles += css
    styles += '</style>'
    return styles

def build_script(prefix_script, static, url, div_id, load_js):
    """
    Combine the loading prefix, static JS files, and suffix template into a single script.
    """
    resource_package = __name__
    package = resource_package.split('.')[0]
    script = prefix_script

    # Load all static JS modules
    if load_js:
        js_dir = importlib.resources.files(package).joinpath('js')
        for js_file in sorted(js_dir.iterdir(), key=lambda x: x.name):
            if js_file.name.endswith('.js'):
                script += js_file.read_bytes().decode('utf-8')

    # Append appropriate suffix behavior
    if static:
        tpl_path = importlib.resources.files(package).joinpath('js/static_suffix.js.tpl')
        tpl = tpl_path.read_text()
        script += Template(tpl).substitute(div_id=div_id)
    else:
        tpl_path = importlib.resources.files(package).joinpath('js/async_suffix.js.tpl')
        tpl = tpl_path.read_text()
        script += Template(tpl).substitute(url=url, div_id=div_id)

    # Append the final script
    script += '\n}\n'



    return script
