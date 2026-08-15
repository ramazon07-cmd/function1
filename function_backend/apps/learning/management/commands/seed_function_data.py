from django.core.management.base import BaseCommand
from apps.learning.models import Subject, Course, Test, Question, Option


SUBJECTS = [
    ('math', 'Matematika', 'Algebra, kasrlar, tenglamalar va foizlar.', False),
    ('geo', 'Geometriya', 'Burchaklar, uchburchaklar, aylana va yuzalar.', False),
    ('logic', 'Mantiq', 'IQ, analogiya, ketma-ketlik va deduktiv fikrlash.', False),
    ('iq', 'Iqtisod', 'Bozor, talab-taklif, pul, bank va iqtisodiy savodxonlik.', True),
]

COURSES = {
    'math': [
        ('Algebra', 'Formulalar, ifodalar va tenglamalarni oson o‘rganing.'),
        ('Kasrlar va foizlar', 'Hisob-kitobni tez va aniq qilish uchun asosiy mavzular.'),
    ],
    'geo': [
        ('Geometriya asoslari', 'Shakllar, burchaklar va yuzalarni tushuning.'),
        ('Fazoviy fikrlash', 'Geometrik masalalarda vizual fikrlashni rivojlantiring.'),
    ],
    'logic': [
        ('Mantiqiy fikrlash', 'IQ va analytical thinkingni kuchaytiruvchi topshiriqlar.'),
        ('Deduktiv mantiq', 'Xulosalar, shartlar va mantiqiy munosabatlar.'),
    ],
    'iq': [
        ('Iqtisod asoslari', 'Bozor, pul va moliyaviy qarorlarni tushunish.'),
        ('Moliyaviy savodxonlik', 'Real hayotdagi iqtisodiy qarorlar uchun bilim.'),
    ],
}

TEST_TOPICS = {
    'math': [
        'Natural sonlar va amallar', 'Matnli Masalalar', "Ko'phadlar",
        'Proporsiyalar', 'Ketma-ketliklar va Progressiyalar', 'Tengsizliklar',
        'Foizlar', 'Kasrlar', "O'nli kasrlar", 'Darajalar',
        'Algebraik ifodalar', 'Kvadrat ildizlar', 'Chiziqli tenglamalar',
        'Logarifimlar', 'Ildizlar',
    ],
    'geo': [
        "Nuqta va to'g'ri chiziq", 'Burchaklar', 'Uchburchaklar',
        'Parallelogramma', 'Aylana va doira',
    ],
    'logic': [
        'Mantiqiy savollar', 'IQ testlari', 'Sonlar ketma-ketligi', 'Topishmoqlar',
        'Deduktiv mantiq', 'Mantiqiy munosabatlar', 'Shartli mantiq',
        'Analogiyalar', 'Matritsali mantiq', 'Ortiqcha elementni toping',
    ],
    'iq': [
        'Iqtisodiyot nazariyasi asoslari', 'Bozor iqtisodiyoti va uning mexanizmi',
        'Talab va taklif qonunlari', 'Makroiqtisodiyot asoslari',
        'Mikroiqtisodiyot asoslari', 'Pul va bank tizimi', 'Inflyatsiya va ishsizlik',
        'Davlat byudjeti va soliq tizimi', 'Xalqaro iqtisodiy munosabatlar',
        'Iqtisodiy o‘sish va rivojlanish',
    ],
}

