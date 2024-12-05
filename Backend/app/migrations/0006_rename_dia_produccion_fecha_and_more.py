# Generated by Django 5.1.2 on 2024-12-05 18:02

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_alter_estacion_usuario'),
    ]

    operations = [
        migrations.RenameField(
            model_name='produccion',
            old_name='Dia',
            new_name='fecha',
        ),
        migrations.RenameField(
            model_name='produccion',
            old_name='Hora',
            new_name='hora',
        ),
        migrations.AddField(
            model_name='produccion',
            name='anio',
            field=models.IntegerField(default=2024, validators=[django.core.validators.MinValueValidator(1900), django.core.validators.MaxValueValidator(2100)]),
        ),
        migrations.AddField(
            model_name='produccion',
            name='dia',
            field=models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(31)]),
        ),
        migrations.AddField(
            model_name='produccion',
            name='mes',
            field=models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(12)]),
        ),
    ]
