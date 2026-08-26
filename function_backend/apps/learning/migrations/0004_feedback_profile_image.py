from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('learning', '0003_testattempt_client_attempt_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='profile_image',
            field=models.FileField(blank=True, null=True, upload_to='feedback_profiles/%Y/%m/'),
        ),
    ]