SAMPLE_QUESTIONS = {
    'math': [
        ("(24 + 18) ÷ 6 = ?", ['6', '7', '8', '9'], '7'),
        ("15 × 4 − 18 = ?", ['38', '40', '42', '44'], '42'),
        ("12 : 18 = 20 : x. x = ?", ['28', '30', '32', '34'], '30'),
        ("3x - 7 > 20 bo'lsa, x ning eng kichik butun qiymati?", ['8', '9', '10', '11'], '10'),
        ("25% of 200 = ?", ['25', '40', '50', '75'], '50'),
    ],
    'geo': [
        ("Uchburchak ichki burchaklari yig'indisi nechaga teng?", ['90°', '180°', '270°', '360°'], '180°'),
        ("Radius 7 bo‘lsa, diametr nechaga teng?", ['7', '14', '21', '28'], '14'),
        ("Parallelogrammada qarama-qarshi tomonlar qanday bo‘ladi?", ['teng va parallel', 'kesishuvchi', 'perpendikulyar', 'egri'], 'teng va parallel'),
        ("Kvadrat yuzi formulasi qaysi?", ['a + a', '4a', 'a²', '2a'], 'a²'),
        ("Doira yuzi qaysi formulaga teng?", ['2πr', 'πr²', 'πd', 'r²/2'], 'πr²'),
    ],
    'logic': [
        ("2, 6, 12, 20, 30, ?", ['40', '41', '42', '44'], '42'),
        ("Qaysi so'z boshqalaridan farq qiladi?", ['Kvadrat', 'Doira', 'Uchburchak', 'Qalam'], 'Qalam'),
        ("Barcha shifokorlar oliy ma'lumotli. Aziz shifokor. Xulosa?", ['Aziz talaba', 'Aziz oliy maʼlumotli', 'Aziz o‘qituvchi', 'Aniqlab bo‘lmaydi'], 'Aziz oliy maʼlumotli'),
        ("Kapitan : Kema = Uchuvchi : ?", ['Samolyot', 'Poezd', 'Avtomobil', 'Velosiped'], 'Samolyot'),
        ("Qaysi biri ortiqcha?", ['React', 'Vue', 'Angular', 'Express'], 'Express'),
    ],
    'iq': [
        ("Talab oshib, taklif o'zgarmasa, narx odatda qanday bo‘ladi?", ['pasayadi', 'oshadi', 'o‘zgarmaydi', 'yo‘qoladi'], 'oshadi'),
        ("Inflyatsiya nimani bildiradi?", ['narxlar umumiy oshishi', 'ishsizlik kamayishi', 'soliq bekor bo‘lishi', 'eksport yo‘qolishi'], 'narxlar umumiy oshishi'),
        ("Bankning asosiy vazifalaridan biri?", ['pul saqlash va kredit berish', 'faqat soliq yig‘ish', 'qonun chiqarish', 'sud qilish'], 'pul saqlash va kredit berish'),
        ("Bozor iqtisodiyotida narx ko‘pincha nimaga bog‘liq?", ['talab va taklifga', 'faqat ob-havoga', 'faqat davlat madhiyasiga', 'tasodifga'], 'talab va taklifga'),
        ("Davlat byudjeti asosan nimadan shakllanadi?", ['soliqlar va tushumlar', 'faqat sovg‘alar', 'faqat kredit kartalar', 'faqat import'], 'soliqlar va tushumlar'),
    ],
}


class Command(BaseCommand):
    help = 'Seed Function Platform subjects, courses, tests, questions, and options.'

    def handle(self, *args, **options):
        for index, (slug, name, desc, featured) in enumerate(SUBJECTS, start=1):
            subject, _ = Subject.objects.update_or_create(
                slug=slug,
                defaults={
                    'name': name,
                    'description': desc,
                    'is_featured': featured,
                    'order': index,
                },
            )

            for course_index, (course_title, course_desc) in enumerate(COURSES[slug], start=1):
                Course.objects.update_or_create(
                    subject=subject,
                    title=course_title,
                    defaults={
                        'description': course_desc,
                        'level': 'Boshlangich',
                        'order': course_index,
                        'is_active': True,
                    },
                )

            for test_index, topic in enumerate(TEST_TOPICS[slug], start=1):
                test, created = Test.objects.update_or_create(
                    subject=subject,
                    title=topic,
                    defaults={
                        'description': f'{topic} bo‘yicha qisqa test.',
                        'duration_minutes': 30,
                        'is_premium': test_index <= 5,
                        'price': 5000 if test_index <= 5 else 0,
                        'is_active': True,
                        'order': test_index,
                    },
                )

                # Existing questions and user answer history are preserved on re-seed.
                if created or not test.questions.exists():
                    base_questions = SAMPLE_QUESTIONS[slug]
                    for q_index in range(15):
                        q_text, question_options, correct = base_questions[q_index % len(base_questions)]
                        question = Question.objects.create(
                            test=test,
                            text=q_text,
                            explanation=f'To‘g‘ri javob: {correct}',
                            order=q_index + 1,
                        )
                        for o_index, option_text in enumerate(question_options, start=1):
                            Option.objects.create(
                                question=question,
                                text=option_text,
                                is_correct=(option_text == correct),
                                order=o_index,
                            )

            Test.objects.filter(subject=subject).exclude(title__in=TEST_TOPICS[slug]).update(is_active=False)

        self.stdout.write(self.style.SUCCESS('Function Platform seed data created successfully.'))
