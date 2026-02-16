from django.contrib import admin
from .models import Poll, Option, Vote


class OptionInline(admin.TabularInline):
    model = Option
    extra = 3  # show 3 option boxes


class PollAdmin(admin.ModelAdmin):
    inlines = [OptionInline]


admin.site.register(Poll, PollAdmin)
admin.site.register(Vote)
