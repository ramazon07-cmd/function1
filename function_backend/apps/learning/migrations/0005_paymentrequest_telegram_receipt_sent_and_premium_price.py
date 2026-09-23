from decimal import Decimal

from django.db import migrations, models


def set_premium_price(apps, schema_editor):
    Test = apps.get_model('learning', 'Test')
    Test.objects.filter(is_premium=True).update(price=Decimal('4990.00'))


class Migration(migrations.Migration):

    dependencies = [
        ('learning', '0004_feedback_profile_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='paymentrequest',
            name='telegram_receipt_sent',
            field=models.BooleanField(default=False),
        ),
        migrations.RunPython(set_premium_price, migrations.RunPython.noop),
    ]
