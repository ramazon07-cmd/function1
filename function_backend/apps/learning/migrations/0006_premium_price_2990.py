from decimal import Decimal

from django.db import migrations


def lower_premium_price(apps, schema_editor):
    Test = apps.get_model('learning', 'Test')
    Test.objects.filter(is_premium=True, price=Decimal('4990.00')).update(price=Decimal('2990.00'))


class Migration(migrations.Migration):

    dependencies = [
        ('learning', '0005_paymentrequest_telegram_receipt_sent_and_premium_price'),
    ]

    operations = [
        migrations.RunPython(lower_premium_price, migrations.RunPython.noop),
    ]
