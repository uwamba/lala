from django.urls import path
from . import views

urlpatterns = [
    path('properties/', views.property_list, name='property-list'),  # List all properties
    path('properties/add/', views.property_create, name='property_create'),  # Add a new propertyproperty_create
    path('properties/bookings/', views.add_booking, name='create-booking'),
    path('properties/<int:property_id>/', views.get_property, name='property-detail'),
    path('properties/<int:property_id>/update/', views.update_property, name='property-update'),
    
    path('bookings/',  views.booking_list, name='booking-list'),
    path('bookings/<int:booking_id>/update/',  views.update_booking_status, name='update-booking-status'),
    path('bookings/<int:booking_id>/delete/',  views.delete_booking, name='delete-booking'),
    path('properties/delete/<int:pk>/', views.delete_property, name='delete_property'),
]
