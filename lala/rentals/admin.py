from django.contrib import admin
from .models import Property, PropertyImage, Booking

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1  # Optional: How many empty forms you want to show

class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'price_per_night', 'host', 'created_at')
    search_fields = ('title', 'location')
    list_filter = ('location', 'host')
    inlines = [PropertyImageInline]  # Allow adding images directly in the Property admin

class BookingAdmin(admin.ModelAdmin):
    list_display = ('property', 'renter', 'check_in', 'check_out', 'status')
    list_filter = ('status',)
    search_fields = ('renter__username', 'property__title')

admin.site.register(Property, PropertyAdmin)
admin.site.register(PropertyImage)
admin.site.register(Booking, BookingAdmin)
