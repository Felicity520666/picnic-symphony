#!/usr/bin/env python3
"""Translation key parity checker for Picnic Symphony."""
import re, sys, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

content = open('src/i18n.js').read()
langs = re.findall(r"^\s{2}(\w+):\s*\{", content, re.MULTILINE)

blocks = {}
for i, lang in enumerate(langs):
    start = content.find(f"  {lang}: {{")
    if i + 1 < len(langs):
        end = content.find(f"  {langs[i+1]}: {{")
    else:
        end = content.find("};", start)
    block = content[start:end]
    blocks[lang] = set(re.findall(r"'([^']+)':", block))

en_keys = blocks['en']
errors = 0

print(f"Canonical (EN): {len(en_keys)} keys")
print(f"Supported locales: {langs}\n")

for lang in langs:
    if lang == 'en':
        continue
    missing = sorted(en_keys - blocks[lang])
    if missing:
        print(f"FAIL: {lang} missing {len(missing)} keys:")
        for k in missing[:10]:
            print(f"  - {k}")
        if len(missing) > 10:
            print(f"  ... and {len(missing)-10} more")
        errors += 1
    else:
        print(f"PASS: {lang} ({len(blocks[lang])} keys)")

if errors == 0:
    print("\nALL LOCALES COMPLETE")
else:
    print(f"\n{errors} LOCALES INCOMPLETE")
    sys.exit(1)
