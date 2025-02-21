from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'role', 'is_staff', 'is_active']  # Customize fields to show in the list view
    list_filter = ['role', 'is_staff', 'is_active']  # Add filters
    search_fields = ['username', 'email']  # Allow search by username and email
    ordering = ['username']  # Set ordering by username

    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),  # Add 'role' field
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role',)}),  # Add 'role' field during user creation
    )

# Register the custom user model
admin.site.register(CustomUser, CustomUserAdmin)
