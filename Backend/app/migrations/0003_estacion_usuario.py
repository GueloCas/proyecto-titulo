# Generated by Django 5.1.2 on 2024-11-26 02:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_estacion_inversor_estacion'),
    ]

    operations = [
        migrations.AddField(
            model_name='estacion',
            name='usuario',
            field=models.CharField(max_length=200, null=True),
        ),
    ]