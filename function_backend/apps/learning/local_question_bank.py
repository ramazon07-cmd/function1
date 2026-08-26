import json
from functools import lru_cache
from pathlib import Path


DATA_PATH = Path(__file__).resolve().parent / 'data' / 'local_question_bank.json'
APOSTROPHES = str.maketrans({
    'ʻ': "'", 'ʼ': "'", '’': "'", '‘': "'", '`': "'", '´': "'",
})


def normalize_bank_key(value):
    return ' '.join(str(value or '').translate(APOSTROPHES).strip().lower().split())


@lru_cache(maxsize=1)
def load_local_question_bank():
    if not DATA_PATH.exists():
        raise RuntimeError(
            'Local question-bank manifest topilmadi. '
            'Patchdagi generate_question_manifest.py skriptini qayta ishga tushiring.'
        )
    with DATA_PATH.open('r', encoding='utf-8') as fh:
        data = json.load(fh)
    if not data.get('version') or not isinstance(data.get('sets'), list):
        raise RuntimeError('Local question-bank manifest noto‘g‘ri formatda.')
    return data


def get_local_test_bank_entry(subject_slug, test_title):
    data = load_local_question_bank()
    wanted = (normalize_bank_key(subject_slug), normalize_bank_key(test_title))
    for entry in data['sets']:
        key = (normalize_bank_key(entry.get('category')), normalize_bank_key(entry.get('topic')))
        if key == wanted:
            return data['version'], entry
    return data['version'], None
